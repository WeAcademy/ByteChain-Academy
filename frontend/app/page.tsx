"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { CourseCard } from "@/components/course-card"
import { CourseCardSkeleton } from "@/components/courses/course-card-skeleton"
import { SignUpModal } from "@/components/auth/signup-modal"
import { LoginModal } from "@/components/auth/login-modal"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import {
  ArrowRight,
  Award,
  BookOpen,
  Coins,
  Github,
  Play,
  Send,
  Sparkles,
  Vote,
  Zap,
} from "lucide-react"
import Link from "next/link"

interface LandingCourse {
  id: string
  title: string
  description: string
  difficulty?: "Beginner" | "Intermediate" | "Advanced"
  rating?: number
  duration?: number
  lessons?: number
  students?: number
  enrollmentCount?: number
  instructor?: string
}

const features = [
  {
    icon: BookOpen,
    title: "Bite-sized Lessons",
    description:
      "Short, focused lessons that fit into a coffee break. Learn one concept at a time and keep the momentum going.",
  },
  {
    icon: Vote,
    title: "DAO Governance",
    description:
      "Propose and vote on course changes, treasury spend and platform direction. Learners help steer the academy.",
  },
  {
    icon: Coins,
    title: "Currency Hub",
    description:
      "Track supported Stellar assets and their live rates, then practise with realistic on-chain examples.",
  },
  {
    icon: Award,
    title: "Stellar Certificates",
    description:
      "Finish a course and claim a verifiable certificate anchored on Stellar that anyone can check.",
  },
]

const steps = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Sign up with your email, connect a Stellar wallet and set your learning goals in under a minute.",
  },
  {
    number: "02",
    title: "Learn in five-minute bites",
    description:
      "Work through lessons and quizzes at your own pace. Your progress is saved automatically.",
  },
  {
    number: "03",
    title: "Earn on-chain proof",
    description:
      "Complete the final quiz, claim your certificate and share a public verification link with employers.",
  },
]

export default function Home() {
  const [signupOpen, setSignupOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const { data: courses, isLoading: coursesLoading } = useQuery<LandingCourse[]>({
    queryKey: ["courses", "landing"],
    queryFn: async () => {
      const res = await api.get<{ data?: LandingCourse[] } | LandingCourse[]>("/courses")
      const r = res as { data?: LandingCourse[] } | LandingCourse[]
      return Array.isArray(r) ? r : (r?.data ?? [])
    },
  })

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleSwitchToSignup = () => {
    setLoginOpen(false)
    setSignupOpen(true)
  }

  const handleSwitchToLogin = () => {
    setSignupOpen(false)
    setLoginOpen(true)
  }

  const featuredCourses = (courses ?? []).slice(0, 3)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,136,0.14),transparent_60%)]"
          />
          <div className="container relative mx-auto px-6 pt-20 pb-24 text-center">
            <div className="mb-6 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/10 px-4 py-1.5 text-sm text-[#00ff88]">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Built on Stellar
              </span>
            </div>

            <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Learn Web3 in{" "}
              <span className="text-[#00ff88]">5-minute bites</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 md:text-xl">
              ByteChain Academy turns blockchain fundamentals into short, practical
              lessons. Learn Stellar, earn verifiable certificates and help govern
              the academy through its DAO.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-[#00ff88] text-black hover:bg-[#00cc6a]"
                onClick={() => setSignupOpen(true)}
              >
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-white/20">
                  <Play className="mr-2 h-5 w-5" aria-hidden="true" />
                  Explore Courses
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              No credit card. No prior blockchain experience required.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-white/10 bg-[#0b0b0b] py-20">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                Everything you need to go from curious to certified
              </h2>
              <p className="mt-4 text-gray-400">
                A complete learning loop: understand the concept, practise it and
                prove what you know.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-[#101010] p-6 transition-colors hover:border-[#00ff88]/40"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#00ff88]/10">
                    <Icon className="h-5 w-5 text-[#00ff88]" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold md:text-4xl">How it works</h2>
              <p className="mt-4 text-gray-400">
                Three steps from your first lesson to a certificate you can share.
              </p>
            </div>

            <ol className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <li
                  key={step.number}
                  className="relative rounded-2xl border border-white/10 bg-[#0b0b0b] p-6"
                >
                  <span className="text-sm font-semibold text-[#00ff88]">
                    {step.number}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Featured courses */}
        <section className="border-t border-white/10 bg-[#0b0b0b] py-20">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-3xl font-bold md:text-4xl">Start with a course</h2>
                <p className="mt-3 text-gray-400">
                  Pick a track and finish your first certificate this week.
                </p>
              </div>
              <Link href="/courses">
                <Button variant="ghost" className="text-[#00ff88]">
                  View all courses
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {coursesLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <CourseCardSkeleton key={i} />
                ))}

              {!coursesLoading &&
                featuredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    difficulty={course.difficulty ?? "Beginner"}
                    rating={course.rating ?? 0}
                    duration={course.duration ?? 0}
                    lessons={course.lessons ?? 0}
                    students={course.students ?? course.enrollmentCount ?? 0}
                    instructor={course.instructor ?? "ByteChain Academy"}
                  />
                ))}

              {!coursesLoading && featuredCourses.length === 0 && (
                <div className="col-span-full rounded-2xl border border-dashed border-white/15 p-10 text-center text-gray-400">
                  New courses are on the way. Create an account and we will let you
                  know as soon as they publish.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="rounded-3xl border border-[#00ff88]/20 bg-[#03170f] p-10 text-center md:p-14">
              <Zap className="mx-auto h-8 w-8 text-[#00ff88]" aria-hidden="true" />
              <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                Your first certificate is five minutes away
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-gray-400">
                Join learners building real Stellar skills, one short lesson at a time.
              </p>
              <Button
                size="lg"
                className="mt-8 bg-[#00ff88] text-black hover:bg-[#00cc6a]"
                onClick={() => setSignupOpen(true)}
              >
                Create a free account
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#080808]">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm text-gray-500">
              {new Date().getFullYear()} ByteChain Academy. Built on Stellar.
            </p>
            <nav aria-label="Footer" className="flex flex-wrap items-center gap-5 text-sm">
              <Link href="/about" className="text-gray-400 transition-colors hover:text-white">
                About
              </Link>
              <Link href="/faq" className="text-gray-400 transition-colors hover:text-white">
                FAQ
              </Link>
              <a
                href="https://github.com/WeAcademy/ByteChain-Academy"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                GitHub
              </a>
              <a
                href="https://t.me/bytechainacademy"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Telegram
              </a>
            </nav>
          </div>
        </div>
      </footer>

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
    </div>
  )
}
