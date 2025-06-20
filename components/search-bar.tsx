"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log("Searching for:", searchQuery)
  }

  return (
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
      <div className="relative flex">
        <Input
          type="text"
          placeholder="Search for videos, creators, or topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="modern-input flex-1 pl-12 pr-4 py-3 text-base bg-white border-r-0 rounded-r-none"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Button
          type="submit"
          className="modern-button bg-gray-900 text-white hover:bg-gray-800 rounded-l-none px-6 py-3"
        >
          Search
        </Button>
      </div>
    </form>
  )
}
