import Link from "next/link"
import Image from "next/image"
import { Clock, Eye } from "lucide-react"

// Mock related videos data
const relatedVideos = [
  {
    id: "2",
    title: "Modern Web Development Best Practices",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "18:45",
    views: "23.7K",
    uploadDate: "2024-01-12",
  },
  {
    id: "3",
    title: "Cooking Masterclass: Italian Cuisine",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "25:12",
    views: "31.5K",
    uploadDate: "2024-01-10",
  },
  {
    id: "4",
    title: "Fitness Journey: Home Workout Routine",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "22:18",
    views: "19.8K",
    uploadDate: "2024-01-08",
  },
  {
    id: "5",
    title: "Digital Art Creation Process",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "16:42",
    views: "12.3K",
    uploadDate: "2024-01-05",
  },
  {
    id: "6",
    title: "Hidden Gems of Japan Travel Guide",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "28:55",
    views: "45.2K",
    uploadDate: "2024-01-03",
  },
  {
    id: "7",
    title: "Photography Composition Techniques",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "14:32",
    views: "18.9K",
    uploadDate: "2024-01-01",
  },
]

interface RelatedVideosProps {
  currentVideoId: string
}

export default function RelatedVideos({ currentVideoId }: RelatedVideosProps) {
  const filteredVideos = relatedVideos.filter((video) => video.id !== currentVideoId)

  return (
    <div className="space-y-4">
      {filteredVideos.map((video) => (
        <div key={video.id} className="group cursor-pointer">
          <Link href={`/video/${video.id}`}>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-800 mx-2">
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
            </div>
          </Link>

          <div className="mt-3 px-2">
            <Link href={`/video/${video.id}`}>
              <h4 className="font-medium text-white line-clamp-2 text-sm leading-5 group-hover:text-blue-400 transition-colors">
                {video.title}
              </h4>
            </Link>

            <div className="mt-2 flex items-center gap-1 text-zinc-400 text-sm">
              <Eye className="w-3 h-3" />
              <span>{video.views} views</span>
              <span>•</span>
              <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
