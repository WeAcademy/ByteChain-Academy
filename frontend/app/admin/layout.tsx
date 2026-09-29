"use client"

import { useEffect } from "react"
import { Header } from "@/components/header"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ArrowLeft, LayoutDashboard, BookOpen, Users, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && user && user.role !== "admin") {
      toast({
        title: "Access denied",
        description: "You do not have permission to access the admin area.",
        variant: "destructive",
      })
      router.replace("/dashboard")
    }
  }, [isLoading, user, router, toast])

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <p className="text-sm text-muted-foreground">Loading admin area…</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Link href={pathname?.includes("/courses/") ? "/admin" : "/dashboard"}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-56 shrink-0">
            <nav className="flex flex-row gap-2 overflow-x-auto lg:flex-col">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname?.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-[#22c55e]/10 text-[#22c55e]"
                        : "text-muted-foreground hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </aside>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  )
}
