import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
}

export function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

interface DashboardStatsProps {
  stats: {
    totalContacts: number
    totalLeads: number
    totalOpportunities: number
    totalTasks: number
    revenue: number
    conversionRate: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{/* Stats cards would be rendered here */}</div>
}
