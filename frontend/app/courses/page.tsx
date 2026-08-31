"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { CourseCard } from "@/components/course-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, SearchX, RefreshCw } from "lucide-react"
import Link from "next/link"
import { CourseGridSkeleton } from "@/components/courses/course-grid-skeleton"
import { CourseFilters } from "@/components/courses/course-filters"
import { ErrorCard } from "@/components/ui/error-card"
import { useCourses, useCourseTags } from "@/hooks/use-courses"
import { useDebounce } from "@/hooks/use-debounce"
import type { Difficulty, SortOption } from "@/hooks/use-courses"

export default function CoursesPage() {
  // Filter state
  const [search, setSearch] = useState("")
  const [difficulty, setDifficulty] = useState<Difficulty | "">("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sort, setSort] = useState<SortOption>("newest")

  const debouncedSearch = useDebounce(search, 300)

  // Build filter object for the hook
  const filters = useMemo(
    () => ({
      search: debouncedSearch,
      difficulty,
      tags: selectedTags,
      sort,
    }),
    [debouncedSearch, difficulty, selectedTags, sort]
  )

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCourses(filters)

  const { data: tags } = useCourseTags()

  // Flatten all pages into a single courses array
  const courses = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  )

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleClearAll = () => {
    setSearch("")
    setDifficulty("")
    setSelectedTags([])
    setSort("newest")
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Browse All Courses</h1>
          <p className="text-gray-400 text-lg">
            Explore our comprehensive Web3 curriculum. Sign in to enroll and track your progress.
          </p>
        </div>

        {/* Filter bar */}
        <CourseFilters
          search={search}
          onSearchChange={setSearch}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          availableTags={tags ?? []}
          sort={sort}
          onSortChange={setSort}
          onClearAll={handleClearAll}
        />

        {/* Loading state */}
        {isLoading && <CourseGridSkeleton />}

        {/* Error state */}
        {isError && (
          <ErrorCard
            message="Failed to load courses. Please try again."
            onRetry={() => void refetch()}
          />
        )}

        {/* Course grid */}
        {!isLoading && !isError && courses.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  difficulty={course.difficulty ?? "Beginner"}
                  rating={course.rating ?? 0}
                  duration={course.duration ?? 0}
                  lessons={course.lessons ?? 0}
                  students={course.enrollmentCount ?? course.students ?? 0}
                  instructor={course.instructor ?? ""}
                  enrollmentCount={course.enrollmentCount}
                  isEnrolled={course.isEnrolled}
                />
              ))}
            </div>

            {/* Load More button */}
            {hasNextPage && (
              <div className="flex justify-center mt-10">
                <Button
                  variant="outline"
                  onClick={() => void fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="gap-2"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!isLoading && !isError && courses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchX className="w-12 h-12 text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              No courses found
            </h2>
            <p className="text-gray-400 mb-6 max-w-md">
              No courses match your current filters. Try adjusting your search or filters.
            </p>
            <Button variant="outline" onClick={handleClearAll} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Clear filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
