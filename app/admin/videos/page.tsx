"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import VideoCRUD from "@/components/video-crud"
import MainHeader from "@/components/main-header"

export default function AdminVideosPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const authData = localStorage.getItem("adminAuth")
    if (authData) {
      try {
        const { isAuthenticated, loginTime } = JSON.parse(authData)
        const isExpired = Date.now() - loginTime > 24 * 60 * 60 * 1000

        if (!isAuthenticated || isExpired) {
          router.push("/admin/login")
        }
      } catch (error) {
        router.push("/admin/login")
      }
    } else {
      router.push("/admin/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VideoCRUD />
      </div>
    </div>
  )
}
