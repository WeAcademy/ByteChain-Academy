"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, SlidersHorizontal } from "lucide-react";
import type { Difficulty, SortOption } from "@/hooks/use-courses";

interface CourseFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  difficulty: Difficulty | "";
  onDifficultyChange: (value: Difficulty | "") => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags: string[];
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  onClearAll: () => void;
}

const DIFFICULTIES: { label: string; value: Difficulty | "" }[] = [
  { label: "All", value: "" },
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Newest", value: "newest" },
  { label: "Most Popular", value: "popular" },
  { label: "A-Z", value: "az" },
];

const difficultyPillColors: Record<string, string> = {
  "": "bg-white/10 text-white hover:bg-white/20",
  Beginner: "bg-[#03202c] text-[#00eeb0]",
  Intermediate: "bg-[#031e39] text-[#4ad7ff]",
  Advanced: "bg-[#1b143a] text-[#e3b1ff]",
};

export function CourseFilters({
  search,
  onSearchChange,
  difficulty,
  onDifficultyChange,
  selectedTags,
  onTagToggle,
  availableTags,
  sort,
  onSortChange,
  onClearAll,
}: CourseFiltersProps) {
  const hasActiveFilters =
    search.length > 0 ||
    difficulty !== "" ||
    selectedTags.length > 0 ||
    sort !== "newest";

  return (
    <div className="space-y-6 mb-8">
      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
          {search.length > 0 && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 hidden sm:block" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="h-12 rounded-lg bg-[#0b1327] border border-white/10 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00ff88] focus:ring-offset-2"
            aria-label="Sort courses"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Difficulty pills */}
      <div className="flex flex-wrap gap-2">
        {DIFFICULTIES.map((d) => {
          const isActive = difficulty === d.value;
          return (
            <button
              key={d.value}
              onClick={() => onDifficultyChange(d.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? d.value === ""
                    ? "bg-[#02C177] text-[#002E20]"
                    : difficultyPillColors[d.value]
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              } ${isActive ? "ring-2 ring-white/20" : ""}`}
              aria-pressed={isActive}
            >
              {d.label}
            </button>
          );
        })}
      </div>

      {/* Tag chips */}
      {availableTags.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => onTagToggle(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-[#02C177] text-[#002E20]"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                  aria-pressed={isSelected}
                >
                  {tag}
                  {isSelected && <X className="inline w-3 h-3 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Clear all filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-gray-400 hover:text-white gap-1"
        >
          <X className="w-3 h-3" />
          Clear all filters
        </Button>
      )}
    </div>
  );
}
