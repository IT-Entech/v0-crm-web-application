"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Target,
  TrendingUp,
  CheckSquare,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

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
  const [collapsed, setCollapsed] = useState(false)

  const filteredNavigation = navigation.filter((item) => !item.permission || hasPermission(item.permission))

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-56",
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-3">
        {!collapsed && <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">CRM</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent", collapsed && "mx-auto")}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {filteredNavigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      <div className="p-3">
        {!collapsed ? (
          <div className="space-y-3">
            <div className="space-y-0.5 px-2">
              <p className="truncate text-xs font-medium text-sidebar-foreground">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/60">{user?.email}</p>
              <p className="mt-0.5 text-xs capitalize text-sidebar-foreground/50">{user?.role}</p>
            </div>
            <Button
              onClick={logout}
              variant="ghost"
              className="w-full justify-start gap-2 bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              size="sm"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-xs">Logout</span>
            </Button>
          </div>
        ) : (
          <Button
            onClick={logout}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
