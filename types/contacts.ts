export interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  position?: string
  status: "Active" | "Inactive"
  source?: string
  tags: string[]
  notes?: string
  createdAt: string
  updatedAt: string
  assignedTo?: string
}

export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  position?: string
  status: "Active" | "Inactive"
  source?: string
  tags: string[]
  notes?: string
}
