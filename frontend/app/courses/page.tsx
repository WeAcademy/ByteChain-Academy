"use client"

import { useMemo, useState } from "react"
import { Header } from "@/components/header"
import { CourseCard } from "@/components/course-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, SearchX } from "lucide-react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { CourseCardSkeleton } from "@/components/courses/course-card-skeleton"
import { ErrorCard } from "@/components/ui/error-card"

interface Course {
  id: string
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  rating?: number
  duration?: number
  lessons?: number
  students?: number
  enrollmentCount?: number
  isEnrolled?: boolean
  instructor?: string
  tags?: string[]
}

type Difficulty = "All" | "Beginner" | "Intermediate" | "Advanced"
type SortOption = "newest" | "popular" | "az"

const DIFFICULTIES: Difficulty[] = ["All", "Beginner", "Intermediate", "Advanced"]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "az", label: "A-Z" },
]

function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useMemo(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export default function CoursesPage() {
  const [search, setSearch] = useState("")
  const [difficulty, setDifficulty] = useState<Difficulty>("All")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const debouncedSearch = useDebounce(search, 300)

  const { data: tags } = useQuery<string[]>({
    queryKey: ["course-tags"],
    queryFn: async () => {
      const res = await api.get<{ data?: string[] } | string[]>("/courses/tags")
      const r = res as { data?: string[] } | string[]
      return Array.isArray(r) ? r : (r?.data ?? [])
    },
  })

  const { data, isLoading, isError, refetch } = useQuery<Course[]>({
    queryKey: ["courses", debouncedSearch, difficulty, selectedTags, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (debouncedSearch) params.set("search", debouncedSearch)
      if (difficulty !== "All") params.set("difficulty", difficulty)
      if (selectedTags.length) params.set("tags", selectedTags.join(","))
      params.set("sortBy", sortBy)
      const qs = params.toString()
      const res = await api.get<{ data?: Course[] } | Course[]>(
        `/courses${qs ? `?${qs}` : ""}`,
      )
      const r = res as { data?: Course[] } | Course[]
      return Array.isArray(r) ? r : (r?.data ?? [])
    },
  })

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  const clearFilters = () => {
    setSearch("")
    setDifficulty("All")
    setSelectedTags([])
    setSortBy("newest")
  }

  const hasFilters =
    search !== "" || difficulty !== "All" || selectedTags.length > 0

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

        <div className="mb-8 space-y-4">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-white/30 focus:outline-none"
          />

          <div className="flex flex-wrap items-center gap-2">
            {DIFFICULTIES.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  difficulty === level
                    ? "bg-white text-black"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    selectedTags.includes(tag)
                      ? "border-white bg-white text-black"
                      : "border-white/10 bg-transparent text-gray-300 hover:border-white/30"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-400">
              Sort by
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-[#0a0a0a]">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && (
          <ErrorCard
            message="Failed to load courses. Please try again."
            onRetry={() => void refetch()}
          />
        )}

        {!isLoading && !isError && data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <SearchX className="mb-4 h-12 w-12 text-gray-500" />
                <p className="mb-4 text-gray-400">No courses match your filters.</p>
                {hasFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              data.map((course) => (
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
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
