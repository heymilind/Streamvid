"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Clock, Key, AlertTriangle, CheckCircle, History, Trash2, Eye, EyeOff } from "lucide-react"

interface SecurityEvent {
  event: string
  timestamp: string
  details: any
}

interface PasswordHistoryEntry {
  passwordHash: string
  createdAt: string
}

interface InvalidatedPassword {
  password: string
  invalidatedAt: string
  reason: string
}

export default function SecurityDashboard() {
  const [securityLog, setSecurityLog] = useState<SecurityEvent[]>([])
  const [passwordHistory, setPasswordHistory] = useState<PasswordHistoryEntry[]>([])
  const [invalidatedPasswords, setInvalidatedPasswords] = useState<InvalidatedPassword[]>([])
  const [currentCredentials, setCurrentCredentials] = useState<any>(null)
  const [showSensitiveData, setShowSensitiveData] = useState(false)

  useEffect(() => {
    // Load security data
    const log = JSON.parse(localStorage.getItem("securityLog") || "[]")
    const history = JSON.parse(localStorage.getItem("passwordHistory") || "[]")
    const invalidated = JSON.parse(localStorage.getItem("invalidatedPasswords") || "[]")
    const credentials = JSON.parse(localStorage.getItem("adminCredentials") || "{}")

    setSecurityLog(log.slice(-10)) // Show last 10 events
    setPasswordHistory(history)
    setInvalidatedPasswords(invalidated)
    setCurrentCredentials(credentials)
  }, [])

  const clearSecurityLog = () => {
    if (confirm("Are you sure you want to clear the security log?")) {
      localStorage.removeItem("securityLog")
      setSecurityLog([])
    }
  }

  const clearPasswordHistory = () => {
    if (confirm("Are you sure you want to clear password history? This will allow reuse of previous passwords.")) {
      localStorage.removeItem("passwordHistory")
      localStorage.removeItem("invalidatedPasswords")
      setPasswordHistory([])
      setInvalidatedPasswords([])
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getEventIcon = (event: string) => {
    switch (event) {
      case "PASSWORD_CHANGED":
        return <Key className="w-4 h-4 text-blue-500" />
      case "LOGIN_SUCCESS":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "LOGIN_FAILED":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Shield className="w-4 h-4 text-gray-500" />
    }
  }

  const getEventColor = (event: string) => {
    switch (event) {
      case "PASSWORD_CHANGED":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "LOGIN_SUCCESS":
        return "bg-green-100 text-green-700 border-green-200"
      case "LOGIN_FAILED":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-zinc-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Password Changes</p>
                <p className="text-2xl font-semibold text-white">{currentCredentials?.changeCount || 0}</p>
              </div>
              <Key className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Security Events</p>
                <p className="text-2xl font-semibold text-white">{securityLog.length}</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Last Password Change</p>
                <p className="text-sm font-medium text-white">
                  {currentCredentials?.lastChanged ? formatTimestamp(currentCredentials.lastChanged) : "Never"}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Password Status */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Current Password Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentCredentials?.previousPasswordInvalidated && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-800">
                  Previous password has been successfully invalidated. Only the current password is valid for
                  authentication.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Username:</span>
                  <span className="text-white font-medium">{currentCredentials?.username || "admin"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Password Set:</span>
                  <span className="text-white font-medium">
                    {currentCredentials?.lastChanged ? "Custom" : "Default"}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Changes Made:</span>
                  <span className="text-white font-medium">{currentCredentials?.changeCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Status:</span>
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Log */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <History className="w-5 h-5" />
              Security Log
            </CardTitle>
            <Button
              onClick={clearSecurityLog}
              variant="outline"
              size="sm"
              className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Log
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {securityLog.length === 0 ? (
            <p className="text-zinc-400 text-center py-4">No security events recorded</p>
          ) : (
            <div className="space-y-3">
              {securityLog.map((event, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-zinc-800 rounded-lg">
                  {getEventIcon(event.event)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getEventColor(event.event)}>{event.event.replace(/_/g, " ")}</Badge>
                      <span className="text-xs text-zinc-400">{formatTimestamp(event.timestamp)}</span>
                    </div>
                    {event.details && (
                      <div className="text-sm text-zinc-300">
                        {event.details.username && <span>User: {event.details.username}</span>}
                        {event.details.previousPasswordInvalidated && (
                          <span className="ml-2 text-green-400">• Previous password invalidated</span>
                        )}
                        {event.details.changeMethod && (
                          <span className="ml-2">• Method: {event.details.changeMethod}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password History */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Key className="w-5 h-5" />
              Password History
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                variant="outline"
                size="sm"
                className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-600"
              >
                {showSensitiveData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                onClick={clearPasswordHistory}
                variant="outline"
                size="sm"
                className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear History
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Active Password */}
            <div className="p-3 bg-green-900/20 border border-green-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-green-300">Current Password</h4>
                  <p className="text-xs text-green-200">
                    Set: {currentCredentials?.lastChanged ? formatTimestamp(currentCredentials.lastChanged) : "Default"}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              </div>
            </div>

            {/* Invalidated Passwords */}
            {invalidatedPasswords.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-zinc-300 mb-2">Invalidated Passwords</h4>
                <div className="space-y-2">
                  {invalidatedPasswords.map((entry, index) => (
                    <div key={index} className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-red-200">Invalidated: {formatTimestamp(entry.invalidatedAt)}</p>
                          <p className="text-xs text-red-300">Reason: {entry.reason}</p>
                          {showSensitiveData && (
                            <p className="text-xs text-red-400 font-mono mt-1">
                              Hash: {btoa(entry.password).substring(0, 16)}...
                            </p>
                          )}
                        </div>
                        <Badge className="bg-red-100 text-red-700">Invalidated</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Password History */}
            {passwordHistory.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-zinc-300 mb-2">Password History</h4>
                <div className="space-y-2">
                  {passwordHistory.map((entry, index) => (
                    <div key={index} className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-zinc-300">Created: {formatTimestamp(entry.createdAt)}</p>
                          {showSensitiveData && (
                            <p className="text-xs text-zinc-400 font-mono mt-1">
                              Hash: {entry.passwordHash.substring(0, 16)}...
                            </p>
                          )}
                        </div>
                        <Badge className="bg-zinc-700 text-zinc-300">Historical</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {passwordHistory.length === 0 && invalidatedPasswords.length === 0 && (
              <p className="text-zinc-400 text-center py-4">No password history available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Security Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span className="text-zinc-300">Change your password regularly (recommended every 90 days)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span className="text-zinc-300">Use strong passwords with mixed characters, numbers, and symbols</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span className="text-zinc-300">Never reuse passwords from other accounts</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span className="text-zinc-300">Monitor security logs regularly for suspicious activity</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
