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
import { MoreHorizontal, Pencil, Trash2, Mail, Phone, TrendingUp } from "lucide-react"
import type { Lead } from "@/types/leads"
import { useAuth } from "@/lib/auth/auth-provider"
import { formatDistanceToNow } from "date-fns"

interface LeadsTableProps {
  leads: Lead[]
  isLoading: boolean
  onEdit: (lead: Lead) => void
  onDelete: (leadId: string) => void
}

const statusColors: Record<Lead["status"], "default" | "secondary" | "outline" | "destructive"> = {
  New: "default",
  Contacted: "secondary",
  Qualified: "default",
  Converted: "default",
  Lost: "destructive",
}

export function LeadsTable({ leads, isLoading, onEdit, onDelete }: LeadsTableProps) {
  const { hasPermission } = useAuth()
  const [sortField, setSortField] = useState<keyof Lead>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedLeads = [...leads].sort((a, b) => {
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

  if (leads.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-border bg-card">
        <p className="text-lg font-medium text-foreground">No leads found</p>
        <p className="text-sm text-muted-foreground">Get started by creating your first lead</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer text-foreground" onClick={() => handleSort("name")}>
              Name
            </TableHead>
            <TableHead className="text-foreground">Contact Info</TableHead>
            <TableHead className="text-foreground">Company</TableHead>
            <TableHead className="text-foreground">Status</TableHead>
            <TableHead className="cursor-pointer text-foreground" onClick={() => handleSort("score")}>
              Score
            </TableHead>
            <TableHead className="text-foreground">Value</TableHead>
            <TableHead className="text-foreground">Source</TableHead>
            <TableHead className="cursor-pointer text-foreground" onClick={() => handleSort("createdAt")}>
              Created
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLeads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                <p className="font-medium text-foreground">{lead.name}</p>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    {lead.email}
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {lead.phone}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-foreground">{lead.company || "-"}</TableCell>
              <TableCell>
                <Badge variant={statusColors[lead.status]}>{lead.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">{lead.score}</span>
                </div>
              </TableCell>
              <TableCell className="text-foreground">
                {lead.estimatedValue ? `$${lead.estimatedValue.toLocaleString()}` : "-"}
              </TableCell>
              <TableCell className="text-foreground">{lead.source}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
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
                    {hasPermission("leads.update") && (
                      <DropdownMenuItem onClick={() => onEdit(lead)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {hasPermission("leads.delete") && (
                      <DropdownMenuItem onClick={() => onDelete(lead.id)} className="text-destructive">
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
