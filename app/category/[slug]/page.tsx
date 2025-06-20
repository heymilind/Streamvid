import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Play, Eye, Clock, ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

// Extended mock data with more videos across different categories
const allVideos = [
  // Travel Videos
  {
    id: "travel-1",
    title: "Hidden Gems of Japan: Off the Beaten Path",
    description:
      "Discover the most beautiful and lesser-known destinations in Japan through this immersive travel experience.",
    thumbnail: "/placeholder.svg?height=200&width=350&text=Japan+Travel",
    embedUrl: "https://www.youtube.com/embed/coYw-eVU0Ks",
    duration: "28:55",
    views: "45.2K",
    tags: ["Travel", "Japan", "Vlog"],
    category: "travel",
    uploadDate: "2024-01-03",
  },
  {
    id: "travel-2",
    title: "European Road Trip: 10 Countries in 30 Days",
    description: "Join us on an epic European adventure across 10 amazing countries.",
    thumbnail: "/placeholder.svg?height=200&width=350&text=Europe+Road+Trip",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "35:12",
    views: "62.8K",
    tags: ["Travel", "Europe", "Road Trip"],
    category: "travel",
    uploadDate: "2024-01-01",
  },
  {
    id: "travel-3",
    title: "Backpacking Southeast Asia on $20 a Day",
    description: "Budget travel tips and tricks for exploring Southeast Asia.",
    thumbnail: "/placeholder.svg?height=200&width=350&text=Southeast+Asia",
    embedUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    duration: "22:18",
    views: "38.5K",
    tags: ["Travel", "Budget", "Asia"],
    category: "travel",
    uploadDate: "2023-12-28",
  },

  // Cooking Videos
  {
    id: "cooking-1",
    title: "Authentic Italian Pasta Making Masterclass",
    description: "Master the art of Italian cooking with authentic recipes and traditional techniques.",
    thumbnail: "/placeholder.svg?height=200&width=350&text=Italian+Pasta",
    embedUrl: "https://www.youtube.com/embed/BodXwAYeTfM",
    duration: "25:12",
    views: "31.5K",
    tags: ["Cooking", "Italian", "Masterclass"],
    category: "cooking",
    uploadDate: "2024-01-10",
  },
  {
    id: "cooking-2",
    title: "French Pastry Techniques: Croissants from Scratch",
    description: "Learn professional pastry techniques to make perfect croissants at home.",
    thumbnail: "/placeholder.svg?height=200&width=350&text=French+Pastry",
    embedUrl: "https://www.youtube.com/embed/kVeecjewsxs",
    duration: "32:45",
    views: "28.3K",
    tags: ["Cooking", "French", "Pastry"],
    category: "cooking",
    uploadDate: "2024-01-08",
  },

  // Technology Videos
  {
    id: "tech-1",
    title: "Modern Web Development Best Practices 2024",
    description: "Explore the latest trends and best practices in modern web development using React and Next.js.",
    thumbnail: "/placeholder.svg?height=200&width=350&text=Web+Development",
    embedUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    duration: "18:45",
    views: "23.7K",
    tags: ["Web Development", "React", "Tutorial"],
    category: "technology",
    uploadDate: "2024-01-12",
  },
  {
    id: "tech-2",
    title: "AI and Machine Learning Explained Simply",
    description: "Understanding artificial intelligence and machine learning concepts for beginners.",
    thumbnail: "/placeholder.svg?height=200&width=350&text=AI+ML",
    embedUrl: "https://www.youtube.com/embed/UEx-cvVfhrc",
    duration: "24:30",
    views: "41.2K",
    tags: ["AI", "Machine Learning", "Technology"],
    category: "technology",
    uploadDate: "2024-01-06",
  },

  // Fitness Videos
  {
    id: "fitness-1",
    title: "30-Minute Full Body Home Workout",
    description: "Get fit at home with this comprehensive workout routine designed for all fitness levels.",
    thumbnail: "/placeholder.svg?height=200&width=350&text=Home+Workout",
    embedUrl: "https://www.youtube.com/embed/UEx-cvVfhrc",
    duration: "30:00",
    views: "19.8K",
    tags: ["Fitness", "Home Workout", "Health"],
    category: "fitness",
    uploadDate: "2024-01-08",
  },
  {
    id: "fitness-2",
    title: "Yoga for Beginners: Morning Flow Routine",
    description: "Start your day right with this gentle yoga flow perfect for beginners.",
    thumbnail: "/placeholder.svg?height=200&width=350&text=Yoga+Flow",
    embedUrl: "https://www.youtube.com/embed/kVeecjewsxs",
    duration: "20:15",
    views: "15.6K",
    tags: ["Yoga", "Fitness", "Morning"],
    category: "fitness",
    uploadDate: "2024-01-05",
  },

  // Education Videos
  {
    id: "edu-1",
    title: "Photography Fundamentals: Composition and Lighting",
    description: "Learn the secrets of capturing breathtaking photos with professional techniques and tips.",
    thumbnail: "/placeholder.svg?height=200&width=350&text=Photography+Tutorial",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "12:34",
    views: "15.2K",
    tags: ["Photography", "Tutorial", "Education"],
    category: "education",
    uploadDate: "2024-01-15",
  },

  // Entertainment Videos
  {
    id: "ent-1",
    title: "Comedy Sketch: Office Life Parody",
    description: "Hilarious take on modern office culture and remote work situations.",
    thumbnail: "/placeholder.svg?height=200&width=350&text=Comedy+Sketch",
    embedUrl: "https://www.youtube.com/embed/BodXwAYeTfM",
    duration: "8:22",
    views: "52.1K",
    tags: ["Comedy", "Entertainment", "Sketch"],
    category: "entertainment",
    uploadDate: "2024-01-04",
  },
]

// Category definitions
const categories = {
  travel: {
    name: "Travel",
    description: "Explore the world through amazing travel vlogs and destination guides",
    color: "bg-blue-500",
  },
  cooking: {
    name: "Cooking",
    description: "Delicious recipes and culinary techniques from around the world",
    color: "bg-orange-500",
  },
  technology: {
    name: "Technology",
    description: "Latest tech reviews, tutorials, and programming guides",
    color: "bg-indigo-500",
  },
  fitness: {
    name: "Fitness",
    description: "Workout routines, health tips, and wellness content",
    color: "bg-green-500",
  },
  education: {
    name: "Education",
    description: "Learn new skills with tutorials and educational content",
    color: "bg-purple-500",
  },
  entertainment: {
    name: "Entertainment",
    description: "Comedy, music, and entertaining content for all ages",
    color: "bg-pink-500",
  },
}

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params
  const category = categories[slug as keyof typeof categories]

  if (!category) {
    notFound()
  }

  // Filter videos by category
  const categoryVideos = allVideos.filter((video) => video.category === slug)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              StreamHub
            </Link>
            <div className="flex-1 max-w-2xl mx-8">{/* Search component would go here */}</div>
            <div className="w-32"></div>
          </div>
        </div>
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 h-12 items-center">
              <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Home
              </Link>
              <Link href="/browse" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Browse
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Categories
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Category Header */}
      <section className={`${category.color} text-white py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
          <p className="text-xl opacity-90 mb-4">{category.description}</p>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {categoryVideos.length} videos
          </Badge>
        </div>
      </section>

      {/* Videos Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {categoryVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <Link href={`/video/${video.id}`}>
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {video.duration}
                    </div>
                  </div>
                </Link>

                <div className="p-4">
                  <Link href={`/video/${video.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      {video.title}
                    </h3>
                  </Link>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Eye className="w-3 h-3" />
                    <span>{video.views} views</span>
                    <span>•</span>
                    <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {video.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-600">There are no videos in this category yet.</p>
          </div>
        )}
      </main>
    </div>
  )
}
