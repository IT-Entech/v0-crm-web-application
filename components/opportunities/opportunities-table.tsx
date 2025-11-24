"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Calendar } from "lucide-react"
import type { Opportunity } from "@/types/opportunities"
import { useAuth } from "@/lib/auth/auth-provider"
import { format } from "date-fns"

interface OpportunitiesTableProps {
  opportunities: Opportunity[]
  isLoading: boolean
  onEdit: (opportunity: Opportunity) => void
  onDelete: (opportunityId: string) => void
}

const stageColors: Record<Opportunity["stage"], "default" | "secondary" | "outline" | "destructive"> = {
  Prospecting: "secondary",
  Qualification: "secondary",
  Proposal: "default",
  Negotiation: "default",
  "Closed Won": "default",
  "Closed Lost": "destructive",
}

export function OpportunitiesTable({ opportunities, isLoading, onEdit, onDelete }: OpportunitiesTableProps) {
  const { hasPermission } = useAuth()
  const [sortField, setSortField] = useState<keyof Opportunity>("expectedCloseDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: keyof Opportunity) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedOpportunities = [...opportunities].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (opportunities.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-border bg-card">
        <p className="text-lg font-medium text-foreground">No opportunities found</p>
        <p className="text-sm text-muted-foreground">Get started by creating your first opportunity</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer text-foreground" onClick={() => handleSort("name")}>
              Opportunity Name
            </TableHead>
            <TableHead className="text-foreground">Account</TableHead>
            <TableHead className="text-foreground">Stage</TableHead>
            <TableHead className="cursor-pointer text-foreground" onClick={() => handleSort("amount")}>
              Amount
            </TableHead>
            <TableHead className="cursor-pointer text-foreground" onClick={() => handleSort("probability")}>
              Probability
            </TableHead>
            <TableHead className="text-foreground">Weighted Value</TableHead>
            <TableHead className="cursor-pointer text-foreground" onClick={() => handleSort("expectedCloseDate")}>
              Close Date
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOpportunities.map((opportunity) => (
            <TableRow key={opportunity.id}>
              <TableCell>
                <p className="font-medium text-foreground">{opportunity.name}</p>
              </TableCell>
              <TableCell className="text-foreground">{opportunity.accountName}</TableCell>
              <TableCell>
                <Badge variant={stageColors[opportunity.stage]}>{opportunity.stage}</Badge>
              </TableCell>
              <TableCell className="font-medium text-foreground">${opportunity.amount.toLocaleString()}</TableCell>
              <TableCell className="text-foreground">{opportunity.probability}%</TableCell>
              <TableCell className="font-medium text-foreground">
                ${((opportunity.amount * opportunity.probability) / 100).toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  {format(new Date(opportunity.expectedCloseDate), "MMM dd, yyyy")}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {hasPermission("opportunities.update") && (
                      <DropdownMenuItem onClick={() => onEdit(opportunity)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {hasPermission("opportunities.delete") && (
                      <DropdownMenuItem onClick={() => onDelete(opportunity.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
