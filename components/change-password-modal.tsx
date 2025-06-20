"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, EyeOff, Lock, Key, CheckCircle, AlertTriangle } from "lucide-react"

interface ChangePasswordModalProps {
  trigger: React.ReactNode
}

interface PasswordStrength {
  score: number
  feedback: string[]
  color: string
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
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    color: "text-gray-400",
  })

  const validatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    const feedback: string[] = []

    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push("At least 8 characters")
    }

    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push("One uppercase letter")
    }

    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push("One lowercase letter")
    }

    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push("One number")
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1
    } else {
      feedback.push("One special character")
    }

    // Additional strength checks
    if (password.length >= 12) score += 1
    if (/[!@#$%^&*(),.?":{}|<>].*[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1

    let color = "text-red-400"
    if (score >= 3) color = "text-yellow-400"
    if (score >= 5) color = "text-green-400"
    if (score >= 6) color = "text-green-500"

    return { score, feedback, color }
  }

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

  const handleNewPasswordChange = (password: string) => {
    setNewPassword(password)
    setPasswordStrength(validatePasswordStrength(password))
  }

  const invalidatePreviousPassword = (oldPassword: string) => {
    // Create a record of invalidated passwords with timestamp
    const invalidatedPasswords = JSON.parse(localStorage.getItem("invalidatedPasswords") || "[]")
    invalidatedPasswords.push({
      password: oldPassword,
      invalidatedAt: new Date().toISOString(),
      reason: "Password changed by user",
    })

    // Keep only last 10 invalidated passwords for security audit
    if (invalidatedPasswords.length > 10) {
      invalidatedPasswords.splice(0, invalidatedPasswords.length - 10)
    }

    localStorage.setItem("invalidatedPasswords", JSON.stringify(invalidatedPasswords))
  }

  const updatePasswordHistory = (newPassword: string) => {
    // Maintain password history to prevent reuse
    const passwordHistory = JSON.parse(localStorage.getItem("passwordHistory") || "[]")
    passwordHistory.push({
      passwordHash: btoa(newPassword), // Simple encoding for demo
      createdAt: new Date().toISOString(),
    })

    // Keep only last 5 passwords
    if (passwordHistory.length > 5) {
      passwordHistory.splice(0, passwordHistory.length - 5)
    }

    localStorage.setItem("passwordHistory", JSON.stringify(passwordHistory))
  }

  const checkPasswordReuse = (newPassword: string): boolean => {
    const passwordHistory = JSON.parse(localStorage.getItem("passwordHistory") || "[]")
    const newPasswordHash = btoa(newPassword)

    return passwordHistory.some((entry: any) => entry.passwordHash === newPasswordHash)
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Get current stored credentials
      const storedCredentials = localStorage.getItem("adminCredentials")
      const currentCredentials = storedCredentials
        ? JSON.parse(storedCredentials)
        : { username: "admin", password: "flapadmin2025@06#" }

      // Verify current password
      if (currentPassword !== currentCredentials.password) {
        throw new Error("Current password is incorrect")
      }

      // Validate new password
      const passwordError = validatePassword(newPassword)
      if (passwordError) {
        throw new Error(passwordError)
      }

      // Check if new password matches confirmation
      if (newPassword !== confirmPassword) {
        throw new Error("New passwords do not match")
      }

      // Check if new password is different from current
      if (newPassword === currentPassword) {
        throw new Error("New password must be different from current password")
      }

      // Check password reuse
      if (checkPasswordReuse(newPassword)) {
        throw new Error("Cannot reuse a recent password. Please choose a different password.")
      }

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Invalidate the previous password immediately
      invalidatePreviousPassword(currentCredentials.password)

      // Update password history
      updatePasswordHistory(newPassword)

      // Update stored credentials with new password
      const updatedCredentials = {
        ...currentCredentials,
        password: newPassword,
        lastChanged: new Date().toISOString(),
        changeCount: (currentCredentials.changeCount || 0) + 1,
        previousPasswordInvalidated: true,
      }
      localStorage.setItem("adminCredentials", JSON.stringify(updatedCredentials))

      // Update auth session to prevent logout and mark password change
      const authData = localStorage.getItem("adminAuth")
      if (authData) {
        const auth = JSON.parse(authData)
        auth.passwordChanged = true
        auth.lastPasswordChange = new Date().toISOString()
        auth.passwordChangeCount = (auth.passwordChangeCount || 0) + 1
        localStorage.setItem("adminAuth", JSON.stringify(auth))
      }

      // Log security event
      const securityLog = JSON.parse(localStorage.getItem("securityLog") || "[]")
      securityLog.push({
        event: "PASSWORD_CHANGED",
        timestamp: new Date().toISOString(),
        details: {
          username: currentCredentials.username,
          previousPasswordInvalidated: true,
          changeMethod: "user_initiated",
        },
      })
      localStorage.setItem("securityLog", JSON.stringify(securityLog))

      setSuccess("Password changed successfully! Previous password has been invalidated.")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setPasswordStrength({ score: 0, feedback: [], color: "text-gray-400" })

      // Close modal after success with delay to show message
      setTimeout(() => {
        setIsOpen(false)
        setSuccess("")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
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
    setPasswordStrength({ score: 0, feedback: [], color: "text-gray-400" })
  }

  const getStrengthLabel = (score: number) => {
    if (score < 3) return "Weak"
    if (score < 5) return "Fair"
    if (score < 6) return "Good"
    return "Strong"
  }

  const getStrengthWidth = (score: number) => {
    return `${Math.min((score / 7) * 100, 100)}%`
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
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4" />
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
                onChange={(e) => handleNewPasswordChange(e.target.value)}
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

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Password Strength:</span>
                  <span className={`text-xs font-medium ${passwordStrength.color}`}>
                    {getStrengthLabel(passwordStrength.score)}
                  </span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.score < 3
                        ? "bg-red-500"
                        : passwordStrength.score < 5
                          ? "bg-yellow-500"
                          : passwordStrength.score < 6
                            ? "bg-green-500"
                            : "bg-green-600"
                    }`}
                    style={{ width: getStrengthWidth(passwordStrength.score) }}
                  />
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <div className="text-xs text-zinc-400">Missing: {passwordStrength.feedback.join(", ")}</div>
                )}
              </div>
            )}
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
            {/* Password Match Indicator */}
            {confirmPassword && (
              <div className="text-xs">
                {newPassword === confirmPassword ? (
                  <span className="text-green-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Passwords match
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Passwords do not match
                  </span>
                )}
              </div>
            )}
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
              <li>• Cannot reuse recent passwords</li>
            </ul>
          </div>

          {/* Security Notice */}
          <div className="p-3 bg-amber-900/20 border border-amber-800 rounded-lg">
            <h4 className="text-sm font-medium text-amber-300 mb-1">Security Notice:</h4>
            <p className="text-xs text-amber-200">
              Changing your password will immediately invalidate the previous password and log out any other active
              sessions.
            </p>
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
            <Button
              type="submit"
              disabled={isLoading || passwordStrength.score < 5 || newPassword !== confirmPassword}
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
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
