import MainHeader from "@/components/main-header"
import Link from "next/link"
import Image from "next/image"
import { Play, Video } from "lucide-react"

// Category definitions with thumbnails and metadata
const categories = [
  {
    slug: "travel",
    name: "Travel",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Travel+Adventures",
    color: "bg-blue-500",
    videoCount: 12,
  },
  {
    slug: "cooking",
    name: "Cooking",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Cooking+Masterclass",
    color: "bg-orange-500",
    videoCount: 8,
  },
  {
    slug: "technology",
    name: "Technology",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Tech+Reviews",
    color: "bg-indigo-500",
    videoCount: 15,
  },
  {
    slug: "fitness",
    name: "Fitness",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Fitness+Training",
    color: "bg-green-500",
    videoCount: 10,
  },
  {
    slug: "education",
    name: "Education",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Educational+Content",
    color: "bg-purple-500",
    videoCount: 18,
  },
  {
    slug: "entertainment",
    name: "Entertainment",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Entertainment+Hub",
    color: "bg-pink-500",
    videoCount: 22,
  },
  {
    slug: "gaming",
    name: "Gaming",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Gaming+Zone",
    color: "bg-red-500",
    videoCount: 14,
  },
  {
    slug: "lifestyle",
    name: "Lifestyle",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Lifestyle+Tips",
    color: "bg-teal-500",
    videoCount: 9,
  },
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <MainHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Browse by Category</h1>
          <p className="text-xl text-zinc-400">Discover content organized by your interests</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {categories.map((category) => (
            <div key={category.slug} className="group cursor-pointer">
              <Link href={`/category/${category.slug}`}>
                <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-800">
                  <Image
                    src={category.thumbnail || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    {category.videoCount}
                  </div>
                </div>
              </Link>

              <div className="mt-3">
                <Link href={`/category/${category.slug}`}>
                  <h3 className="font-medium text-white line-clamp-2 text-sm leading-5 group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
