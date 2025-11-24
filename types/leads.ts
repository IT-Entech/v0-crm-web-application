export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: "New" | "Contacted" | "Qualified" | "Converted" | "Lost"
  source: string
  score: number
  estimatedValue?: number
  expectedCloseDate?: string
  assignedTo?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface LeadFormData {
  name: string
  email: string
  phone?: string
  company?: string
  status: "New" | "Contacted" | "Qualified" | "Converted" | "Lost"
  source: string
  score: number
  estimatedValue?: number
  expectedCloseDate?: string
  notes?: string
}
