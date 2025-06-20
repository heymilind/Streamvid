"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Admin credentials (in production, this would be handled by a secure backend)
  const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "flapadmin2025@06#",
  }

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

      router.push("/admin/dashboard")
    } else {
      setError("Invalid username or password")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 bg-white flex flex-col justify-center px-12 py-8">
        <div className="max-w-sm mx-auto w-full">
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm mb-2">Log in to</p>
            <h1 className="text-2xl font-bold text-gray-900">StreamHub</h1>
          </div>

          {/* Admin Badge */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gray-900 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4" />
              Admin Access
            </div>
          </div>

          <div className="text-center mb-6">
            <span className="text-gray-400 text-sm">or</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50 rounded-lg mb-4">
                <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your Username"
                required
                disabled={isLoading}
                className="pl-12 h-14 bg-gray-50 border-0 rounded-xl text-base placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your Password"
                required
                disabled={isLoading}
                className="pl-12 pr-12 h-14 bg-gray-50 border-0 rounded-xl text-base placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-gray-200"
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
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-base font-medium border-0 shadow-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Log in"
              )}
            </Button>
          </form>

          <div className="text-center mt-6 space-y-2">
            <button className="text-gray-500 text-sm hover:text-gray-700">Forgot password?</button>
          </div>
        </div>
      </div>

      {/* Right Side - Placeholder Background */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/placeholder.svg?height=800&width=800')`,
          }}
        >
          {/* Overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-red-500/30 to-blue-600/20"></div>

          {/* Bottom attribution */}
          <div className="absolute bottom-6 left-6 flex items-center gap-2 z-10">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-white text-sm drop-shadow-lg">
              StreamHub <span className="text-white/70">by Admin Team</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
