"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api/client"
import { Users, Target, TrendingUp, CheckSquare, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { LeadsBySourceChart } from "@/components/dashboard/leads-by-source-chart"
import { OpportunityPipeline } from "@/components/dashboard/opportunity-pipeline"

import type { DashboardStats, Activity } from "@/lib/mock-data/mock-database"
import type { Contact } from "@/types/contacts"
import type { Lead } from "@/types/leads"
import type { Opportunity } from "@/types/opportunities"
import type { Task } from "@/types/tasks"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [salesData, setSalesData] = useState<{ month: string; revenue: number }[]>([])
  const [leadsData, setLeadsData] = useState<{ source: string; count: number }[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [statsRes, activitiesRes, salesRes, leadsSourceRes, contactsRes, leadsRes, opportunitiesRes, tasksRes] =
        await Promise.all([
          apiClient.get<DashboardStats>("/api/dashboard/stats"),
          apiClient.get<Activity[]>("/api/dashboard/activities"),
          apiClient.get<{ month: string; revenue: number }[]>("/api/dashboard/sales-chart"),
          apiClient.get<{ source: string; count: number }[]>("/api/dashboard/leads-by-source"),
          apiClient.get<Contact[]>("/api/contacts"),
          apiClient.get<Lead[]>("/api/leads"),
          apiClient.get<Opportunity[]>("/api/opportunities"),
          apiClient.get<Task[]>("/api/tasks"),
        ])

      setStats(statsRes)
      setActivities(activitiesRes)
      setSalesData(salesRes)
      setLeadsData(leadsSourceRes)
      setContacts(contactsRes)
      setLeads(leadsRes)
      setOpportunities(opportunitiesRes)
      setTasks(tasksRes)
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

  const pipelineStages = [
    {
      stage: "Prospecting",
      count: opportunities.filter((o) => o.stage === "Prospecting").length,
      value: opportunities.filter((o) => o.stage === "Prospecting").reduce((sum, o) => sum + o.amount, 0),
    },
    {
      stage: "Qualification",
      count: opportunities.filter((o) => o.stage === "Qualification").length,
      value: opportunities.filter((o) => o.stage === "Qualification").reduce((sum, o) => sum + o.amount, 0),
    },
    {
      stage: "Proposal",
      count: opportunities.filter((o) => o.stage === "Proposal").length,
      value: opportunities.filter((o) => o.stage === "Proposal").reduce((sum, o) => sum + o.amount, 0),
    },
    {
      stage: "Negotiation",
      count: opportunities.filter((o) => o.stage === "Negotiation").length,
      value: opportunities.filter((o) => o.stage === "Negotiation").reduce((sum, o) => sum + o.amount, 0),
    },
  ]

  const activeOpportunities = opportunities.filter((o) => !["Closed Won", "Closed Lost"].includes(o.stage)).length
  const pendingTasks = tasks.filter((t) => t.status !== "Completed" && t.status !== "Cancelled").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your CRM.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${stats?.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="flex items-center text-green-500">
                <ArrowUpRight className="h-3 w-3" />
                {stats?.revenueChange}%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Opportunities</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activeOpportunities}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="flex items-center text-red-500">
                <ArrowDownRight className="h-3 w-3" />
                {stats?.opportunitiesChange}%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.conversionRate}%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="flex items-center text-green-500">
                <ArrowUpRight className="h-3 w-3" />
                {stats?.conversionChange}%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Deal Size</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${stats?.avgDealSize.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="flex items-center text-green-500">
                <ArrowUpRight className="h-3 w-3" />
                {stats?.dealSizeChange}%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{contacts.length}</div>
            <p className="text-xs text-muted-foreground">Active customer contacts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{leads.length}</div>
            <p className="text-xs text-muted-foreground">
              {leads.filter((l) => l.status === "Qualified").length} qualified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">All Opportunities</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{opportunities.length}</div>
            <p className="text-xs text-muted-foreground">{activeOpportunities} active in pipeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground">{tasks.length} total tasks</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="text-foreground">Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart data={salesData} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={activities} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Leads by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadsBySourceChart data={leadsData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Opportunity Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <OpportunityPipeline stages={pipelineStages} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
