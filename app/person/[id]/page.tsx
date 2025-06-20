import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Eye, MapPin, Globe, Twitter, Instagram } from "lucide-react"
import { notFound } from "next/navigation"
import HeaderSearch from "@/components/header-search"

// Mock person data
const mockPersonData = {
  "1": {
    id: "1",
    name: "John Smith",
    role: "Professional Photographer",
    bio: "John Smith is a renowned landscape photographer with over 15 years of experience capturing the world's most breathtaking natural scenes. His work has been featured in National Geographic, Travel + Leisure, and numerous photography exhibitions worldwide. John specializes in golden hour photography and has developed unique techniques for capturing the perfect light in challenging conditions.",
    location: "Colorado, USA",
    website: "https://johnsmithphotography.com",
    social: {
      twitter: "@johnsmithphoto",
      instagram: "@johnsmith_photography",
    },
    profileImage: "/placeholder.svg?height=300&width=300",
    coverImage: "/placeholder.svg?height=400&width=1200",
    stats: {
      videos: 24,
      totalViews: "2.3M",
      followers: "45.2K",
    },
    videos: [
      {
        id: "1",
        title: "Amazing Landscape Photography Tutorial",
        thumbnail: "/placeholder.svg?height=200&width=350",
        duration: "12:34",
        views: "15.2K",
        uploadDate: "2024-01-15",
      },
      {
        id: "7",
        title: "Golden Hour Photography Secrets",
        thumbnail: "/placeholder.svg?height=200&width=350",
        duration: "18:22",
        views: "28.7K",
        uploadDate: "2024-01-08",
      },
      {
        id: "8",
        title: "Mountain Photography Expedition",
        thumbnail: "/placeholder.svg?height=200&width=350",
        duration: "22:15",
        views: "19.4K",
        uploadDate: "2024-01-01",
      },
    ],
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  },
}

interface PersonPageProps {
  params: {
    id: string
  }
}

export default function PersonPage({ params }: PersonPageProps) {
  const person = mockPersonData[params.id as keyof typeof mockPersonData]

  if (!person) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              StreamHub
            </Link>
            <div className="flex-1 max-w-2xl mx-8">
              <HeaderSearch />
            </div>
            <div className="w-32"></div> {/* Spacer for balance */}
          </div>
        </div>

        {/* Navigation Menu */}
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

      {/* Cover Image */}
      <div className="relative h-64 md:h-80">
        <Image
          src={person.coverImage || "/placeholder.svg"}
          alt={`${person.name} cover`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Profile Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Profile Image */}
            <div className="relative">
              <Image
                src={person.profileImage || "/placeholder.svg"}
                alt={person.name}
                width={160}
                height={160}
                className="rounded-full border-4 border-white shadow-lg"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 md:pb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white md:text-gray-900 mb-2">{person.name}</h1>
              <p className="text-lg text-gray-200 md:text-gray-600 mb-4">{person.role}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200 md:text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{person.location}</span>
                </div>
                {person.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <a href={person.website} className="hover:underline" target="_blank" rel="noopener noreferrer">
                      Website
                    </a>
                  </div>
                )}
                {person.social.twitter && (
                  <div className="flex items-center gap-1">
                    <Twitter className="w-4 h-4" />
                    <span>{person.social.twitter}</span>
                  </div>
                )}
                {person.social.instagram && (
                  <div className="flex items-center gap-1">
                    <Instagram className="w-4 h-4" />
                    <span>{person.social.instagram}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg text-white md:text-gray-900">{person.stats.videos}</div>
                  <div className="text-gray-200 md:text-gray-600">Videos</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-white md:text-gray-900">{person.stats.totalViews}</div>
                  <div className="text-gray-200 md:text-gray-600">Total Views</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-white md:text-gray-900">{person.stats.followers}</div>
                  <div className="text-gray-200 md:text-gray-600">Followers</div>
                </div>
              </div>
            </div>

            {/* Follow Button */}
            <div className="md:pb-4">
              <Button size="lg">Follow</Button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="about" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="videos">Videos ({person.stats.videos})</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Biography</h3>
                <p className="text-gray-700 leading-relaxed">{person.bio}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {person.videos.map((video) => (
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
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
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

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Eye className="w-3 h-3" />
                      <span>{video.views} views</span>
                      <span>•</span>
                      <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {person.gallery.map((image, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
