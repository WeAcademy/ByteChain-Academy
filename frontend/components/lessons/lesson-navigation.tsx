"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LessonNavigationProps {
  courseId: string;
  prevLessonId?: string | null;
  nextLessonId?: string | null;
  prevLessonTitle?: string | null;
  nextLessonTitle?: string | null;
}

export function LessonNavigation({
  courseId,
  prevLessonId,
  nextLessonId,
  prevLessonTitle,
  nextLessonTitle,
}: LessonNavigationProps) {
  const baseHref = `/courses/${courseId}/lessons`;

  return (
    <nav
      aria-label="Lesson navigation"
      className="mt-10 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between"
    >
      {prevLessonId ? (
        <Link
          href={`${baseHref}/${prevLessonId}`}
          className="group inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-blue-500 hover:text-blue-600"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="flex flex-col items-start">
            <span className="text-xs font-normal text-gray-400">Previous</span>
            <span className="max-w-[16rem] truncate">
              {prevLessonTitle ?? "Previous lesson"}
            </span>
          </span>
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-gray-100 px-4 py-3 text-sm font-medium text-gray-300"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="flex flex-col items-start">
            <span className="text-xs font-normal text-gray-300">Previous</span>
            <span>First lesson</span>
          </span>
        </span>
      )}

      {nextLessonId ? (
        <Link
          href={`${baseHref}/${nextLessonId}`}
          className="group inline-flex items-center justify-end gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-blue-500 hover:text-blue-600 sm:ml-auto"
        >
          <span className="flex flex-col items-end">
            <span className="text-xs font-normal text-gray-400">Next</span>
            <span className="max-w-[16rem] truncate">
              {nextLessonTitle ?? "Next lesson"}
            </span>
          </span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex cursor-not-allowed items-center justify-end gap-2 rounded-lg border border-gray-100 px-4 py-3 text-sm font-medium text-gray-300 sm:ml-auto"
        >
          <span className="flex flex-col items-end">
            <span className="text-xs font-normal text-gray-300">Next</span>
            <span>Last lesson</span>
          </span>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}

export default LessonNavigation;
