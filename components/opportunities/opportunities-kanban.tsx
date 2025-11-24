"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign, Pencil } from "lucide-react"
import type { Opportunity } from "@/types/opportunities"
import { format } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"

interface OpportunitiesKanbanProps {
  opportunities: Opportunity[]
  isLoading: boolean
  onEdit: (opportunity: Opportunity) => void
  onStageChange: (opportunityId: string, newStage: Opportunity["stage"]) => void
}

const stages: Opportunity["stage"][] = [
  "Prospecting",
  "Qualification",
  "Proposal",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
]

export function OpportunitiesKanban({ opportunities, isLoading, onEdit }: OpportunitiesKanbanProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-6 gap-4">
      {stages.map((stage) => {
        const stageOpportunities = opportunities.filter((opp) => opp.stage === stage)
        const stageValue = stageOpportunities.reduce((sum, opp) => sum + opp.amount, 0)

        return (
          <div key={stage} className="flex flex-col">
            <div className="mb-3 flex items-center justify-between rounded-lg border border-border bg-card p-3">
              <div>
                <h3 className="font-semibold text-foreground">{stage}</h3>
                <p className="text-xs text-muted-foreground">
                  ${stageValue.toLocaleString()} • {stageOpportunities.length} deals
                </p>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-3 pr-4">
                {stageOpportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="cursor-pointer hover:border-primary transition-colors">
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium text-foreground">{opportunity.name}</CardTitle>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(opportunity)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">{opportunity.accountName}</p>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <DollarSign className="h-3 w-3" />${opportunity.amount.toLocaleString()}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {opportunity.probability}% probability
                      </Badge>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(opportunity.expectedCloseDate), "MMM dd")}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )
      })}
    </div>
  )
}
