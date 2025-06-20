"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"

export default function MainHeader() {
  const [siteName, setSiteName] = useState("StreamHub")
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoSize, setLogoSize] = useState(32)

  useEffect(() => {
    // Load branding settings from localStorage
    const savedSiteName = localStorage.getItem("site-name")
    const savedLogo = localStorage.getItem("site-logo")
    const savedLogoSize = localStorage.getItem("logo-size")

    if (savedSiteName !== null) {
      setSiteName(savedSiteName)
    }
    if (savedLogo) {
      setLogoUrl(savedLogo)
    }
    if (savedLogoSize) {
      setLogoSize(Number.parseInt(savedLogoSize))
    }

    // Listen for storage changes to update in real-time
    const handleStorageChange = () => {
      const newSiteName = localStorage.getItem("site-name")
      const newLogo = localStorage.getItem("site-logo")
      const newLogoSize = localStorage.getItem("logo-size")

      if (newSiteName !== null) {
        setSiteName(newSiteName)
      }
      if (newLogo) {
        setLogoUrl(newLogo)
      } else {
        setLogoUrl(null)
      }
      if (newLogoSize) {
        setLogoSize(Number.parseInt(newLogoSize))
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Also listen for custom events for same-tab updates
    window.addEventListener("brandingUpdate", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("brandingUpdate", handleStorageChange)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            {logoUrl ? (
              <img
                src={logoUrl || "/placeholder.svg"}
                alt="Site Logo"
                className="rounded object-contain"
                style={{ width: logoSize, height: logoSize }}
              />
            ) : (
              <div
                className="bg-red-600 rounded flex items-center justify-center"
                style={{ width: logoSize, height: logoSize }}
              >
                <span className="text-white font-bold" style={{ fontSize: `${logoSize * 0.6}px` }}>
                  S
                </span>
              </div>
            )}
            {siteName && <span className="text-white font-semibold text-xl hidden sm:block">{siteName}</span>}
          </Link>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search videos..."
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-400 focus:border-white focus:outline-none rounded-full pl-4 pr-12 h-10 transition-colors"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hidden Admin Access - Access via /admin */}
        <div className="flex items-center">{/* Admin interface accessible only via direct URL navigation */}</div>
      </div>

      {/* Navigation Menu */}
      <div className="border-t border-zinc-800">
        <div className="flex items-center gap-8 px-4 py-2">
          <Link
            href="/"
            className="text-zinc-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/categories"
            className="text-zinc-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/best-videos"
            className="text-zinc-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Best Videos
          </Link>
          <Link
            href="/trending"
            className="text-zinc-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Trending Videos
          </Link>
        </div>
      </div>
    </header>
  )
}
