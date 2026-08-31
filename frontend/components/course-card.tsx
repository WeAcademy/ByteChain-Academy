"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, BookOpen, Users, Star, User, BadgeCheck } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { SignUpModal } from "./auth/signup-modal"
import { LoginModal } from "./auth/login-modal"
import { useRouter } from "next/navigation"

interface CourseCardProps {
  id: string
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  rating: number
  duration: number
  lessons: number
  students: number
  instructor: string
  enrollmentCount?: number
  isEnrolled?: boolean
}

const difficultyColors = {
  Beginner: "bg-[#03202c] text-[#00eeb0]",
  Intermediate: "bg-[#031e39] text-[#4ad7ff]",
  Advanced: "bg-[#1b143a] text-[#e3b1ff]",
}

export function CourseCard({
  id,
  title,
  description,
  difficulty,
  rating,
  duration,
  lessons,
  students,
  instructor,
  enrollmentCount,
  isEnrolled,
}: CourseCardProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [signupOpen, setSignupOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  const displayStudents = enrollmentCount ?? students

  const handleCardClick = () => {
    if (isAuthenticated) {
      router.push(`/courses/${id}`)
    } else {
      setSignupOpen(true)
    }
  }

  const handleSwitchToSignup = () => {
    setLoginOpen(false)
    setSignupOpen(true)
  }

  const handleSwitchToLogin = () => {
    setSignupOpen(false)
    setLoginOpen(true)
  }

  return (
    <>
      <Card 
        className="cursor-pointer hover:border-[#00ff88]/50 transition-colors"
        onClick={handleCardClick}
      >
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`px-1 py-0.5 rounded-full text-xs font-semibold ${difficultyColors[difficulty]}`}
              >
                {difficulty}
              </span>
              {isAuthenticated && isEnrolled && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#02C177]/15 text-[#02C177] text-xs font-medium">
                  <BadgeCheck className="w-3 h-3" />
                  Enrolled
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[#ffb601]">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium text-white">{rating}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{description}</p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{lessons} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{displayStudents} students</span>
            </div>
          </div>

        </CardContent>

        <CardFooter className="flex justify-between items-center p-6 pt-0">
          <div className="text-sm flex items-center gap-1 text-gray-400">
            <User className="w-4 h-4" />
            <span>{instructor}</span> 
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              handleCardClick()
            }}
            className="bg-[#03202c] text-[#00eeb0] px-2 py-1 rounded-full text-sm"
          >
            {isAuthenticated
              ? isEnrolled
                ? "Continue Learning"
                : "Enroll Now"
              : "Sign in to enroll"}
          </Button>
        </CardFooter>
      </Card>

      <SignUpModal
        open={signupOpen}
        onOpenChange={setSignupOpen}
        onSwitchToLogin={handleSwitchToLogin}
      />
      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToSignup={handleSwitchToSignup}
      />
    </>
  )
}
