"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Filter, LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OpportunitiesTable } from "@/components/opportunities/opportunities-table"
import { OpportunitiesKanban } from "@/components/opportunities/opportunities-kanban"
import { OpportunityDialog } from "@/components/opportunities/opportunity-dialog"
import type { Opportunity } from "@/types/opportunities"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/lib/auth/auth-provider"

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null)
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table")
  const { hasPermission } = useAuth()

  useEffect(() => {
    loadOpportunities()
  }, [])

  const loadOpportunities = async () => {
    try {
      const response = await apiClient.get<Opportunity[]>("/api/opportunities")
      setOpportunities(response)
    } catch (error) {
      console.error("[v0] Failed to load opportunities:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateOpportunity = () => {
    setSelectedOpportunity(null)
    setIsDialogOpen(true)
  }

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity)
    setIsDialogOpen(true)
  }

  const handleDeleteOpportunity = async (opportunityId: string) => {
    try {
      await apiClient.delete(`/api/opportunities/${opportunityId}`)
      setOpportunities(opportunities.filter((o) => o.id !== opportunityId))
    } catch (error) {
      console.error("[v0] Failed to delete opportunity:", error)
    }
  }

  const handleSaveOpportunity = async (opportunity: Opportunity) => {
    if (selectedOpportunity) {
      setOpportunities(opportunities.map((o) => (o.id === opportunity.id ? opportunity : o)))
    } else {
      setOpportunities([opportunity, ...opportunities])
    }
    setIsDialogOpen(false)
  }

  const handleStageChange = async (opportunityId: string, newStage: Opportunity["stage"]) => {
    try {
      const updated = await apiClient.patch<Opportunity>(`/api/opportunities/${opportunityId}`, { stage: newStage })
      setOpportunities(opportunities.map((o) => (o.id === opportunityId ? updated : o)))
    } catch (error) {
      console.error("[v0] Failed to update opportunity stage:", error)
    }
  }

  const filteredOpportunities = opportunities.filter(
    (opp) =>
      opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.accountName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalValue = filteredOpportunities.reduce((sum, opp) => sum + opp.amount, 0)
  const weightedValue = filteredOpportunities.reduce((sum, opp) => sum + (opp.amount * opp.probability) / 100, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Opportunities</h1>
          <p className="text-muted-foreground">Track deals through your sales pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "kanban" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          {hasPermission("opportunities.create") && (
            <Button onClick={handleCreateOpportunity}>
              <Plus className="mr-2 h-4 w-4" />
              Add Opportunity
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Pipeline Value</p>
          <p className="text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Weighted Pipeline Value</p>
          <p className="text-2xl font-bold text-foreground">${weightedValue.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Opportunities</p>
          <p className="text-2xl font-bold text-foreground">{filteredOpportunities.length}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {viewMode === "table" ? (
        <OpportunitiesTable
          opportunities={filteredOpportunities}
          isLoading={isLoading}
          onEdit={handleEditOpportunity}
          onDelete={handleDeleteOpportunity}
        />
      ) : (
        <OpportunitiesKanban
          opportunities={filteredOpportunities}
          isLoading={isLoading}
          onEdit={handleEditOpportunity}
          onStageChange={handleStageChange}
        />
      )}

      <OpportunityDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        opportunity={selectedOpportunity}
        onSave={handleSaveOpportunity}
      />
    </div>
  )
}
