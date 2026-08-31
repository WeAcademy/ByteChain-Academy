"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface LessonNavigationProps {
  courseId: string
  prevLesson: { id: string; title: string } | null
  nextLesson: { id: string; title: string } | null
}

export function LessonNavigation({
  courseId,
  prevLesson,
  nextLesson,
}: LessonNavigationProps) {
  const router = useRouter()

  const handlePrevLesson = () => {
    if (prevLesson) {
      router.push(`/courses/${courseId}/lessons/${prevLesson.id}`)
    }
  }

  const handleNextLesson = () => {
    if (nextLesson) {
      router.push(`/courses/${courseId}/lessons/${nextLesson.id}`)
    }
  }

  return (
    <div className="flex items-center justify-between mt-6 gap-4">
      {prevLesson ? (
        <Button
          variant="outline"
          onClick={handlePrevLesson}
          className="flex items-center gap-2 max-w-[45%]"
        >
          <ChevronLeft className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">
            <span className="hidden sm:inline">Previous: </span>
            {prevLesson.title}
          </span>
        </Button>
      ) : (
        <div />
      )}

      {nextLesson ? (
        <Button
          onClick={handleNextLesson}
          className="bg-[#00ff88] text-[#002E20] hover:bg-[#00d88b] flex items-center gap-2 max-w-[45%]"
        >
          <span className="truncate">
            <span className="hidden sm:inline">Next: </span>
            {nextLesson.title}
          </span>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={() => router.push(`/courses/${courseId}`)}
          className="flex items-center gap-2"
        >
          Back to Course
        </Button>
      )}
    </div>
  )
}
