"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type SortOption = "newest" | "popular" | "az";

export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  rating?: number;
  duration?: number;
  lessons?: number;
  students?: number;
  enrollmentCount?: number;
  isEnrolled?: boolean;
  instructor?: string;
  tags?: string[];
  createdAt?: string;
}

export interface CoursesPage {
  data: Course[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CourseFilterParams {
  search?: string;
  difficulty?: Difficulty | "";
  tags?: string[];
  sort?: SortOption;
}

const PAGE_SIZE = 9;

export function useCourses(filters: CourseFilterParams) {
  return useInfiniteQuery<CoursesPage>({
    queryKey: ["courses", filters],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set("page", String(pageParam));
      params.set("limit", String(PAGE_SIZE));

      if (filters.search) params.set("search", filters.search);
      if (filters.difficulty) params.set("difficulty", filters.difficulty);
      if (filters.tags && filters.tags.length > 0) {
        params.set("tags", filters.tags.join(","));
      }
      if (filters.sort) params.set("sort", filters.sort);

      const res = await api.get<CoursesPage | Course[]>(
        `/courses?${params.toString()}`
      );

      if (Array.isArray(res)) {
        return {
          data: res,
          total: res.length,
          page: pageParam as number,
          limit: PAGE_SIZE,
          totalPages: 1,
        };
      }

      return {
        data: res.data ?? [],
        total: res.total ?? 0,
        page: res.page ?? (pageParam as number),
        limit: res.limit ?? PAGE_SIZE,
        totalPages: res.totalPages ?? 1,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
}

export function useCourseTags() {
  return useQuery<string[]>({
    queryKey: ["course-tags"],
    queryFn: async () => {
      const res = await api.get<string[] | { data: string[] }>(
        "/courses/tags"
      );
      return Array.isArray(res) ? res : res.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
