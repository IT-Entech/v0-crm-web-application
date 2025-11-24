"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LeadsTable } from "@/components/leads/leads-table"
import { LeadDialog } from "@/components/leads/lead-dialog"
import type { Lead } from "@/types/leads"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/lib/auth/auth-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const { hasPermission } = useAuth()

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    try {
      const response = await apiClient.get<Lead[]>("/api/leads")
      setLeads(response)
    } catch (error) {
      console.error("[v0] Failed to load leads:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateLead = () => {
    setSelectedLead(null)
    setIsDialogOpen(true)
  }

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead)
    setIsDialogOpen(true)
  }

  const handleDeleteLead = async (leadId: string) => {
    try {
      await apiClient.delete(`/api/leads/${leadId}`)
      setLeads(leads.filter((l) => l.id !== leadId))
    } catch (error) {
      console.error("[v0] Failed to delete lead:", error)
    }
  }

  const handleSaveLead = async (lead: Lead) => {
    if (selectedLead) {
      setLeads(leads.map((l) => (l.id === lead.id ? lead : l)))
    } else {
      setLeads([lead, ...leads])
    }
    setIsDialogOpen(false)
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && lead.status === activeTab
  })

  const leadCounts = {
    all: leads.length,
    New: leads.filter((l) => l.status === "New").length,
    Contacted: leads.filter((l) => l.status === "Contacted").length,
    Qualified: leads.filter((l) => l.status === "Qualified").length,
    Converted: leads.filter((l) => l.status === "Converted").length,
    Lost: leads.filter((l) => l.status === "Lost").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Leads</h1>
          <p className="text-muted-foreground">Track and manage your sales leads</p>
        </div>
        {hasPermission("leads.create") && (
          <Button onClick={handleCreateLead}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({leadCounts.all})</TabsTrigger>
          <TabsTrigger value="New">New ({leadCounts.New})</TabsTrigger>
          <TabsTrigger value="Contacted">Contacted ({leadCounts.Contacted})</TabsTrigger>
          <TabsTrigger value="Qualified">Qualified ({leadCounts.Qualified})</TabsTrigger>
          <TabsTrigger value="Converted">Converted ({leadCounts.Converted})</TabsTrigger>
          <TabsTrigger value="Lost">Lost ({leadCounts.Lost})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <LeadsTable leads={filteredLeads} isLoading={isLoading} onEdit={handleEditLead} onDelete={handleDeleteLead} />
        </TabsContent>
      </Tabs>

      <LeadDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} lead={selectedLead} onSave={handleSaveLead} />
    </div>
  )
}
