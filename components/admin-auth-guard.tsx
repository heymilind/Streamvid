"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"

interface AdminAuthGuardProps {
  children: React.ReactNode
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem("adminAuth")
        if (authData) {
          const { isAuthenticated, loginTime } = JSON.parse(authData)

          // Check if login is still valid (24 hours)
          const isExpired = Date.now() - loginTime > 24 * 60 * 60 * 1000

          if (isAuthenticated && !isExpired) {
            setIsAuthenticated(true)
            return
          }
        }

        // Not authenticated or expired
        localStorage.removeItem("adminAuth")
        setIsAuthenticated(false)
        router.push("/admin/login")
      } catch (error) {
        console.error("Auth check failed:", error)
        setIsAuthenticated(false)
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [router])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Access</h2>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return <>{children}</>
}
