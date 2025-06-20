"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock } from "lucide-react"

// Updated mock data without channel/uploader info
const mockVideos = [
  {
    id: "1",
    title: "Amazing Landscape Photography Tutorial - Master the Art of Nature Photography",
    description: "Learn the secrets of capturing breathtaking landscape photos with professional techniques and tips.",
    thumbnail: "/placeholder.svg?height=200&width=350&text=Photography+Tutorial",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "12:34",
    views: "15.2K",
    uploadTime: "2 days ago",
    tags: ["Photography", "Tutorial", "Landscape"],
    category: "education",
    uploadDate: "2024-01-15",
  },
  {
    id: "2",
    title: "Modern Web Development Best Practices 2024 - React, Next.js & TypeScript",
    description: "Explore the latest trends and best practices in modern web development using React and Next.js.",
    thumbnail: "/placeholder.svg?height=200&width=350&text=Web+Development",
    embedUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    duration: "18:45",
    views: "23.7K",
    uploadTime: "1 week ago",
    tags: ["Web Development", "React", "Tutorial"],
    category: "technology",
    uploadDate: "2024-01-12",
  },
  {
    id: "3",
    title: "Authentic Italian Pasta Making Masterclass - From Scratch to Perfection",
    description: "Master the art of Italian cooking with authentic recipes and traditional techniques.",
    thumbnail: "/placeholder.svg?height=200&width=350&text=Italian+Cooking",
    embedUrl: "https://www.youtube.com/embed/BodXwAYeTfM",
    duration: "25:12",
    views: "31.5K",
    uploadTime: "3 days ago",
    tags: ["Cooking", "Italian", "Masterclass"],
    category: "cooking",
    uploadDate: "2024-01-10",
  },
  {
    id: "4",
    title: "30-Minute Full Body Home Workout - No Equipment Needed",
    description: "Get fit at home with this comprehensive workout routine designed for all fitness levels.",
    thumbnail: "/placeholder.svg?height=200&width=350&text=Home+Workout",
    embedUrl: "https://www.youtube.com/embed/UEx-cvVfhrc",
    duration: "30:00",
    views: "19.8K",
    uploadTime: "5 days ago",
    tags: ["Fitness", "Home Workout", "Health"],
    category: "fitness",
    uploadDate: "2024-01-08",
  },
  {
    id: "5",
    title: "Digital Art Creation Process - From Concept to Final Masterpiece",
    description: "Watch the complete process of creating stunning digital artwork from concept to completion.",
    thumbnail: "/placeholder.svg?height=200&width=350&text=Digital+Art",
    embedUrl: "https://www.youtube.com/embed/kVeecjewsxs",
    duration: "16:42",
    views: "12.3K",
    uploadTime: "1 day ago",
    tags: ["Digital Art", "Creative", "Process"],
    category: "entertainment",
    uploadDate: "2024-01-05",
  },
  {
    id: "6",
    title: "Hidden Gems of Japan - Off the Beaten Path Travel Guide",
    description:
      "Discover the most beautiful and lesser-known destinations in Japan through this immersive travel experience.",
    thumbnail: "/placeholder.svg?height=200&width=350&text=Japan+Travel",
    embedUrl: "https://www.youtube.com/embed/coYw-eVU0Ks",
    duration: "28:55",
    views: "45.2K",
    uploadTime: "2 weeks ago",
    tags: ["Travel", "Japan", "Vlog"],
    category: "travel",
    uploadDate: "2024-01-03",
  },
]

export default function VideoGrid() {
  const [uploadedVideos, setUploadedVideos] = useState<any[]>([])

  // Load uploaded videos from localStorage
  useEffect(() => {
    const loadUploadedVideos = () => {
      if (typeof window !== "undefined") {
        const savedVideos = localStorage.getItem("uploadedVideos")
        if (savedVideos) {
          setUploadedVideos(JSON.parse(savedVideos))
        }
      }
    }

    loadUploadedVideos()

    // Listen for storage changes to update when videos are uploaded
    const handleStorageChange = () => {
      loadUploadedVideos()
    }

    window.addEventListener("storage", handleStorageChange)

    // Also check periodically for updates (in case of same-tab updates)
    const interval = setInterval(loadUploadedVideos, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // Combine mock videos with uploaded videos, with uploaded videos first
  const allVideos = [...uploadedVideos, ...mockVideos]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {allVideos.map((video) => (
        <div key={video.id} className="group cursor-pointer">
          <Link href={`/video/${video.id}`}>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-800">
              <Image
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {video.duration}
              </div>
              {/* New Upload Badge */}
              {uploadedVideos.some((uv) => uv.id === video.id) && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">NEW</div>
              )}
            </div>
          </Link>

          <div className="mt-3">
            <Link href={`/video/${video.id}`}>
              <h3 className="font-medium text-white line-clamp-2 text-sm leading-5 group-hover:text-blue-400 transition-colors">
                {video.title}
              </h3>
            </Link>

            <div className="mt-2 flex items-center gap-1 text-zinc-400 text-sm">
              <span>{video.views} views</span>
              <span>•</span>
              <span>{video.uploadTime || new Date(video.uploadDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
