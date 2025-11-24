const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://your-dotnet-api.com"

import { mockApi } from "./mock-api"

class ApiClient {
  private baseURL: string
  private useMockData: boolean

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.useMockData = !process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (this.useMockData) {
      return this.mockRequest<T>(endpoint, options)
    }

    const token = localStorage.getItem("auth_token")

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "An error occurred" }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  private async mockRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const method = options.method || "GET"
    const body = options.body ? JSON.parse(options.body as string) : undefined
    const token = localStorage.getItem("auth_token")

    try {
      // Auth endpoints
      if (endpoint === "/api/auth/login" && method === "POST") {
        return (await mockApi.login(body)) as T
      }
      if (endpoint === "/api/auth/me" && method === "GET") {
        return (await mockApi.getCurrentUser(token || "")) as T
      }

      // Contacts endpoints
      if (endpoint === "/api/contacts" && method === "GET") {
        return (await mockApi.getContacts()) as T
      }
      if (endpoint.startsWith("/api/contacts/") && method === "GET") {
        const id = endpoint.split("/")[3]
        return (await mockApi.getContact(id)) as T
      }
      if (endpoint === "/api/contacts" && method === "POST") {
        return (await mockApi.createContact(body)) as T
      }
      if (endpoint.startsWith("/api/contacts/") && (method === "PUT" || method === "PATCH")) {
        const id = endpoint.split("/")[3]
        return (await mockApi.updateContact(id, body)) as T
      }
      if (endpoint.startsWith("/api/contacts/") && method === "DELETE") {
        const id = endpoint.split("/")[3]
        await mockApi.deleteContact(id)
        return {} as T
      }

      // Leads endpoints
      if (endpoint === "/api/leads" && method === "GET") {
        return (await mockApi.getLeads()) as T
      }
      if (endpoint.startsWith("/api/leads/") && method === "GET") {
        const id = endpoint.split("/")[3]
        return (await mockApi.getLead(id)) as T
      }
      if (endpoint === "/api/leads" && method === "POST") {
        return (await mockApi.createLead(body)) as T
      }
      if (endpoint.startsWith("/api/leads/") && (method === "PUT" || method === "PATCH")) {
        const id = endpoint.split("/")[3]
        return (await mockApi.updateLead(id, body)) as T
      }
      if (endpoint.startsWith("/api/leads/") && method === "DELETE") {
        const id = endpoint.split("/")[3]
        await mockApi.deleteLead(id)
        return {} as T
      }

      // Opportunities endpoints
      if (endpoint === "/api/opportunities" && method === "GET") {
        return (await mockApi.getOpportunities()) as T
      }
      if (endpoint.startsWith("/api/opportunities/") && method === "GET") {
        const id = endpoint.split("/")[4]
        return (await mockApi.getOpportunity(id)) as T
      }
      if (endpoint === "/api/opportunities" && method === "POST") {
        return (await mockApi.createOpportunity(body)) as T
      }
      if (endpoint.startsWith("/api/opportunities/") && (method === "PUT" || method === "PATCH")) {
        const id = endpoint.split("/")[4]
        return (await mockApi.updateOpportunity(id, body)) as T
      }
      if (endpoint.startsWith("/api/opportunities/") && method === "DELETE") {
        const id = endpoint.split("/")[4]
        await mockApi.deleteOpportunity(id)
        return {} as T
      }

      // Tasks endpoints
      if (endpoint === "/api/tasks" && method === "GET") {
        return (await mockApi.getTasks()) as T
      }
      if (endpoint.startsWith("/api/tasks/") && method === "GET") {
        const id = endpoint.split("/")[3]
        return (await mockApi.getTask(id)) as T
      }
      if (endpoint === "/api/tasks" && method === "POST") {
        return (await mockApi.createTask(body)) as T
      }
      if (endpoint.startsWith("/api/tasks/") && (method === "PUT" || method === "PATCH")) {
        const id = endpoint.split("/")[3]
        return (await mockApi.updateTask(id, body)) as T
      }
      if (endpoint.startsWith("/api/tasks/") && method === "DELETE") {
        const id = endpoint.split("/")[3]
        await mockApi.deleteTask(id)
        return {} as T
      }

      // Dashboard endpoints
      if (endpoint === "/api/dashboard/stats" && method === "GET") {
        return (await mockApi.getDashboardStats()) as T
      }
      if (endpoint === "/api/dashboard/activities" && method === "GET") {
        return (await mockApi.getRecentActivities()) as T
      }
      if (endpoint === "/api/dashboard/sales-chart" && method === "GET") {
        return (await mockApi.getSalesChartData()) as T
      }
      if (endpoint === "/api/dashboard/leads-by-source" && method === "GET") {
        return (await mockApi.getLeadsBySourceData()) as T
      }

      throw new Error(`Mock endpoint not implemented: ${method} ${endpoint}`)
    } catch (error) {
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
