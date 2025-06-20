"use client"

import AdminAuthGuard from "@/components/admin-auth-guard"
import AdminDashboard from "@/components/admin-dashboard"

export default function AdminDashboardPage() {
  return (
    <AdminAuthGuard>
      <AdminDashboard />
    </AdminAuthGuard>
  )
}
