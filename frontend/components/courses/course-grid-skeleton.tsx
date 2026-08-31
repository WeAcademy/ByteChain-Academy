"use client";

import { CourseCardSkeleton } from "@/components/courses/course-card-skeleton";

interface CourseGridSkeletonProps {
  count?: number;
}

export function CourseGridSkeleton({ count = 6 }: CourseGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}
