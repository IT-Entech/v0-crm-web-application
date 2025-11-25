import type { User, LoginRequest, AuthResponse } from "@/types/auth"
import type { Contact, ContactFormData } from "@/types/contacts"
import type { Lead, LeadFormData } from "@/types/leads"
import type { Opportunity, OpportunityFormData } from "@/types/opportunities"
import type { Task, TaskFormData } from "@/types/tasks"
import {
  mockUsers,
  mockContacts,
  mockLeads,
  mockOpportunities,
  mockTasks,
  mockActivities,
  mockDashboardStats,
  MOCK_CREDENTIALS,
  delay,
  type Activity,
  type DashboardStats,
} from "../mock-data/mock-database"

// In-memory storage (simulates database)
const users = [...mockUsers]
const contacts = [...mockContacts]
const leads = [...mockLeads]
const opportunities = [...mockOpportunities]
const tasks = [...mockTasks]
const activities = [...mockActivities]

// Mock API Handler
export class MockApi {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    await delay(800) // Simulate network delay

    // Check credentials
    const isValidCredentials = Object.values(MOCK_CREDENTIALS).some(
      (cred) => cred.username === credentials.username && cred.password === credentials.password,
    )

    if (!isValidCredentials) {
      throw new Error("Invalid username or password")
    }

    const user = users.find((u) => u.username === credentials.username)
    if (!user) {
      throw new Error("User not found")
    }

    // Generate mock JWT token
    const accessToken = `mock-jwt-token-${user.id}-${Date.now()}`
    const refreshToken = `mock-refresh-token-${user.id}-${Date.now()}`

    return {
      accessToken,
      refreshToken,
      user: {
        ...user,
        lastLogin: new Date().toISOString(),
      },
    }
  }

  async getCurrentUser(token: string): Promise<User> {
    await delay(300)

    // Extract user ID from mock token
    const userId = token.split("-")[3]
    const user = users.find((u) => u.id === userId)

    if (!user) {
      throw new Error("Invalid token")
    }

    return user
  }

  async getContacts(): Promise<Contact[]> {
    await delay(500)
    return contacts
  }

  async getContact(id: string): Promise<Contact> {
    await delay(300)
    const contact = contacts.find((c) => c.id === id)
    if (!contact) {
      throw new Error("Contact not found")
    }
    return contact
  }

  async createContact(data: ContactFormData): Promise<Contact> {
    await delay(600)
    const newContact: Contact = {
      id: `c${contacts.length + 1}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    contacts.push(newContact)
    return newContact
  }

  async updateContact(id: string, data: Partial<ContactFormData>): Promise<Contact> {
    await delay(600)
    const index = contacts.findIndex((c) => c.id === id)
    if (index === -1) {
      throw new Error("Contact not found")
    }
    contacts[index] = {
      ...contacts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return contacts[index]
  }

  async deleteContact(id: string): Promise<void> {
    await delay(400)
    const index = contacts.findIndex((c) => c.id === id)
    if (index === -1) {
      throw new Error("Contact not found")
    }
    contacts.splice(index, 1)
  }

  async getLeads(): Promise<Lead[]> {
    await delay(500)
    return leads
  }

  async getLead(id: string): Promise<Lead> {
    await delay(300)
    const lead = leads.find((l) => l.id === id)
    if (!lead) {
      throw new Error("Lead not found")
    }
    return lead
  }

  async createLead(data: LeadFormData): Promise<Lead> {
    await delay(600)
    const newLead: Lead = {
      id: `l${leads.length + 1}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    leads.push(newLead)
    return newLead
  }

  async updateLead(id: string, data: Partial<LeadFormData>): Promise<Lead> {
    await delay(600)
    const index = leads.findIndex((l) => l.id === id)
    if (index === -1) {
      throw new Error("Lead not found")
    }
    leads[index] = {
      ...leads[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return leads[index]
  }

  async deleteLead(id: string): Promise<void> {
    await delay(400)
    const index = leads.findIndex((l) => l.id === id)
    if (index === -1) {
      throw new Error("Lead not found")
    }
    leads.splice(index, 1)
  }

  async getOpportunities(): Promise<Opportunity[]> {
    await delay(500)
    return opportunities
  }

  async getOpportunity(id: string): Promise<Opportunity> {
    await delay(300)
    const opportunity = opportunities.find((o) => o.id === id)
    if (!opportunity) {
      throw new Error("Opportunity not found")
    }
    return opportunity
  }

  async createOpportunity(data: OpportunityFormData): Promise<Opportunity> {
    await delay(600)
    const newOpportunity: Opportunity = {
      id: `o${opportunities.length + 1}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    opportunities.push(newOpportunity)
    return newOpportunity
  }

  async updateOpportunity(id: string, data: Partial<OpportunityFormData>): Promise<Opportunity> {
    await delay(600)
    const index = opportunities.findIndex((o) => o.id === id)
    if (index === -1) {
      throw new Error("Opportunity not found")
    }
    opportunities[index] = {
      ...opportunities[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return opportunities[index]
  }

  async deleteOpportunity(id: string): Promise<void> {
    await delay(400)
    const index = opportunities.findIndex((o) => o.id === id)
    if (index === -1) {
      throw new Error("Opportunity not found")
    }
    opportunities.splice(index, 1)
  }

  async getTasks(): Promise<Task[]> {
    await delay(500)
    return tasks
  }

  async getTask(id: string): Promise<Task> {
    await delay(300)
    const task = tasks.find((t) => t.id === id)
    if (!task) {
      throw new Error("Task not found")
    }
    return task
  }

  async createTask(data: TaskFormData): Promise<Task> {
    await delay(600)

    let relatedTo = undefined
    if (data.relatedTo) {
      // Get name from the related entity
      let name = ""
      if (data.relatedTo.type === "Contact") {
        const contact = contacts.find((c) => c.id === data.relatedTo?.id)
        name = contact ? `${contact.firstName} ${contact.lastName}` : ""
      } else if (data.relatedTo.type === "Lead") {
        const lead = leads.find((l) => l.id === data.relatedTo?.id)
        name = lead?.name || ""
      } else if (data.relatedTo.type === "Opportunity") {
        const opportunity = opportunities.find((o) => o.id === data.relatedTo?.id)
        name = opportunity?.name || ""
      }

      relatedTo = {
        ...data.relatedTo,
        name,
      }
    }

    const newTask: Task = {
      id: `t${tasks.length + 1}`,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      dueDate: data.dueDate,
      relatedTo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    tasks.push(newTask)
    return newTask
  }

  async updateTask(id: string, data: Partial<TaskFormData>): Promise<Task> {
    await delay(600)
    const index = tasks.findIndex((t) => t.id === id)
    if (index === -1) {
      throw new Error("Task not found")
    }

    const updateData: Partial<Task> = {
      ...data,
      updatedAt: new Date().toISOString(),
    }

    if (data.relatedTo) {
      let name = ""
      if (data.relatedTo.type === "Contact") {
        const contact = contacts.find((c) => c.id === data.relatedTo?.id)
        name = contact ? `${contact.firstName} ${contact.lastName}` : ""
      } else if (data.relatedTo.type === "Lead") {
        const lead = leads.find((l) => l.id === data.relatedTo?.id)
        name = lead?.name || ""
      } else if (data.relatedTo.type === "Opportunity") {
        const opportunity = opportunities.find((o) => o.id === data.relatedTo?.id)
        name = opportunity?.name || ""
      }

      updateData.relatedTo = {
        ...data.relatedTo,
        name,
      }
    }

    tasks[index] = {
      ...tasks[index],
      ...updateData,
    }
    return tasks[index]
  }

  async deleteTask(id: string): Promise<void> {
    await delay(400)
    const index = tasks.findIndex((t) => t.id === id)
    if (index === -1) {
      throw new Error("Task not found")
    }
    tasks.splice(index, 1)
  }

  async getDashboardStats(): Promise<DashboardStats> {
    await delay(400)
    return mockDashboardStats
  }

  async getRecentActivities(): Promise<Activity[]> {
    await delay(400)
    return activities
  }

  async getSalesChartData(): Promise<{ month: string; revenue: number }[]> {
    await delay(400)
    return [
      { month: "Jun", revenue: 124000 },
      { month: "Jul", revenue: 138000 },
      { month: "Aug", revenue: 145000 },
      { month: "Sep", revenue: 132000 },
      { month: "Oct", revenue: 156000 },
      { month: "Nov", revenue: 178000 },
    ]
  }

  async getLeadsBySourceData(): Promise<{ source: string; count: number }[]> {
    await delay(400)
    return [
      { source: "Website", count: 45 },
      { source: "Referral", count: 32 },
      { source: "LinkedIn", count: 28 },
      { source: "Google Ads", count: 24 },
      { source: "Conference", count: 18 },
      { source: "Cold Call", count: 12 },
    ]
  }
}

export const mockApi = new MockApi()
