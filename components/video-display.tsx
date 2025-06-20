"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye, Heart, Play } from "lucide-react"

interface VideoData {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  tags: string[]
  category: string
  uploadDate: string
  views: number
  likes: number
  duration: string
  status: "active" | "draft" | "archived"
}

export default function VideoDisplay() {
  const [videos, setVideos] = useState<VideoData[]>([])

  useEffect(() => {
    const loadVideos = () => {
      const savedVideos = localStorage.getItem("videoCRUD")
      if (savedVideos) {
        const parsedVideos = JSON.parse(savedVideos)
        // Only show active videos on the public site
        const activeVideos = parsedVideos.filter((video: VideoData) => video.status === "active")
        setVideos(activeVideos)
      }
    }

    loadVideos()

    // Listen for storage changes
    const handleStorageChange = () => {
      loadVideos()
    }

    window.addEventListener("storage", handleStorageChange)
    const interval = setInterval(loadVideos, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Play className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No videos available</h3>
        <p className="text-gray-400">Videos will appear here once they are published</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {videos.map((video) => (
        <div key={video.id} className="group cursor-pointer">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-800">
            <Image
              src={video.thumbnailUrl || "/placeholder.svg"}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {video.duration}
            </div>
            <div className="absolute top-2 left-2">
              <Badge className="bg-blue-600 text-white text-xs">NEW</Badge>
            </div>
            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-white bg-opacity-90 rounded-full p-3">
                  <Play className="w-6 h-6 text-black" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <h3 className="font-medium text-white line-clamp-2 text-sm leading-5 group-hover:text-blue-400 transition-colors">
              {video.title}
            </h3>

            <div className="mt-2 flex items-center gap-3 text-zinc-400 text-sm">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {video.views}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {video.likes}
              </span>
              <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              {video.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs text-gray-400 border-gray-600">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
