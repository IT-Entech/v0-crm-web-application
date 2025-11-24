"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import { apiClient } from "@/lib/api/client"
import { SalesReportChart } from "@/components/reports/sales-report-chart"
import { LeadsReportChart } from "@/components/reports/leads-report-chart"
import { ActivityReport } from "@/components/reports/activity-report"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ReportData {
  salesData: Array<{
    month: string
    revenue: number
    target: number
  }>
  leadsData: Array<{
    month: string
    new: number
    converted: number
    lost: number
  }>
  activityData: Array<{
    user: string
    contacts: number
    leads: number
    opportunities: number
    tasks: number
  }>
  summary: {
    totalRevenue: number
    totalLeads: number
    conversionRate: number
    averageDealSize: number
  }
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("monthly")

  useEffect(() => {
    loadReportData()
  }, [timeRange])

  const loadReportData = async () => {
    try {
      const response = await apiClient.get<ReportData>(`/api/reports?range=${timeRange}`)
      setReportData(response)
    } catch (error) {
      console.error("[v0] Failed to load report data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = (format: "pdf" | "csv") => {
    console.log(`[v0] Exporting report as ${format}`)
    // Implementation would call backend export endpoint
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports</h1>
          <p className="text-muted-foreground">Analyze your CRM performance and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExport("pdf")}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport("csv")}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {reportData && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  ${reportData.summary.totalRevenue.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{reportData.summary.totalLeads.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{reportData.summary.conversionRate}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Deal Size</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  ${reportData.summary.averageDealSize.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="sales" className="space-y-6">
            <TabsList>
              <TabsTrigger value="sales">Sales Performance</TabsTrigger>
              <TabsTrigger value="leads">Lead Funnel</TabsTrigger>
              <TabsTrigger value="activity">Team Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="sales">
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Sales Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <SalesReportChart data={reportData.salesData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leads">
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Lead Conversion Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <LeadsReportChart data={reportData.leadsData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Team Activity Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityReport data={reportData.activityData} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
