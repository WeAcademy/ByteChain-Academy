"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCourseTags } from "@/hooks/use-courses";

export type CourseDifficulty = "All" | "Beginner" | "Intermediate" | "Advanced";

export type CourseSort = "newest" | "popular" | "az";

export interface CourseFiltersState {
  search: string;
  difficulty: CourseDifficulty;
  tags: string[];
  sortBy: CourseSort;
}

export const DEFAULT_COURSE_FILTERS: CourseFiltersState = {
  search: "",
  difficulty: "All",
  tags: [],
  sortBy: "newest",
};

const DIFFICULTIES: CourseDifficulty[] = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
];

const SORT_OPTIONS: { value: CourseSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "az", label: "A-Z" },
];

function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

interface CourseFiltersProps {
  filters: CourseFiltersState;
  onChange: (filters: CourseFiltersState) => void;
}

export function CourseFilters({ filters, onChange }: CourseFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 300);
  const { data: tags, isLoading: tagsLoading } = useCourseTags();

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onChange({ ...filters, search: debouncedSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const toggleTag = (tag: string) => {
    const nextTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onChange({ ...filters, tags: nextTags });
  };

  const hasActiveFilters =
    filters.search !== "" ||
    filters.difficulty !== "All" ||
    filters.tags.length > 0 ||
    filters.sortBy !== "newest";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search courses..."
            className="pl-9"
            aria-label="Search courses"
          />
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="course-sort"
            className="text-sm text-muted-foreground"
          >
            Sort by
          </label>
          <select
            id="course-sort"
            value={filters.sortBy}
            onChange={(e) =>
              onChange({ ...filters, sortBy: e.target.value as CourseSort })
            }
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {DIFFICULTIES.map((difficulty) => (
          <button
            key={difficulty}
            type="button"
            onClick={() => onChange({ ...filters, difficulty })}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              filters.difficulty === difficulty
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {difficulty}
          </button>
        ))}
      </div>

      {!tagsLoading && tags && tags.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Tags</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const selected = filters.tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={selected}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearchInput("");
            onChange(DEFAULT_COURSE_FILTERS);
          }}
          className="gap-1 text-muted-foreground"
        >
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
