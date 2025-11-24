export interface Task {
  id: string
  title: string
  description?: string
  priority: "Low" | "Medium" | "High" | "Urgent"
  status: "Todo" | "In Progress" | "Completed" | "Cancelled"
  dueDate?: string
  assignedTo?: string
  relatedTo?: {
    type: "Contact" | "Lead" | "Opportunity"
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

export interface TaskFormData {
  title: string
  description?: string
  priority: "Low" | "Medium" | "High" | "Urgent"
  status: "Todo" | "In Progress" | "Completed" | "Cancelled"
  dueDate?: string
  relatedTo?: {
    type: "Contact" | "Lead" | "Opportunity"
    id: string
  }
}
