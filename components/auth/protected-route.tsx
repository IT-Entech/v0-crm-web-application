"use client"

import type React from "react"

import { useAuth } from "@/lib/auth/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { user, isLoading, hasPermission } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }

    if (!isLoading && user && requiredPermission && !hasPermission(requiredPermission)) {
      router.push("/unauthorized")
    }
  }, [user, isLoading, requiredPermission, router, hasPermission])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null
  }

  return <>{children}</>
}
