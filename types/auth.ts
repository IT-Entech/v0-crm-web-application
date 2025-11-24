export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  permissions: string[]
  isActive: boolean
  createdAt: string
  lastLogin?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}
