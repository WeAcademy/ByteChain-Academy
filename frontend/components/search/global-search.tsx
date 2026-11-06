"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Coins,
  Loader2,
  PlayCircle,
  Search,
  X,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface CourseResult {
  id: string;
  title: string;
  description: string;
  difficulty: string | null;
  thumbnailUrl: string | null;
}

interface LessonResult {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
}

interface CurrencyResult {
  id: string;
  name: string;
  symbol: string;
  type: "CRYPTO" | "FIAT";
  logoUrl: string | null;
}

interface SearchResults {
  courses: CourseResult[];
  lessons: LessonResult[];
  currencies: CurrencyResult[];
}

const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 2;

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmedQuery = query.trim();
  const totalResults = results
    ? results.courses.length + results.lessons.length + results.currencies.length
    : 0;

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (trimmedQuery.length < MIN_QUERY_LENGTH) {
      setResults(null);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const data = await apiFetch<SearchResults>(
          `/search?q=${encodeURIComponent(trimmedQuery)}`,
          { method: "GET", signal: controller.signal },
        );
        if (!controller.signal.aborted) {
          setResults(data);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Search is unavailable right now. Please try again.");
          setResults(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmedQuery, open]);

  const closeAndNavigate = (path: string) => {
    setOpen(false);
    setQuery("");
    setResults(null);
    router.push(path);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close search" : "Open search"}
        aria-expanded={open}
        aria-controls="global-search-panel"
        className="rounded-lg p-2 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff88]"
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Search className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div
          id="global-search-panel"
          className="absolute right-0 top-full z-50 mt-2 w-[min(92vw,26rem)] overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0b] shadow-2xl"
        >
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-gray-500" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses, lessons, currencies"
              aria-label="Search courses, lessons and currencies"
              className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
            />
            {loading && (
              <Loader2
                className="h-4 w-4 shrink-0 animate-spin text-[#00ff88]"
                aria-hidden="true"
              />
            )}
          </div>

          <div
            className="max-h-96 overflow-y-auto p-2"
            role="region"
            aria-label="Search results"
            aria-live="polite"
          >
            {error && (
              <p className="px-3 py-4 text-sm text-red-400">{error}</p>
            )}

            {!error && trimmedQuery.length < MIN_QUERY_LENGTH && (
              <p className="px-3 py-4 text-sm text-gray-500">
                Type at least {MIN_QUERY_LENGTH} characters to search.
              </p>
            )}

            {!error &&
              trimmedQuery.length >= MIN_QUERY_LENGTH &&
              !loading &&
              results &&
              totalResults === 0 && (
                <p className="px-3 py-4 text-sm text-gray-500">
                  No results found.
                </p>
              )}

            {results && results.courses.length > 0 && (
              <section aria-label="Courses">
                <h3 className="px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Courses
                </h3>
                {results.courses.map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => closeAndNavigate(`/courses/${course.id}`)}
                    className="flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff88]"
                  >
                    <BookOpen
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#00ff88]"
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-white">
                        {course.title}
                      </span>
                      <span className="block truncate text-xs text-gray-500">
                        {course.description}
                      </span>
                    </span>
                  </button>
                ))}
              </section>
            )}

            {results && results.lessons.length > 0 && (
              <section aria-label="Lessons">
                <h3 className="px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Lessons
                </h3>
                {results.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() =>
                      closeAndNavigate(
                        `/courses/${lesson.courseId}/lessons/${lesson.id}`,
                      )
                    }
                    className="flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff88]"
                  >
                    <PlayCircle
                      className="mt-0.5 h-4 w-4 shrink-0 text-sky-400"
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-white">
                        {lesson.title}
                      </span>
                      <span className="block truncate text-xs text-gray-500">
                        {lesson.courseTitle}
                      </span>
                    </span>
                  </button>
                ))}
              </section>
            )}

            {results && results.currencies.length > 0 && (
              <section aria-label="Currencies">
                <h3 className="px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Currencies
                </h3>
                {results.currencies.map((currency) => (
                  <button
                    key={currency.id}
                    type="button"
                    onClick={() => closeAndNavigate(`/currencies/${currency.id}`)}
                    className="flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff88]"
                  >
                    <Coins
                      className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-white">
                        {currency.name}
                      </span>
                      <span className="block truncate text-xs text-gray-500">
                        {currency.symbol}
                      </span>
                    </span>
                  </button>
                ))}
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
