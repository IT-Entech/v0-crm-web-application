export interface Opportunity {
  id: string
  name: string
  accountName: string
  stage: "Prospecting" | "Qualification" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost"
  amount: number
  probability: number
  expectedCloseDate: string
  contactId?: string
  assignedTo?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OpportunityFormData {
  name: string
  accountName: string
  stage: "Prospecting" | "Qualification" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost"
  amount: number
  probability: number
  expectedCloseDate: string
  contactId?: string
  notes?: string
}
