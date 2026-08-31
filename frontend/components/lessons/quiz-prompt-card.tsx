"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileQuestion, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface QuizPromptCardProps {
  courseId: string
  quizId: string
  lessonTitle: string
}

export function QuizPromptCard({
  courseId,
  quizId,
  lessonTitle,
}: QuizPromptCardProps) {
  const router = useRouter()

  const handleQuizClick = () => {
    router.push(`/courses/${courseId}/quizzes/${quizId}`)
  }

  return (
    <Card className="mt-6 border-[#00ff88]/30 bg-gradient-to-br from-[#00ff88]/5 via-[#080e22] to-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/0 via-[#00ff88]/10 to-[#00ff88]/0 opacity-50" />
      <CardContent className="p-6 relative">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-[#00ff88]/20 to-[#00d88b]/10 border border-[#00ff88]/30 flex-shrink-0">
            <FileQuestion className="w-6 h-6 text-[#00ff88]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-1">
              Ready to Test Your Knowledge?
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              This lesson has a quiz to help you reinforce what you learned in &ldquo;{lessonTitle}&rdquo;.
            </p>
            <Button
              onClick={handleQuizClick}
              className="bg-gradient-to-r from-[#00ff88] to-[#00d88b] text-[#002E20] hover:from-[#00d88b] hover:to-[#00ff88] transition-all duration-300 font-semibold shadow-lg shadow-[#00ff88]/20"
            >
              <FileQuestion className="w-4 h-4 mr-2" />
              Take Quiz
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
