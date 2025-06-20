"use client"

import { Suspense, useState, useEffect } from "react"
import VideoInfo from "@/components/video-info"
import RelatedVideos from "@/components/related-videos"
import AutomatedSkipOverlay from "@/components/automated-skip-overlay"
import MainHeader from "@/components/main-header"
import CategoryFilters from "@/components/category-filters"

// Mock video data - in production this would come from a database
const mockVideoData = {
  "1": {
    id: "1",
    title: "Amazing Landscape Photography Tutorial",
    description: "Learn the secrets of capturing breathtaking landscape photos with professional techniques and tips.",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "/placeholder.svg?height=400&width=700",
    duration: "12:34",
    views: "15.2K",
    likes: "1.2K",
    tags: ["Photography", "Tutorial", "Landscape", "Camera Settings"],
    uploadDate: "2024-01-15",
  },
  "2": {
    id: "2",
    title: "Modern Web Development Best Practices",
    description: "Explore the latest trends and best practices in modern web development using React and Next.js.",
    embedUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    thumbnail: "/placeholder.svg?height=400&width=700",
    duration: "18:45",
    views: "23.7K",
    likes: "2.1K",
    tags: ["Web Development", "React", "Tutorial"],
    uploadDate: "2024-01-12",
  },
  "3": {
    id: "3",
    title: "Cooking Masterclass: Italian Cuisine",
    description: "Master the art of Italian cooking with authentic recipes and traditional techniques.",
    embedUrl: "https://www.youtube.com/embed/BodXwAYeTfM",
    thumbnail: "/placeholder.svg?height=400&width=700",
    duration: "25:12",
    views: "31.5K",
    likes: "3.8K",
    tags: ["Cooking", "Italian", "Masterclass"],
    uploadDate: "2024-01-10",
  },
  "4": {
    id: "4",
    title: "Fitness Journey: Home Workout Routine",
    description: "Get fit at home with this comprehensive workout routine designed for all fitness levels.",
    embedUrl: "https://www.youtube.com/embed/UEx-cvVfhrc",
    thumbnail: "/placeholder.svg?height=400&width=700",
    duration: "22:18",
    views: "19.8K",
    likes: "1.9K",
    tags: ["Fitness", "Home Workout", "Health"],
    uploadDate: "2024-01-08",
  },
  "5": {
    id: "5",
    title: "Digital Art Creation Process",
    description: "Watch the complete process of creating stunning digital artwork from concept to completion.",
    embedUrl: "https://www.youtube.com/embed/kVeecjewsxs",
    thumbnail: "/placeholder.svg?height=400&width=700",
    duration: "16:42",
    views: "12.3K",
    likes: "1.5K",
    tags: ["Digital Art", "Creative", "Process"],
    uploadDate: "2024-01-05",
  },
  "6": {
    id: "6",
    title: "Travel Vlog: Hidden Gems of Japan",
    description:
      "Discover the most beautiful and lesser-known destinations in Japan through this immersive travel experience.",
    embedUrl: "https://www.youtube.com/embed/coYw-eVU0Ks",
    thumbnail: "/placeholder.svg?height=400&width=700",
    duration: "28:55",
    views: "45.2K",
    likes: "4.7K",
    tags: ["Travel", "Japan", "Vlog"],
    uploadDate: "2024-01-03",
  },
}

interface VideoPageProps {
  params: {
    id: string
  }
}

const extractSrcFromIframe = (iframeCode: string): string => {
  if (!iframeCode) return ""
  const srcMatch = iframeCode.match(/src=["']([^"']+)["']/i)
  return srcMatch ? srcMatch[1] : iframeCode
}

export default function VideoPage({ params }: VideoPageProps) {
  const [uploadedVideos, setUploadedVideos] = useState<any[]>([])
  const [video, setVideo] = useState<any>(null)

  useEffect(() => {
    // Load uploaded videos from localStorage
    if (typeof window !== "undefined") {
      const savedVideos = localStorage.getItem("uploadedVideos")
      let allVideos = [...Object.values(mockVideoData)]

      if (savedVideos) {
        const videos = JSON.parse(savedVideos)
        setUploadedVideos(videos)
        allVideos = [...videos, ...allVideos]
      }

      // Find the video by ID from all available videos
      const foundVideo = allVideos.find((v: any) => v.id === params.id)
      if (foundVideo) {
        setVideo(foundVideo)
      }
    }
  }, [params.id])

  // If video is still null after loading, show not found
  if (video === null) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Loading...</h1>
          <p className="text-zinc-400">Please wait while we load the video.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <MainHeader />

      {/* Category Filters */}
      <div className="sticky top-14 z-40 bg-zinc-950 border-b border-zinc-800">
        <CategoryFilters />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Content */}
          <div className="lg:col-span-2 space-y-6">
            <Suspense fallback={<VideoPlayerSkeleton />}>
              <AutomatedSkipOverlay
                video={{
                  ...video,
                  embedUrl: video.embedUrl || video.embedCode ? extractSrcFromIframe(video.embedCode) : video.embedUrl,
                }}
              />
            </Suspense>

            <VideoInfo video={video} />
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <h3 className="text-lg font-semibold text-white mb-4 px-2">Related Videos</h3>
              <Suspense fallback={<RelatedVideosSkeleton />}>
                <RelatedVideos currentVideoId={video.id} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function VideoPlayerSkeleton() {
  return <div className="aspect-video bg-zinc-800 rounded-lg animate-pulse"></div>
}

function RelatedVideosSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="animate-pulse mx-2">
          <div className="aspect-video bg-zinc-800 rounded-lg mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-zinc-800 rounded"></div>
            <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
