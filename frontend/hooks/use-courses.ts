import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export type CourseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type CourseSort = 'newest' | 'popular' | 'az';

export interface CourseFilters {
  search?: string;
  difficulty?: CourseDifficulty | 'All';
  tags?: string[];
  sortBy?: CourseSort;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  difficulty?: CourseDifficulty;
  tags?: string[];
  enrollmentCount?: number;
  isEnrolled?: boolean;
  thumbnailUrl?: string;
  createdAt?: string;
}

export interface CoursePage {
  courses: Course[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';
const DEFAULT_LIMIT = 12;

function buildQueryString(filters: CourseFilters, page: number, limit: number): string {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set('search', filters.search.trim());
  }
  if (filters.difficulty && filters.difficulty !== 'All') {
    params.set('difficulty', filters.difficulty);
  }
  if (filters.tags && filters.tags.length > 0) {
    params.set('tags', filters.tags.join(','));
  }
  if (filters.sortBy) {
    params.set('sortBy', filters.sortBy);
  }

  params.set('page', String(page));
  params.set('limit', String(limit));

  return params.toString();
}

async function fetchCoursePage(
  filters: CourseFilters,
  page: number,
  limit: number,
): Promise<CoursePage> {
  const query = buildQueryString(filters, page, limit);
  const response = await fetch(`${API_BASE}/courses?${query}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch courses (${response.status})`);
  }

  const data = await response.json();

  const courses: Course[] = data.courses ?? data.data ?? data.items ?? [];
  const total: number = data.total ?? data.totalCount ?? courses.length;
  const resolvedLimit: number = data.limit ?? limit;
  const resolvedPage: number = data.page ?? page;
  const totalPages: number =
    data.totalPages ?? Math.max(1, Math.ceil(total / resolvedLimit));

  return {
    courses,
    page: resolvedPage,
    limit: resolvedLimit,
    total,
    totalPages,
    hasMore: data.hasMore ?? resolvedPage < totalPages,
  };
}

export function useCourses(filters: CourseFilters = {}, limit: number = DEFAULT_LIMIT) {
  return useInfiniteQuery({
    queryKey: ['courses', filters, limit],
    queryFn: ({ pageParam = 1 }) => fetchCoursePage(filters, pageParam as number, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}

export function useCourseTags() {
  return useQuery({
    queryKey: ['course-tags'],
    queryFn: async (): Promise<string[]> => {
      const response = await fetch(`${API_BASE}/courses/tags`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch course tags (${response.status})`);
      }

      const data = await response.json();
      const tags = data.tags ?? data.data ?? data;

      if (!Array.isArray(tags)) {
        return [];
      }

      return tags.map((tag: unknown) =>
        typeof tag === 'string' ? tag : String((tag as { name?: string })?.name ?? ''),
      ).filter(Boolean);
    },
    staleTime: 5 * 60 * 1000,
  });
}
