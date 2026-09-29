"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorCard } from "@/components/ui/error-card"

interface Course {
  id: string
  title: string
  description: string
  published: boolean
}

interface AnalyticsOverview {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  certificatesIssued: number
}

interface LearnerActivityPoint {
  date: string
  activeUsers: number
}

interface CoursePerformance {
  id: string
  title: string
  enrollments: number
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="border-white/10">
      <CardContent className="p-4">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold mt-1">{value.toLocaleString()}</p>
      </CardContent>
    </Card>
  )
}

function ActivityChart({ data }: { data: LearnerActivityPoint[] }) {
  const max = Math.max(1, ...data.map((d) => d.activeUsers))
  const points = data
    .map((d, i) => {
      const x = data.length > 1 ? (i / (data.length - 1)) * 100 : 0
      const y = 100 - (d.activeUsers / max) * 100
      return `${x},${y}`
    })
    .join(" ")

  return (
    <Card className="border-white/10">
      <CardContent className="p-4">
        <p className="text-sm text-gray-400 mb-3">Daily Active Learners (last 30 days)</p>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-40">
          <polyline
            points={points}
            fill="none"
            stroke="#00ff88"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </CardContent>
    </Card>
  )
}

export default function AdminPage() {
  const { data, isLoading, isError, refetch } = useQuery<Course[]>({
    queryKey: ["admin-courses-list"],
    queryFn: async () => {
      const res = await api.get<{ data?: Course[] } | Course[]>("/courses?limit=100")
      return Array.isArray(res) ? res : (res?.data ?? [])
    },
  })

  const { data: overview } = useQuery<AnalyticsOverview>({
    queryKey: ["admin-analytics-overview"],
    queryFn: () => api.get<AnalyticsOverview>("/admin/analytics/overview"),
  })

  const { data: activity } = useQuery<LearnerActivityPoint[]>({
    queryKey: ["admin-analytics-learner-activity"],
    queryFn: async () => {
      const res = await api.get<{ data?: LearnerActivityPoint[] } | LearnerActivityPoint[]>(
        "/admin/analytics/learner-activity"
      )
      return Array.isArray(res) ? res : (res?.data ?? [])
    },
  })

  const { data: performance } = useQuery<CoursePerformance[]>({
    queryKey: ["admin-analytics-course-performance"],
    queryFn: async () => {
      const res = await api.get<{ data?: CoursePerformance[] } | CoursePerformance[]>(
        "/admin/analytics/course-performance"
      )
      return Array.isArray(res) ? res : (res?.data ?? [])
    },
  })

  const courses = data ?? []
  const topCourses = [...(performance ?? [])]
    .sort((a, b) => b.enrollments - a.enrollments)
    .slice(0, 5)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={overview?.totalUsers ?? 0} />
        <StatCard label="Total Courses" value={overview?.totalCourses ?? 0} />
        <StatCard label="Total Enrollments" value={overview?.totalEnrollments ?? 0} />
        <StatCard label="Certificates Issued" value={overview?.certificatesIssued ?? 0} />
      </div>

      <div className="mb-8">
        <ActivityChart data={activity ?? []} />
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Top Courses by Enrollment</h2>
        {topCourses.length === 0 ? (
          <p className="text-gray-400">No course performance data.</p>
        ) : (
          <div className="space-y-3">
            {topCourses.map((c) => (
              <Card key={c.id} className="border-white/10">
                <CardContent className="p-4 flex justify-between items-center">
                  <span className="font-medium">{c.title}</span>
                  <span className="text-sm text-gray-400">{c.enrollments} enrollments</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-3">Courses</h2>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border-white/10">
              <CardContent className="p-4 flex justify-between items-center">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <ErrorCard message="Failed to load courses. Please try again." onRetry={refetch} />
      ) : courses.length === 0 ? (
        <p className="text-gray-400">No courses found.</p>
      ) : (
        <div className="space-y-3">
          {courses.map((c) => (
            <Link key={c.id} href={`/admin/courses/${c.id}/lessons`}>
              <Card className="border-white/10 hover:border-[#00ff88]/30 transition-colors cursor-pointer">
                <CardContent className="p-4 flex justify-between items-center">
                  <span className="font-medium">{c.title}</span>
                  <span className="text-sm text-gray-400">Manage lessons →</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
