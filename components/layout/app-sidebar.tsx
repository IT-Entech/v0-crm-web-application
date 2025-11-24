"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Target, TrendingUp, CheckSquare, BarChart3, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-provider"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard.view" },
  { name: "Contacts", href: "/contacts", icon: Users, permission: "contacts.view" },
  { name: "Leads", href: "/leads", icon: Target, permission: "leads.view" },
  { name: "Opportunities", href: "/opportunities", icon: TrendingUp, permission: "opportunities.view" },
  { name: "Tasks", href: "/tasks", icon: CheckSquare, permission: "tasks.view" },
  { name: "Reports", href: "/reports", icon: BarChart3, permission: "reports.view" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout, hasPermission } = useAuth()

  const filteredNavigation = navigation.filter((item) => !item.permission || hasPermission(item.permission))

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-xl font-semibold text-foreground">Enterprise CRM</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 px-3">
          <p className="text-sm font-medium text-foreground">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          <p className="mt-1 text-xs text-muted-foreground capitalize">{user?.role}</p>
        </div>
        <Button onClick={logout} variant="outline" className="w-full justify-start gap-3 bg-transparent" size="sm">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
