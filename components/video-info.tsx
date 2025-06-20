"use client"

import { useState } from "react"
import { ThumbsUp, ThumbsDown, Share, Download, Eye, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface VideoInfoProps {
  video: {
    id: string
    title: string
    description: string
    views: string
    likes?: string
    tags: string[]
    uploadDate: string
  }
}

export default function VideoInfo({ video }: VideoInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
    if (disliked) setDisliked(false)
  }

  const handleDislike = () => {
    setDisliked(!disliked)
    if (liked) setLiked(false)
  }

  return (
    <div className="space-y-4">
      {/* Video Title */}
      <h1 className="text-xl font-semibold text-white leading-tight">{video.title}</h1>

      {/* Video Stats and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4 text-zinc-400 text-sm">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{video.views} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={liked ? "default" : "secondary"}
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-2 ${
              liked ? "bg-white text-black hover:bg-gray-200" : "bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{video.likes || "0"}</span>
          </Button>

          <Button
            variant={disliked ? "default" : "secondary"}
            size="sm"
            onClick={handleDislike}
            className={`${
              disliked ? "bg-white text-black hover:bg-gray-200" : "bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
          </Button>

          <Button variant="secondary" size="sm" className="bg-zinc-800 text-white hover:bg-zinc-700">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>

          <Button variant="secondary" size="sm" className="bg-zinc-800 text-white hover:bg-zinc-700">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Video Description */}
      <div className="bg-zinc-900 rounded-lg p-4">
        <div className={`text-zinc-300 text-sm leading-relaxed ${!isExpanded ? "line-clamp-3" : ""}`}>
          {video.description}
        </div>

        {video.description.length > 150 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-zinc-400 hover:text-white p-0 h-auto"
          >
            {isExpanded ? "Show less" : "Show more"}
          </Button>
        )}
      </div>

      {/* Tags */}
      {video.tags && video.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {video.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700">
              #{tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
