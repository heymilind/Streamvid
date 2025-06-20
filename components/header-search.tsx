"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Video } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

interface SearchResult {
  type: "video"
  id: string
  title: string
  description?: string
  thumbnail?: string
  category?: string
  tags?: string[]
}

export default function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Mock data - in production, this would come from your API
  const mockVideos = [
    {
      id: "1",
      title: "Amazing Landscape Photography Tutorial",
      description: "Learn the secrets of capturing breathtaking landscape photos",
      thumbnail: "/placeholder.svg?height=60&width=100",
      category: "education",
      tags: ["Photography", "Tutorial", "Landscape"],
    },
    {
      id: "2",
      title: "Modern Web Development Best Practices",
      description: "Explore the latest trends in web development",
      thumbnail: "/placeholder.svg?height=60&width=100",
      category: "technology",
      tags: ["Web Development", "React", "Tutorial"],
    },
  ]

  // Load uploaded videos from localStorage
  const [uploadedVideos, setUploadedVideos] = useState<any[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedVideos = localStorage.getItem("uploadedVideos")
      if (savedVideos) {
        setUploadedVideos(JSON.parse(savedVideos))
      }
    }
  }, [])

  // Combine all videos
  const allVideos = [...uploadedVideos, ...mockVideos]

  // Search function - only videos now
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)

    const searchTimeout = setTimeout(() => {
      const searchQuery = query.toLowerCase()

      // Search videos only
      const videoResults: SearchResult[] = allVideos
        .filter(
          (video) =>
            video.title.toLowerCase().includes(searchQuery) ||
            video.description?.toLowerCase().includes(searchQuery) ||
            video.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery)),
        )
        .slice(0, 8)
        .map((video) => ({
          type: "video" as const,
          id: video.id,
          title: video.title,
          description: video.description,
          thumbnail: video.thumbnail,
          category: video.category,
          tags: video.tags,
        }))

      setResults(videoResults)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleClear = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            className="w-full bg-zinc-900 border-2 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-white focus:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] font-mono border-r-0 pl-4 pr-10 h-10"
          />
          {query && (
            <Button
              onClick={handleClear}
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-zinc-400 hover:text-white hover:bg-zinc-700"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-700 border-l-0 h-10 w-12"
        >
          <Search className="w-5 h-5 text-white" />
        </Button>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border-2 border-zinc-700 max-h-96 overflow-y-auto z-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm text-zinc-400">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={`/video/${result.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={result.thumbnail || "/placeholder.svg"}
                      alt={result.title}
                      width={60}
                      height={40}
                      className="rounded object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Video className="w-4 h-4 text-zinc-400" />
                      <h3 className="font-medium text-white truncate">{result.title}</h3>
                    </div>
                    {result.description && <p className="text-sm text-zinc-400 truncate">{result.description}</p>}
                    {result.tags && result.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {result.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-zinc-800 text-zinc-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="p-4 text-center">
              <p className="text-sm text-zinc-400">No results found for "{query}"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
