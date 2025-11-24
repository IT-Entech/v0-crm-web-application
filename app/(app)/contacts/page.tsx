"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ContactsTable } from "@/components/contacts/contacts-table"
import { ContactDialog } from "@/components/contacts/contact-dialog"
import type { Contact } from "@/types/contacts"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/lib/auth/auth-provider"

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const { hasPermission } = useAuth()

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      const response = await apiClient.get<Contact[]>("/api/contacts")
      setContacts(response)
    } catch (error) {
      console.error("[v0] Failed to load contacts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateContact = () => {
    setSelectedContact(null)
    setIsDialogOpen(true)
  }

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact)
    setIsDialogOpen(true)
  }

  const handleDeleteContact = async (contactId: string) => {
    try {
      await apiClient.delete(`/api/contacts/${contactId}`)
      setContacts(contacts.filter((c) => c.id !== contactId))
    } catch (error) {
      console.error("[v0] Failed to delete contact:", error)
    }
  }

  const handleSaveContact = async (contact: Contact) => {
    if (selectedContact) {
      setContacts(contacts.map((c) => (c.id === contact.id ? contact : c)))
    } else {
      setContacts([contact, ...contacts])
    }
    setIsDialogOpen(false)
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Contacts</h1>
          <p className="text-muted-foreground">Manage your customer contacts and relationships</p>
        </div>
        {hasPermission("contacts.create") && (
          <Button onClick={handleCreateContact}>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
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

      <ContactsTable
        contacts={filteredContacts}
        isLoading={isLoading}
        onEdit={handleEditContact}
        onDelete={handleDeleteContact}
      />

      <ContactDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        contact={selectedContact}
        onSave={handleSaveContact}
      />
    </div>
  )
}
