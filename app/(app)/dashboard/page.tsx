"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api/client"
import { Users, Target, TrendingUp, CheckSquare, DollarSign } from "lucide-react"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { LeadsBySourceChart } from "@/components/dashboard/leads-by-source-chart"
import { OpportunityPipeline } from "@/components/dashboard/opportunity-pipeline"

interface DashboardData {
  stats: {
    totalContacts: number
    totalLeads: number
    totalOpportunities: number
    totalTasks: number
    revenue: number
    conversionRate: number
  }
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>
  salesData: Array<{
    month: string
    revenue: number
    opportunities: number
  }>
  leadsBySource: Array<{
    source: string
    count: number
  }>
  pipelineStages: Array<{
    stage: string
    count: number
    value: number
  }>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const response = await apiClient.get<DashboardData>("/api/dashboard")
      setData(response)
    } catch (error) {
      console.error("[v0] Failed to load dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const stats = data?.stats || {
    totalContacts: 0,
    totalLeads: 0,
    totalOpportunities: 0,
    totalTasks: 0,
    revenue: 0,
    conversionRate: 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your CRM.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalContacts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active customer contacts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalLeads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Potential customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Opportunities</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalOpportunities.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active deals in pipeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalTasks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Tasks to complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Closed won deals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Lead to opportunity</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="text-foreground">Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart data={data?.salesData || []} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={data?.recentActivity || []} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Leads by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadsBySourceChart data={data?.leadsBySource || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Opportunity Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <OpportunityPipeline stages={data?.pipelineStages || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
