"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User, LoginRequest, AuthResponse } from "@/types/auth"
import { apiClient } from "@/lib/api/client"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      try {
        const response = await apiClient.get<User>("/api/auth/me")
        setUser(response)
      } catch (error) {
        localStorage.removeItem("auth_token")
      }
    }
    setIsLoading(false)
  }

  const login = async (credentials: LoginRequest) => {
    const response = await apiClient.post<AuthResponse>("/api/auth/login", credentials)
    localStorage.setItem("auth_token", response.accessToken)
    setUser(response.user)
    router.push("/dashboard")
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setUser(null)
    router.push("/login")
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return user.permissions?.includes(permission) || false
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasPermission }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
