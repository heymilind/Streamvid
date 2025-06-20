"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, EyeOff, Lock, Key } from "lucide-react"

interface ChangePasswordModalProps {
  trigger: React.ReactNode
}

export default function ChangePasswordModal({ trigger }: ChangePasswordModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validatePassword = (password: string) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (password.length < minLength) {
      return "Password must be at least 8 characters long"
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter"
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter"
    }
    if (!hasNumbers) {
      return "Password must contain at least one number"
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character"
    }
    return null
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Get current stored credentials
    const storedCredentials = localStorage.getItem("adminCredentials")
    const currentCredentials = storedCredentials
      ? JSON.parse(storedCredentials)
      : { username: "admin", password: "flapadmin2025@06#" }

    // Verify current password
    if (currentPassword !== currentCredentials.password) {
      setError("Current password is incorrect")
      setIsLoading(false)
      return
    }

    // Validate new password
    const passwordError = validatePassword(newPassword)
    if (passwordError) {
      setError(passwordError)
      setIsLoading(false)
      return
    }

    // Check if new password matches confirmation
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      setIsLoading(false)
      return
    }

    // Check if new password is different from current
    if (newPassword === currentPassword) {
      setError("New password must be different from current password")
      setIsLoading(false)
      return
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update stored credentials
    const updatedCredentials = {
      ...currentCredentials,
      password: newPassword,
      lastChanged: new Date().toISOString(),
    }
    localStorage.setItem("adminCredentials", JSON.stringify(updatedCredentials))

    // Update auth session to prevent logout
    const authData = localStorage.getItem("adminAuth")
    if (authData) {
      const auth = JSON.parse(authData)
      auth.passwordChanged = true
      auth.lastPasswordChange = new Date().toISOString()
      localStorage.setItem("adminAuth", JSON.stringify(auth))
    }

    setSuccess("Password changed successfully!")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setIsLoading(false)

    // Close modal after success
    setTimeout(() => {
      setIsOpen(false)
      setSuccess("")
    }, 2000)
  }

  const resetForm = () => {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setError("")
    setSuccess("")
    setShowCurrentPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) resetForm()
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-zinc-900 border border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Key className="w-5 h-5" />
            Change Password
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50 rounded-lg">
              <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 rounded-lg">
              <AlertDescription className="text-green-800 text-sm">{success}</AlertDescription>
            </Alert>
          )}

          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-sm font-medium text-zinc-400">
              Current Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
                disabled={isLoading}
                className="pl-10 pr-10 bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-400"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={isLoading}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-3 w-3 text-zinc-400" />
                ) : (
                  <Eye className="h-3 w-3 text-zinc-400" />
                )}
              </Button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-sm font-medium text-zinc-400">
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                disabled={isLoading}
                className="pl-10 pr-10 bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-400"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isLoading}
              >
                {showNewPassword ? (
                  <EyeOff className="h-3 w-3 text-zinc-400" />
                ) : (
                  <Eye className="h-3 w-3 text-zinc-400" />
                )}
              </Button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium text-zinc-400">
              Confirm New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                disabled={isLoading}
                className="pl-10 pr-10 bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-400"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-3 w-3 text-zinc-400" />
                ) : (
                  <Eye className="h-3 w-3 text-zinc-400" />
                )}
              </Button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
            <h4 className="text-sm font-medium text-zinc-300 mb-2">Password Requirements:</h4>
            <ul className="text-xs text-zinc-400 space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Contains uppercase and lowercase letters</li>
              <li>• Contains at least one number</li>
              <li>• Contains at least one special character (!@#$%^&*)</li>
              <li>• Must be different from current password</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
              className="flex-1 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-600"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
