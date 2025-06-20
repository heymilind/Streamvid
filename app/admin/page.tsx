"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem("adminAuth")
        if (authData) {
          const { isAuthenticated, loginTime } = JSON.parse(authData)
          const isExpired = Date.now() - loginTime > 24 * 60 * 60 * 1000

          if (isAuthenticated && !isExpired) {
            router.push("/admin/dashboard")
            return
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      }
    }

    checkAuth()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get current stored credentials or use defaults
    const storedCredentials = localStorage.getItem("adminCredentials")
    const currentCredentials = storedCredentials
      ? JSON.parse(storedCredentials)
      : { username: "admin", password: "flapadmin2025@06#" }

    if (username === currentCredentials.username && password === currentCredentials.password) {
      // Set authentication token in localStorage
      localStorage.setItem(
        "adminAuth",
        JSON.stringify({
          isAuthenticated: true,
          username: username,
          loginTime: Date.now(),
        }),
      )

      // Redirect to dashboard
      router.push("/admin/dashboard")
    } else {
      setError("Invalid username or password")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 bg-white flex items-center justify-center px-8 relative">
        {/* Back to Home Link */}
        <div className="absolute top-6 left-6">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>

        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm mb-2">Log in to</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">StreamHub</h1>

            {/* Admin Access Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              Admin Access
            </div>

            <p className="text-gray-400 text-sm mb-6">or</p>
          </div>

          {/* Login Form */}
          <div className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  disabled={isLoading}
                  className="pl-12 h-14 bg-blue-50 border-blue-100 focus:border-blue-300 focus:ring-blue-200 rounded-xl text-gray-700 placeholder-gray-400"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  disabled={isLoading}
                  className="pl-12 pr-12 h-14 bg-blue-50 border-blue-100 focus:border-blue-300 focus:ring-blue-200 rounded-xl text-gray-700"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl border-0 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin mr-2" />
                    Logging in...
                  </>
                ) : (
                  "Log in"
                )}
              </Button>
            </form>

            {/* Forgot Password Link */}
            <div className="text-center mt-6">
              <button className="text-gray-500 hover:text-gray-700 text-sm transition-colors">Forgot password?</button>
            </div>

            {/* Demo Credentials */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-500">Demo credentials: admin / streamhub2024</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>StreamHub by Admin Team</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="flex-1 bg-gradient-to-br from-rose-200 to-rose-300 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 right-1/4 w-32 h-32 border border-white/20 rounded-lg transform rotate-12"></div>
          <div className="absolute bottom-1/3 left-1/4 w-24 h-24 border border-white/20 rounded-lg transform -rotate-12"></div>
          <div className="absolute top-1/2 right-1/2 w-16 h-16 border border-white/20 rounded-lg transform rotate-45"></div>
        </div>

        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-rose-300/20 to-transparent"></div>
      </div>
    </div>
  )
}
