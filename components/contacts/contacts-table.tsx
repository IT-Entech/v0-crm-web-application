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
import { MoreHorizontal, Pencil, Trash2, Mail, Phone } from "lucide-react"
import type { Contact } from "@/types/contacts"
import { useAuth } from "@/lib/auth/auth-provider"
import { formatDistanceToNow } from "date-fns"

interface ContactsTableProps {
  contacts: Contact[]
  isLoading: boolean
  onEdit: (contact: Contact) => void
  onDelete: (contactId: string) => void
}

export function ContactsTable({ contacts, isLoading, onEdit, onDelete }: ContactsTableProps) {
  const { hasPermission } = useAuth()
  const [sortField, setSortField] = useState<keyof Contact>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (field: keyof Contact) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedContacts = [...contacts].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
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

  if (contacts.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-border bg-card">
        <p className="text-lg font-medium text-foreground">No contacts found</p>
        <p className="text-sm text-muted-foreground">Get started by creating your first contact</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer text-foreground" onClick={() => handleSort("firstName")}>
              Name
            </TableHead>
            <TableHead className="text-foreground">Contact Info</TableHead>
            <TableHead className="text-foreground">Company</TableHead>
            <TableHead className="text-foreground">Status</TableHead>
            <TableHead className="text-foreground">Tags</TableHead>
            <TableHead className="cursor-pointer text-foreground" onClick={() => handleSort("createdAt")}>
              Created
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                <div>
                  <p className="font-medium text-foreground">
                    {contact.firstName} {contact.lastName}
                  </p>
                  {contact.position && <p className="text-sm text-muted-foreground">{contact.position}</p>}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    {contact.email}
                  </div>
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-foreground">{contact.company || "-"}</TableCell>
              <TableCell>
                <Badge variant={contact.status === "Active" ? "default" : "secondary"}>{contact.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {contact.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {contact.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{contact.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true })}
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
                    {hasPermission("contacts.update") && (
                      <DropdownMenuItem onClick={() => onEdit(contact)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {hasPermission("contacts.delete") && (
                      <DropdownMenuItem onClick={() => onDelete(contact.id)} className="text-destructive">
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
