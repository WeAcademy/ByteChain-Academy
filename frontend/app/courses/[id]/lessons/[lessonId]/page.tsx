"use client"

import { use, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLearning } from "@/contexts/learning-context"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  BookOpen,
  Video,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { VideoPlayer } from "@/components/lessons/video-player"
import { MarkdownContent } from "@/components/lessons/markdown-content"
import { LessonNavigation } from "@/components/lessons/lesson-navigation"
import { QuizPromptCard } from "@/components/lessons/quiz-prompt-card"

/**
 * Determines the lesson type based on available data.
 * If a videoUrl is present, it is a "video" lesson; otherwise it is "text".
 */
function getLessonType(lesson: {
  videoUrl?: string
  content?: string
}): "video" | "text" {
  return lesson.videoUrl ? "video" : "text"
}

/**
 * Returns a human-readable duration badge string.
 * For video lessons: "N min video"
 * For text lessons: "~N min read"
 */
function getDurationBadge(
  type: "video" | "text",
  durationMinutes?: number,
  content?: string
): string {
  if (type === "video") {
    return durationMinutes ? `${durationMinutes} min video` : "Video lesson"
  }

  // Estimate reading time from content (~200 words per minute)
  if (content) {
    const wordCount = content.trim().split(/\s+/).length
    const minutes = Math.max(1, Math.ceil(wordCount / 200))
    return `~${minutes} min read`
  }

  return durationMinutes ? `~${durationMinutes} min read` : "Text lesson"
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>
}) {
  const { id, lessonId } = use(params)
  const { courses, markLessonComplete, isCompletingLesson } = useLearning()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [justCompleted, setJustCompleted] = useState(false)

  const course = courses.find((c) => c.id === id)
  const lesson = course?.lessons.find((l) => l.id === lessonId)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Header />
        <main className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Please sign in to access lessons
          </h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </main>
      </div>
    )
  }

  if (!course || !lesson) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Header />
        <main className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Lesson not found</h1>
          <Link href={`/courses/${id}`}>
            <Button variant="outline">Back to Course</Button>
          </Link>
        </main>
      </div>
    )
  }

  const sortedLessons = [...course.lessons].sort((a, b) => a.order - b.order)
  const currentIndex = sortedLessons.findIndex((l) => l.id === lesson.id)
  const nextLesson =
    currentIndex < sortedLessons.length - 1
      ? sortedLessons[currentIndex + 1]
      : null
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null

  const lessonType = getLessonType(lesson as { videoUrl?: string; content?: string })
  const durationBadge = getDurationBadge(
    lessonType,
    undefined,
    (lesson as { content?: string }).content
  )

  const handleMarkComplete = async () => {
    const didComplete = await markLessonComplete(course.id, lesson.id)
    if (didComplete) {
      setJustCompleted(true)
      toast.success("Lesson marked as complete!")
      setTimeout(() => setJustCompleted(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Back navigation */}
        <div className="mb-6">
          <Link href={`/courses/${course.id}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
          </Link>
        </div>

        {/* Lesson Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-bold">{lesson.title}</h1>
            {lesson.completed && (
              <CheckCircle2 className="w-6 h-6 text-[#00ff88] flex-shrink-0" />
            )}
          </div>
          <p className="text-gray-400 mb-4">{lesson.description}</p>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Duration badge */}
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 font-medium">
              {lessonType === "video" ? (
                <Video className="w-3.5 h-3.5 text-[#00ff88]" />
              ) : (
                <BookOpen className="w-3.5 h-3.5 text-[#00ff88]" />
              )}
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              {durationBadge}
            </span>
            {/* Lesson position */}
            <span className="text-xs text-gray-500">
              Lesson {currentIndex + 1} of {sortedLessons.length}
            </span>
          </div>
        </div>

        {/* Video Player (for video-type lessons) */}
        {lessonType === "video" && (
          <Card className="mb-6">
            <CardContent className="p-0">
              <VideoPlayer
                videoUrl={lesson.videoUrl}
                title={lesson.title}
                videoStartTimestamp={
                  (lesson as { videoStartTimestamp?: number }).videoStartTimestamp
                }
              />
            </CardContent>
          </Card>
        )}

        {/* Text Content / Notes */}
        {((lessonType === "text" && (lesson as { content?: string }).content) ||
          (lessonType === "video" && (lesson as { content?: string }).content)) && (
          <Card className="mb-6">
            <CardContent className="p-6">
              {lessonType === "video" && (
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#00ff88]" />
                  Notes
                </h2>
              )}
              <MarkdownContent
                content={(lesson as { content?: string }).content || ""}
              />
            </CardContent>
          </Card>
        )}

        {/* Mark Complete / Completed button */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {!lesson.completed && !justCompleted ? (
                <Button
                  onClick={handleMarkComplete}
                  disabled={isCompletingLesson}
                  className="bg-[#00ff88] text-[#002E20] hover:bg-[#00d88b] flex-1 font-semibold"
                >
                  {isCompletingLesson ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Marking Complete...
                    </>
                  ) : (
                    "Mark as Complete"
                  )}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  disabled
                  className={`flex-1 border-[#00ff88] text-[#00ff88] ${
                    justCompleted ? "animate-pulse" : ""
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {justCompleted ? "Completed!" : "Completed"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quiz Prompt Card */}
        {lesson.hasQuiz && lesson.quizId && (
          <QuizPromptCard
            courseId={course.id}
            quizId={lesson.quizId}
            lessonTitle={lesson.title}
          />
        )}

        {/* Lesson Navigation */}
        <LessonNavigation
          courseId={course.id}
          prevLesson={prevLesson ? { id: prevLesson.id, title: prevLesson.title } : null}
          nextLesson={nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null}
        />
      </main>
    </div>
  )
}
