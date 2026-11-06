/**
 * Server-side helpers for course social metadata.
 *
 * The course detail view is a client component (it reads the learning
 * context), so `generateMetadata` fetches the small subset it needs directly
 * from the API instead.
 */

export interface CourseSocialMetadata {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
}

const DEFAULT_OG_IMAGE = "/og-default.png";
const MAX_DESCRIPTION_LENGTH = 160;

function apiBase(): string {
  const raw =
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:3001";
  return raw.endsWith("/api/v1")
    ? raw
    : `${raw.replace(/\/$/, "")}/api/v1`;
}

export function truncateDescription(
  description: string,
  maxLength = MAX_DESCRIPTION_LENGTH,
): string {
  const trimmed = description.trim().replace(/\s+/g, " ");
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1).trimEnd()}…`;
}

export function courseOgImage(course: CourseSocialMetadata): string {
  return course.thumbnailUrl?.trim() ? course.thumbnailUrl : DEFAULT_OG_IMAGE;
}

export async function fetchCourseSocialMetadata(
  id: string,
): Promise<CourseSocialMetadata | null> {
  try {
    const response = await fetch(
      `${apiBase()}/courses/${encodeURIComponent(id)}`,
      { next: { revalidate: 300 } },
    );
    if (!response.ok) return null;

    const data = (await response.json()) as Partial<CourseSocialMetadata>;
    if (typeof data.title !== "string" || data.title.length === 0) {
      return null;
    }

    return {
      id,
      title: data.title,
      description:
        typeof data.description === "string" ? data.description : "",
      thumbnailUrl:
        typeof data.thumbnailUrl === "string" ? data.thumbnailUrl : null,
    };
  } catch {
    // Metadata is best-effort: a slow or unavailable API must not break the
    // page render.
    return null;
  }
}
