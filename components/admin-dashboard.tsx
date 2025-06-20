"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Upload,
  Plus,
  X,
  Video,
  Users,
  Settings,
  Eye,
  Trash2,
  LogOut,
  Shield,
  Grid,
  List,
  BarChart3,
  Tag,
  ImageIcon,
  Key,
} from "lucide-react"
import Link from "next/link"
import ChangePasswordModal from "./change-password-modal"
import SecurityDashboard from "./security-dashboard"

interface VideoData {
  id: string
  title: string
  description: string
  embedCode: string
  embedUrl: string
  previewUrl?: string
  thumbnail?: string
  thumbnailFile?: File
  tags: string[]
  category: string
  people: Array<{ id: string; name: string; role: string }>
  uploadDate: string
  views: string
  likes: string
  duration: string
  source?: string
  originalUrl?: string
}

const VIDEO_CATEGORIES = [
  { id: "entertainment", name: "Entertainment", color: "bg-purple-100 text-purple-700" },
  { id: "education", name: "Education", color: "bg-blue-100 text-blue-700" },
  { id: "music", name: "Music", color: "bg-green-100 text-green-700" },
  { id: "sports", name: "Sports", color: "bg-orange-100 text-orange-700" },
  { id: "gaming", name: "Gaming", color: "bg-red-100 text-red-700" },
  { id: "technology", name: "Technology", color: "bg-indigo-100 text-indigo-700" },
  { id: "lifestyle", name: "Lifestyle", color: "bg-pink-100 text-pink-700" },
  { id: "news", name: "News", color: "bg-gray-100 text-gray-700" },
  { id: "comedy", name: "Comedy", color: "bg-yellow-100 text-yellow-700" },
  { id: "documentary", name: "Documentary", color: "bg-teal-100 text-teal-700" },
  { id: "adult", name: "Adult Content", color: "bg-rose-100 text-rose-700" },
  { id: "other", name: "Other", color: "bg-slate-100 text-slate-700" },
]

// Custom website URL conversion patterns
const CUSTOM_WEBSITE_PATTERNS = [
  {
    name: "Pornhub",
    domain: "pornhub.com",
    patterns: [
      /^https?:\/\/(www\.)?pornhub\.com\/view_video\.php\?viewkey=([a-zA-Z0-9]+)/,
      /^https?:\/\/(www\.)?pornhub\.com\/embed\/([a-zA-Z0-9]+)/,
    ],
    embedTemplate: (id: string) => `https://www.pornhub.com/embed/${id}`,
    example: "https://www.pornhub.com/view_video.php?viewkey=VIDEO_ID",
  },
  {
    name: "XVideos",
    domain: "xvideos.com",
    patterns: [/^https?:\/\/(www\.)?xvideos\.com\/video(\d+)\//, /^https?:\/\/(www\.)?xvideos\.com\/embedframe\/(\d+)/],
    embedTemplate: (id: string) => `https://www.xvideos.com/embedframe/${id}`,
    example: "https://www.xvideos.com/video12345/",
  },
  {
    name: "RedTube",
    domain: "redtube.com",
    patterns: [/^https?:\/\/(www\.)?redtube\.com\/(\d+)/, /^https?:\/\/embed\.redtube\.com\/\?id=(\d+)/],
    embedTemplate: (id: string) => `https://embed.redtube.com/?id=${id}`,
    example: "https://www.redtube.com/12345",
  },
  {
    name: "Xhamster",
    domain: "xhamster.com",
    patterns: [
      /^https?:\/\/(www\.)?xhamster\.com\/videos\/[^/]+-(\d+)/,
      /^https?:\/\/(www\.)?xhamster\.com\/embed\/(\d+)/,
    ],
    embedTemplate: (id: string) => `https://xhamster.com/embed/${id}`,
    example: "https://xhamster.com/videos/video-title-12345",
  },
  {
    name: "SpankBang",
    domain: "spankbang.com",
    patterns: [
      /^https?:\/\/(www\.)?spankbang\.com\/([a-zA-Z0-9]+)\/video\//,
      /^https?:\/\/(www\.)?spankbang\.com\/([a-zA-Z0-9]+)\/embed\//,
    ],
    embedTemplate: (id: string) => `https://spankbang.com/${id}/embed/`,
    example: "https://spankbang.com/VIDEO_ID/video/",
  },
  {
    name: "YouPorn",
    domain: "youporn.com",
    patterns: [/^https?:\/\/(www\.)?youporn\.com\/watch\/(\d+)\//, /^https?:\/\/(www\.)?youporn\.com\/embed\/(\d+)/],
    embedTemplate: (id: string) => `https://www.youporn.com/embed/${id}`,
    example: "https://www.youporn.com/watch/12345/",
  },
  {
    name: "Generic Pattern",
    domain: "custom",
    patterns: [
      // Generic patterns for common URL structures
      /^https?:\/\/([^/]+)\/(?:watch|video|v)\/([a-zA-Z0-9_-]+)/,
      /^https?:\/\/([^/]+)\/(?:watch|video|v)\?(?:v=|id=)([a-zA-Z0-9_-]+)/,
      /^https?:\/\/([^/]+)\/([a-zA-Z0-9_-]+)$/,
    ],
    embedTemplate: (id: string, domain?: string) => {
      if (domain) {
        return `https://${domain}/embed/${id}`
      }
      return id
    },
    example: "https://example.com/watch/VIDEO_ID or https://example.com/video/VIDEO_ID",
  },
]

const VIDEO_SOURCES = [
  {
    id: "youtube",
    name: "YouTube",
    color: "bg-red-500",
    description: "Paste YouTube video or playlist URL",
    placeholder: "https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID",
    patterns: [
      /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /^https?:\/\/(www\.)?youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/,
    ],
    embedTemplate: (id: string, isPlaylist = false) =>
      isPlaylist ? `https://www.youtube.com/embed/videoseries?list=${id}` : `https://www.youtube.com/embed/${id}`,
  },
  {
    id: "vimeo",
    name: "Vimeo",
    color: "bg-blue-500",
    description: "Paste Vimeo video URL",
    placeholder: "https://vimeo.com/VIDEO_ID",
    patterns: [/^https?:\/\/(www\.)?vimeo\.com\/(\d+)/],
    embedTemplate: (id: string) => `https://player.vimeo.com/video/${id}`,
  },
  {
    id: "dailymotion",
    name: "Dailymotion",
    color: "bg-orange-500",
    description: "Paste Dailymotion video URL",
    placeholder: "https://www.dailymotion.com/video/VIDEO_ID",
    patterns: [/^https?:\/\/(www\.)?dailymotion\.com\/video\/([a-zA-Z0-9]+)/],
    embedTemplate: (id: string) => `https://www.dailymotion.com/embed/video/${id}`,
  },
  {
    id: "twitch",
    name: "Twitch",
    color: "bg-purple-500",
    description: "Paste Twitch video or clip URL",
    placeholder: "https://www.twitch.tv/videos/VIDEO_ID or https://clips.twitch.tv/CLIP_ID",
    patterns: [/^https?:\/\/(www\.)?twitch\.tv\/videos\/(\d+)/, /^https?:\/\/clips\.twitch\.tv\/([a-zA-Z0-9_-]+)/],
    embedTemplate: (id: string, isClip = false) =>
      isClip
        ? `https://clips.twitch.tv/embed?clip=${id}&parent=localhost`
        : `https://player.twitch.tv/?video=${id}&parent=localhost`,
  },
  {
    id: "streamable",
    name: "Streamable",
    color: "bg-green-500",
    description: "Paste Streamable video URL",
    placeholder: "https://streamable.com/VIDEO_ID",
    patterns: [/^https?:\/\/(www\.)?streamable\.com\/([a-zA-Z0-9]+)/],
    embedTemplate: (id: string) => `https://streamable.com/e/${id}`,
  },
  {
    id: "wistia",
    name: "Wistia",
    color: "bg-teal-500",
    description: "Paste Wistia video URL",
    placeholder: "https://company.wistia.com/medias/VIDEO_ID",
    patterns: [/^https?:\/\/([a-zA-Z0-9-]+)\.wistia\.com\/medias\/([a-zA-Z0-9]+)/],
    embedTemplate: (id: string) => `https://fast.wistia.net/embed/iframe/${id}`,
  },
  {
    id: "direct",
    name: "Direct Video URL",
    color: "bg-gray-500",
    description: "Direct link to MP4, WebM, or other video files",
    placeholder: "https://example.com/video.mp4",
    patterns: [/^https?:\/\/.+\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv)(\?.*)?$/i],
    embedTemplate: (url: string) => url,
  },
  {
    id: "custom",
    name: "Custom Website",
    color: "bg-indigo-500",
    description: "Paste video URL from any website - we'll convert it to embed format",
    placeholder: "https://example.com/watch/VIDEO_ID or https://example.com/video/12345",
    patterns: [], // Will be populated dynamically
    embedTemplate: (url: string) => url, // Will be handled by custom logic
    isCustom: true,
  },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [adminUser, setAdminUser] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Video management state
  const [uploadedVideos, setUploadedVideos] = useState<VideoData[]>([])
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>([])

  // Video source and URL state
  const [videoSource, setVideoSource] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [embedUrl, setEmbedUrl] = useState("")
  const [urlValidation, setUrlValidation] = useState<{ isValid: boolean; message: string; detectedSite?: string }>({
    isValid: false,
    message: "",
  })

  // Upload form state
  const [embedCode, setEmbedCode] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [videoTitle, setVideoTitle] = useState("")
  const [videoDescription, setVideoDescription] = useState("")
  const [videoCategory, setVideoCategory] = useState("")
  const [videoTags, setVideoTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [taggedPeople, setTaggedPeople] = useState<Array<{ id: string; name: string; role: string }>>([])
  const [personName, setPersonName] = useState("")
  const [personRole, setPersonRole] = useState("")
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [duration, setDuration] = useState("")

  // Branding state
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [currentLogo, setCurrentLogo] = useState<string>("")
  const [siteName, setSiteName] = useState<string>("StreamHub")
  const [logoSize, setLogoSize] = useState<number>(32)

  // Load admin user and videos
  useEffect(() => {
    const authData = localStorage.getItem("adminAuth")
    if (authData) {
      const { username } = JSON.parse(authData)
      setAdminUser(username)
    }

    const savedVideos = localStorage.getItem("uploadedVideos")
    if (savedVideos) {
      const videos = JSON.parse(savedVideos)
      setUploadedVideos(videos)
      setFilteredVideos(videos)
    }

    // Load saved branding settings
    const savedLogo = localStorage.getItem("site-logo")
    if (savedLogo) {
      setCurrentLogo(savedLogo)
      setLogoPreview(savedLogo)
    }

    const savedSiteName = localStorage.getItem("site-name")
    if (savedSiteName) {
      setSiteName(savedSiteName)
    }

    const savedLogoSize = localStorage.getItem("logo-size")
    if (savedLogoSize) {
      setLogoSize(Number.parseInt(savedLogoSize))
    }
  }, [])

  // Filter videos based on search and category
  useEffect(() => {
    let filtered = uploadedVideos

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(query) ||
          video.description.toLowerCase().includes(query) ||
          video.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          video.people.some((person) => person.name.toLowerCase().includes(query)),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((video) => video.category === selectedCategory)
    }

    setFilteredVideos(filtered)
  }, [uploadedVideos, searchQuery, selectedCategory])

  // Custom URL to embed conversion function
  const convertCustomUrlToEmbed = (url: string) => {
    const trimmedUrl = url.trim()

    // Try each custom website pattern
    for (const site of CUSTOM_WEBSITE_PATTERNS) {
      for (const pattern of site.patterns) {
        const match = trimmedUrl.match(pattern)
        if (match) {
          let videoId = ""
          let domain = ""

          if (site.name === "Generic Pattern") {
            // For generic pattern, extract domain and ID
            if (match[1] && match[2]) {
              domain = match[1]
              videoId = match[2]
              return {
                embedUrl: site.embedTemplate(videoId, domain),
                siteName: domain,
                videoId: videoId,
              }
            }
          } else {
            // For specific sites, use the captured group as video ID
            videoId = match[2] || match[1]
            return {
              embedUrl: site.embedTemplate(videoId),
              siteName: site.name,
              videoId: videoId,
            }
          }
        }
      }
    }

    return null
  }

  // Validate video URL when source or URL changes
  useEffect(() => {
    if (!videoSource || !videoUrl.trim()) {
      setUrlValidation({ isValid: false, message: "" })
      setEmbedUrl("")
      return
    }

    const source = VIDEO_SOURCES.find((s) => s.id === videoSource)
    if (!source) return

    const url = videoUrl.trim()

    // Handle custom website conversion
    if (source.id === "custom") {
      const conversion = convertCustomUrlToEmbed(url)

      if (conversion) {
        setEmbedUrl(conversion.embedUrl)
        setUrlValidation({
          isValid: true,
          message: `Valid ${conversion.siteName} URL detected - converted to embed format`,
          detectedSite: conversion.siteName,
        })
      } else {
        setEmbedUrl("")
        setUrlValidation({
          isValid: false,
          message: "URL format not recognized. Please check supported formats below.",
        })
      }
      return
    }

    // Handle other video sources (existing logic)
    let isValid = false
    let extractedId = ""
    let isSpecialCase = false

    // Check if URL matches any of the source patterns
    for (const pattern of source.patterns) {
      const match = url.match(pattern)
      if (match) {
        isValid = true
        if (source.id === "youtube") {
          if (url.includes("playlist")) {
            extractedId = match[2] // playlist ID
            isSpecialCase = true // indicates playlist
          } else {
            extractedId = match[3] // video ID
          }
        } else if (source.id === "twitch") {
          if (url.includes("clips.twitch.tv")) {
            extractedId = match[1] // clip ID
            isSpecialCase = true // indicates clip
          } else {
            extractedId = match[2] // video ID
          }
        } else if (source.id === "direct") {
          extractedId = url // full URL for direct videos
        } else {
          extractedId = match[2] // general case
        }
        break
      }
    }

    if (isValid && extractedId) {
      const generatedEmbedUrl = source.embedTemplate(extractedId, isSpecialCase)
      setEmbedUrl(generatedEmbedUrl)
      setUrlValidation({
        isValid: true,
        message: `Valid ${source.name} URL detected`,
      })
    } else {
      setEmbedUrl("")
      setUrlValidation({
        isValid: false,
        message: `Invalid ${source.name} URL format`,
      })
    }
  }, [videoSource, videoUrl])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/admin/login")
  }

  const extractSrcFromIframe = (iframeCode: string): string => {
    const srcMatch = iframeCode.match(/src=["']([^"']+)["']/i)
    return srcMatch ? srcMatch[1] : ""
  }

  const addTag = () => {
    if (currentTag.trim() && !videoTags.includes(currentTag.trim())) {
      setVideoTags([...videoTags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setVideoTags(videoTags.filter((tag) => tag !== tagToRemove))
  }

  const addPerson = () => {
    if (personName.trim() && personRole.trim()) {
      const newPerson = {
        id: Date.now().toString(),
        name: personName.trim(),
        role: personRole.trim(),
      }
      setTaggedPeople([...taggedPeople, newPerson])
      setPersonName("")
      setPersonRole("")
    }
  }

  const removePerson = (personId: string) => {
    setTaggedPeople(taggedPeople.filter((person) => person.id !== personId))
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearThumbnail = () => {
    setThumbnailFile(null)
    setThumbnailPreview("")
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"]
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image file (PNG, JPEG, or SVG)")
        return
      }

      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
        setCurrentLogo(result)
        localStorage.setItem("site-logo", result)
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event("brandingUpdate"))
      }
      reader.readAsDataURL(file)
    }
  }

  const clearLogo = () => {
    setLogoFile(null)
    setLogoPreview("")
    setCurrentLogo("")
    localStorage.removeItem("site-logo")
    window.dispatchEvent(new Event("brandingUpdate"))
  }

  const handleSiteNameChange = (newName: string) => {
    setSiteName(newName)
    localStorage.setItem("site-name", newName)
    window.dispatchEvent(new Event("brandingUpdate"))
  }

  const handleLogoSizeChange = (newSize: number) => {
    setLogoSize(newSize)
    localStorage.setItem("logo-size", newSize.toString())
    window.dispatchEvent(new Event("brandingUpdate"))
  }

  const resetSiteName = () => {
    setSiteName("StreamHub")
    localStorage.setItem("site-name", "StreamHub")
    window.dispatchEvent(new Event("brandingUpdate"))
  }

  const resetToDefaultLogo = () => {
    setLogoFile(null)
    setLogoPreview("")
    setCurrentLogo("")
    localStorage.removeItem("site-logo")
    window.dispatchEvent(new Event("brandingUpdate"))
  }

  const handleVideoUpload = (e: React.FormEvent) => {
    e.preventDefault()

    if (!videoSource || !videoUrl.trim() || !videoTitle.trim() || !videoCategory) {
      alert("Please fill in all required fields")
      return
    }

    if (!urlValidation.isValid || !embedUrl) {
      alert("Please provide a valid video URL for the selected source")
      return
    }

    const newVideo: VideoData = {
      id: Date.now().toString(),
      title: videoTitle.trim(),
      description: videoDescription.trim(),
      embedCode: `<iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`,
      embedUrl: embedUrl,
      previewUrl: videoSource === "direct" ? embedUrl : undefined,
      thumbnail: thumbnailPreview || "/placeholder.svg?height=400&width=700",
      thumbnailFile: thumbnailFile || undefined,
      tags: videoTags,
      category: videoCategory,
      people: taggedPeople,
      uploadDate: new Date().toISOString(),
      views: "0",
      likes: "0",
      duration: duration || "0:00",
      source: videoSource,
      originalUrl: videoUrl.trim(),
    }

    const updatedVideos = [newVideo, ...uploadedVideos]
    setUploadedVideos(updatedVideos)
    localStorage.setItem("uploadedVideos", JSON.stringify(updatedVideos))

    // Reset form
    setVideoTitle("")
    setVideoDescription("")
    setVideoSource("")
    setVideoUrl("")
    setEmbedUrl("")
    setPreviewUrl("")
    setVideoCategory("")
    setVideoTags([])
    setTaggedPeople([])
    setDuration("")
    setUrlValidation({ isValid: false, message: "" })
    clearThumbnail()

    alert(`Video "${newVideo.title}" uploaded successfully!`)
  }

  const deleteVideo = (videoId: string) => {
    if (confirm("Are you sure you want to delete this video?")) {
      const updatedVideos = uploadedVideos.filter((v) => v.id !== videoId)
      setUploadedVideos(updatedVideos)
      localStorage.setItem("uploadedVideos", JSON.stringify(updatedVideos))
    }
  }

  const getCategoryStats = () => {
    const stats = VIDEO_CATEGORIES.map((category) => ({
      ...category,
      count: uploadedVideos.filter((video) => video.category === category.id).length,
    }))
    return stats
  }

  const getCategoryColor = (categoryId: string) => {
    const category = VIDEO_CATEGORIES.find((cat) => cat.id === categoryId)
    return category?.color || "bg-gray-100 text-gray-700"
  }

  const getCategoryName = (categoryId: string) => {
    const category = VIDEO_CATEGORIES.find((cat) => cat.id === categoryId)
    return category?.name || "Unknown"
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Modern Admin Header */}
      <header className="modern-header sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Admin Badge */}
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                {currentLogo ? (
                  <img
                    src={currentLogo || "/placeholder.svg"}
                    alt="Site Logo"
                    className="object-contain"
                    style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
                  />
                ) : (
                  <div
                    className="bg-red-600 rounded flex items-center justify-center"
                    style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
                  >
                    <span className="text-white font-bold" style={{ fontSize: `${logoSize * 0.6}px` }}>
                      S
                    </span>
                  </div>
                )}
                {siteName && <span className="text-xl font-semibold text-white">{siteName}</span>}
              </Link>
              <div className="bg-green-500 text-white border border-green-400 font-bold shadow-lg flex items-center px-2 py-1 rounded-md text-xs">
                <Shield className="w-3 h-3 mr-1" />
                ADMIN
              </div>
            </div>

            {/* Admin Controls */}
            <div className="flex items-center gap-4">
              <Link href="/" className="text-zinc-400 hover:text-white text-sm hover:underline">
                View Site
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 bg-zinc-950">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Admin Dashboard</h1>
          <p className="text-zinc-400">Manage your video content and platform settings</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 bg-zinc-900 p-1 rounded-xl">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-300 data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg"
            >
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-300 data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg"
            >
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger
              value="videos"
              className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-300 data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg"
            >
              <Video className="w-4 h-4" />
              Videos ({uploadedVideos.length})
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-300 data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg"
            >
              <Tag className="w-4 h-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger
              value="branding"
              className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-300 data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg"
            >
              <ImageIcon className="w-4 h-4" />
              Branding
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-300 data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg"
            >
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-400 mb-1">Total Videos</p>
                    <p className="text-2xl font-semibold text-white">{uploadedVideos.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Video className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-400 mb-1">Categories</p>
                    <p className="text-2xl font-semibold text-white">{VIDEO_CATEGORIES.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Tag className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-400 mb-1">Total Views</p>
                    <p className="text-2xl font-semibold text-white">
                      {uploadedVideos
                        .reduce((total, video) => {
                          const views = Number.parseInt(video.views.replace(/[^\d]/g, "")) || 0
                          return total + views
                        }, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Eye className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-400 mb-1">People Tagged</p>
                    <p className="text-2xl font-semibold text-white">
                      {uploadedVideos.reduce((total, video) => total + video.people.length, 0)}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Category Statistics */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getCategoryStats().map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-4 bg-zinc-800 border border-zinc-700 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${category.color.split(" ")[0]}`}></div>
                        <span className="font-medium text-white">{category.name}</span>
                      </div>
                      <Badge className="bg-zinc-800 text-zinc-400 border border-zinc-600">{category.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">Upload New Video</CardTitle>
                <p className="text-sm text-zinc-400">Add new video content with proper categorization</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVideoUpload} className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-zinc-400">
                      Category *
                    </Label>
                    <Select value={videoCategory} onValueChange={setVideoCategory} required>
                      <SelectTrigger className="mt-2 bg-zinc-800 border border-zinc-700 text-white">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border border-zinc-700 text-white">
                        {VIDEO_CATEGORIES.map((category) => (
                          <SelectItem key={category.id} value={category.id} className="text-white">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${category.color.split(" ")[0]}`}></div>
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Video Source Selection */}
                  <div>
                    <Label htmlFor="video-source" className="text-sm font-medium text-zinc-400">
                      Import From *
                    </Label>
                    <Select value={videoSource} onValueChange={setVideoSource} required>
                      <SelectTrigger className="mt-2 bg-zinc-800 border border-zinc-700 text-white">
                        <SelectValue placeholder="Select video source" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border border-zinc-700 text-white">
                        {VIDEO_SOURCES.map((source) => (
                          <SelectItem key={source.id} value={source.id} className="text-white">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${source.color}`}></div>
                              {source.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {videoSource && (
                      <p className="text-xs text-zinc-500 mt-1">
                        {VIDEO_SOURCES.find((s) => s.id === videoSource)?.description}
                      </p>
                    )}
                  </div>

                  {/* Video URL Input */}
                  <div>
                    <Label htmlFor="video-url" className="text-sm font-medium text-zinc-400">
                      Video URL *
                    </Label>
                    <div className="mt-2 space-y-2">
                      <Input
                        id="video-url"
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder={
                          videoSource
                            ? VIDEO_SOURCES.find((s) => s.id === videoSource)?.placeholder
                            : "Select a source first"
                        }
                        className="bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-400"
                        required
                        disabled={!videoSource}
                      />
                      {urlValidation.message && (
                        <div
                          className={`text-xs ${urlValidation.isValid ? "text-green-400" : "text-red-400"} flex items-center gap-1`}
                        >
                          {urlValidation.isValid ? "✓" : "✗"} {urlValidation.message}
                        </div>
                      )}
                    </div>

                    {/* Custom Website Supported Formats */}
                    {videoSource === "custom" && (
                      <div className="mt-3 p-4 bg-indigo-900/20 border border-indigo-800 rounded-lg">
                        <h4 className="font-medium text-indigo-300 text-sm mb-2">Supported Website Formats:</h4>
                        <div className="space-y-2 text-xs text-indigo-200">
                          {CUSTOM_WEBSITE_PATTERNS.slice(0, -1).map((site, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="font-medium">{site.name}:</span>
                              <code className="bg-indigo-800/30 px-2 py-1 rounded text-xs">{site.example}</code>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-indigo-700">
                            <span className="font-medium">Generic Pattern:</span>
                            <div className="text-xs mt-1 space-y-1">
                              <div>• https://example.com/watch/VIDEO_ID</div>
                              <div>• https://example.com/video/VIDEO_ID</div>
                              <div>• https://example.com/v?id=VIDEO_ID</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Video Preview */}
                  {embedUrl && urlValidation.isValid && (
                    <div>
                      <Label className="text-sm font-medium text-zinc-400">Video Preview</Label>
                      <div className="mt-2 bg-zinc-800 border border-zinc-700 rounded-xl p-4">
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                          <iframe
                            src={embedUrl}
                            className="w-full h-full"
                            frameBorder="0"
                            allowFullScreen
                            title="Video preview"
                          />
                        </div>
                        <div className="mt-2 text-xs text-zinc-400 flex justify-between">
                          <span>
                            Source:{" "}
                            {urlValidation.detectedSite || VIDEO_SOURCES.find((s) => s.id === videoSource)?.name}
                          </span>
                          <span>Embed URL: {embedUrl}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Video Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="title" className="text-sm font-medium text-zinc-400">
                        Video Title *
                      </Label>
                      <Input
                        id="title"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="Enter video title"
                        className="mt-2 bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-400"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="description" className="text-sm font-medium text-zinc-400">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        placeholder="Describe the video content..."
                        className="mt-2 bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-400"
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="duration" className="text-sm font-medium text-zinc-400">
                        Duration
                      </Label>
                      <Input
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="e.g., 15:30"
                        className="mt-2 bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="preview-url" className="text-sm font-medium text-zinc-400">
                        Direct Video URL (Optional)
                      </Label>
                      <Input
                        id="preview-url"
                        type="url"
                        value={previewUrl}
                        onChange={(e) => setPreviewUrl(e.target.value)}
                        placeholder="https://example.com/video.mp4"
                        className="mt-2 bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-400"
                      />
                    </div>

                    {/* Tags */}
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-zinc-400">Tags</Label>
                      <div className="mt-2 space-y-3">
                        <div className="flex gap-2">
                          <Input
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            placeholder="Add a tag"
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                            className="bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-400"
                          />
                          <Button
                            type="button"
                            onClick={addTag}
                            className="bg-zinc-700 text-white hover:bg-zinc-600 px-4"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {videoTags.map((tag) => (
                            <Badge
                              key={tag}
                              className="bg-zinc-800 text-zinc-300 border border-zinc-600 flex items-center gap-1 pr-1"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:text-red-400 p-0.5 rounded-sm hover:bg-red-900/20"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Tagged People */}
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-zinc-400">Tagged People</Label>
                      <div className="mt-2 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <Input
                            value={personName}
                            onChange={(e) => setPersonName(e.target.value)}
                            placeholder="Person name"
                            className="bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-400"
                          />
                          <Input
                            value={personRole}
                            onChange={(e) => setPersonRole(e.target.value)}
                            placeholder="Role"
                            className="bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-400"
                          />
                          <Button
                            type="button"
                            onClick={addPerson}
                            className="bg-zinc-700 text-white hover:bg-zinc-600"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Person
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {taggedPeople.map((person) => (
                            <div
                              key={person.id}
                              className="flex items-center justify-between bg-zinc-800 border border-zinc-700 p-3 rounded-xl"
                            >
                              <div>
                                <span className="font-medium text-white">{person.name}</span>
                                <span className="text-zinc-400 ml-2">({person.role})</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removePerson(person.id)}
                                className="text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-red-900/20"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail Upload */}
                  <div>
                    <Label className="text-sm font-medium text-zinc-400">Custom Thumbnail</Label>
                    <div className="mt-2 space-y-4">
                      {thumbnailPreview ? (
                        <div className="relative inline-block">
                          <img
                            src={thumbnailPreview || "/placeholder.svg"}
                            alt="Thumbnail preview"
                            width={300}
                            height={200}
                            className="rounded-xl object-cover border border-zinc-600"
                          />
                          <Button
                            type="button"
                            onClick={clearThumbnail}
                            className="absolute top-2 right-2 p-1 h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                            size="sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="border-2 border-dashed border-zinc-600 rounded-xl p-8 text-center hover:border-zinc-500 transition-colors cursor-pointer bg-zinc-800"
                          onClick={() => document.getElementById("thumbnail-input")?.click()}
                        >
                          <Upload className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
                          <div className="text-sm text-zinc-400">
                            <span className="text-blue-400 hover:text-blue-300 font-medium">Click to upload</span>
                            {" or drag and drop"}
                          </div>
                          <p className="text-xs text-zinc-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      )}
                      <input
                        id="thumbnail-input"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 h-11" size="lg">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Video
                  </Button>
                </form>
              </CardContent>
            </div>
          </TabsContent>

          {/* Videos Management Tab */}
          <TabsContent value="videos">
            <div className="space-y-6">
              {/* Filters and View Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-3">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48 bg-zinc-800 border border-zinc-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border border-zinc-700 text-white">
                      <SelectItem value="all" className="text-white">
                        All Categories
                      </SelectItem>
                      {VIDEO_CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="text-white">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${category.color.split(" ")[0]}`}></div>
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-zinc-800 text-white hover:bg-zinc-700 border-zinc-600"
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  >
                    {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="text-sm text-zinc-400">
                  Showing {filteredVideos.length} of {uploadedVideos.length} videos
                </div>
              </div>

              {/* Videos Display */}
              {filteredVideos.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
                  <div className="text-center py-12 px-6">
                    <Video className="w-16 h-16 mx-auto mb-4 text-zinc-400" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      {uploadedVideos.length === 0 ? "No videos uploaded yet" : "No videos match your search"}
                    </h3>
                    <p className="text-zinc-400 mb-4">
                      {uploadedVideos.length === 0
                        ? "Upload your first video to get started"
                        : "Try adjusting your search or category filter"}
                    </p>
                  </div>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideos.map((video) => (
                    <div key={video.id} className="overflow-hidden group bg-zinc-900 border border-zinc-800 rounded-xl">
                      <div className="relative aspect-video">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className={`${getCategoryColor(video.category)} text-xs`}>
                            {getCategoryName(video.category)}
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-white mb-2 line-clamp-2">{video.title}</h3>
                        <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{video.description}</p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {video.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} className="bg-zinc-800 text-zinc-400 border border-zinc-600 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex justify-between items-center text-xs text-zinc-400 mb-4">
                          <span>{video.views} views</span>
                          <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            href={`/video/${video.id}`}
                            className="flex-1 inline-flex items-center justify-center gap-1 text-blue-400 hover:text-blue-300 text-sm py-2 px-3 border border-blue-600 rounded-lg hover:bg-blue-900/20 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                          <button
                            onClick={() => deleteVideo(video.id)}
                            className="inline-flex items-center justify-center gap-1 text-red-400 hover:text-red-300 text-sm py-2 px-3 border border-red-600 rounded-lg hover:bg-red-900/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredVideos.map((video) => (
                    <div key={video.id} className="bg-zinc-900 border border-zinc-800 rounded-xl">
                      <div className="p-6">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <img
                              src={video.thumbnail || "/placeholder.svg"}
                              alt={video.title}
                              width={200}
                              height={120}
                              className="rounded-lg object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-white">{video.title}</h3>
                                <Badge className={`${getCategoryColor(video.category)} text-xs`}>
                                  {getCategoryName(video.category)}
                                </Badge>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Link
                                  href={`/video/${video.id}`}
                                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </Link>
                                <button
                                  onClick={() => deleteVideo(video.id)}
                                  className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 text-sm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </div>

                            <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{video.description}</p>

                            <div className="flex flex-wrap gap-1 mb-3">
                              {video.tags.map((tag) => (
                                <Badge key={tag} className="bg-zinc-800 text-zinc-400 border border-zinc-600 text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-zinc-400">
                              <div>
                                <span className="font-medium">Duration:</span> {video.duration}
                              </div>
                              <div>
                                <span className="font-medium">Views:</span> {video.views}
                              </div>
                              <div>
                                <span className="font-medium">People:</span> {video.people.length}
                              </div>
                              <div>
                                <span className="font-medium">Uploaded:</span>{" "}
                                {new Date(video.uploadDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding">
            <div className="space-y-6">
              {/* Site Name Section */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">Site Name</CardTitle>
                  <p className="text-sm text-zinc-400">Customize your site's name that appears in the header</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-zinc-800 rounded-xl border border-zinc-700">
                      <div className="text-sm text-zinc-400">Current Name:</div>
                      <span className="text-sm text-zinc-300 font-medium">{siteName || "No name set"}</span>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="site-name" className="text-sm font-medium text-zinc-400">
                        Site Name
                      </Label>
                      <div className="flex gap-3">
                        <Input
                          id="site-name"
                          value={siteName}
                          onChange={(e) => handleSiteNameChange(e.target.value)}
                          placeholder="Enter site name (leave empty to hide)"
                          className="bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-400"
                        />
                        <Button
                          type="button"
                          onClick={resetSiteName}
                          variant="outline"
                          className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-600"
                        >
                          Reset
                        </Button>
                      </div>
                      <p className="text-xs text-zinc-500">Leave empty to hide the site name completely</p>
                    </div>
                  </div>
                </CardContent>
              </div>

              {/* Logo Section */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">Site Logo</CardTitle>
                  <p className="text-sm text-zinc-400">Customize your site's logo and its size</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Logo Size Control */}
                    <div>
                      <Label className="text-sm font-medium text-zinc-400">Logo Size</Label>
                      <div className="mt-2 space-y-3">
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="16"
                            max="64"
                            value={logoSize}
                            onChange={(e) => handleLogoSizeChange(Number.parseInt(e.target.value))}
                            className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="text-sm text-zinc-300 min-w-[60px]">{logoSize}px</div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={() => handleLogoSizeChange(24)}
                            variant="outline"
                            size="sm"
                            className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-600 text-xs"
                          >
                            Small (24px)
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleLogoSizeChange(32)}
                            variant="outline"
                            size="sm"
                            className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-600 text-xs"
                          >
                            Medium (32px)
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleLogoSizeChange(48)}
                            variant="outline"
                            size="sm"
                            className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-600 text-xs"
                          >
                            Large (48px)
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Current Logo Preview */}
                    <div className="flex items-center gap-4 p-4 bg-zinc-800 rounded-xl border border-zinc-700">
                      <div className="text-sm text-zinc-400">Current Logo:</div>
                      {currentLogo ? (
                        <img
                          src={currentLogo || "/placeholder.svg"}
                          alt="Current Logo"
                          className="object-contain bg-white rounded p-1"
                          style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
                        />
                      ) : (
                        <div
                          className="bg-red-600 rounded flex items-center justify-center"
                          style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
                        >
                          <span className="text-white font-bold" style={{ fontSize: `${logoSize * 0.6}px` }}>
                            S
                          </span>
                        </div>
                      )}
                      <span className="text-sm text-zinc-300">{currentLogo ? "Custom Logo" : "Default Logo"}</span>
                    </div>

                    {/* Logo Upload Area */}
                    {logoPreview ? (
                      <div className="relative inline-block">
                        <img
                          src={logoPreview || "/placeholder.svg"}
                          alt="Logo preview"
                          className="object-contain bg-white rounded-xl border border-zinc-600 p-2"
                          style={{
                            width: `${Math.max(logoSize * 2, 128)}px`,
                            height: `${Math.max(logoSize * 2, 128)}px`,
                          }}
                        />
                        <Button
                          type="button"
                          onClick={clearLogo}
                          className="absolute top-2 right-2 p-1 h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed border-zinc-600 rounded-xl p-8 text-center hover:border-zinc-500 transition-colors cursor-pointer bg-zinc-800"
                        onClick={() => document.getElementById("logo-input")?.click()}
                      >
                        <Upload className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
                        <div className="text-sm text-zinc-400">
                          <span className="text-blue-400 hover:text-blue-300 font-medium">Click to upload logo</span>
                          {" or drag and drop"}
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">PNG, JPEG, SVG up to 5MB</p>
                      </div>
                    )}

                    <input
                      id="logo-input"
                      type="file"
                      className="hidden"
                      accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                      onChange={handleLogoChange}
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        onClick={() => document.getElementById("logo-input")?.click()}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New Logo
                      </Button>

                      {currentLogo && (
                        <Button
                          type="button"
                          onClick={resetToDefaultLogo}
                          variant="outline"
                          className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-600"
                        >
                          Reset to Default
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>

              {/* Logo Guidelines */}
              <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-xl">
                <h4 className="font-medium text-blue-300 mb-2">Branding Guidelines</h4>
                <ul className="text-sm text-blue-200 space-y-1">
                  <li>• Logo size can be adjusted from 16px to 64px</li>
                  <li>• Site name can be edited or completely hidden</li>
                  <li>• Supported formats: PNG, JPEG, SVG</li>
                  <li>• Maximum file size: 5MB</li>
                  <li>• Square logos work best for consistent sizing</li>
                  <li>• Transparent backgrounds recommended for PNG files</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">Video Categories</CardTitle>
                <p className="text-sm text-zinc-400">Manage and organize video content by categories</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getCategoryStats().map((category) => (
                    <div key={category.id} className="p-4 bg-zinc-800 border border-zinc-700 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${category.color.split(" ")[0]}`}></div>
                          <h3 className="font-medium text-white">{category.name}</h3>
                        </div>
                        <Badge className="bg-zinc-700 text-zinc-300 border border-zinc-600">
                          {category.count} videos
                        </Badge>
                      </div>
                      <div className="text-sm text-zinc-400">
                        Category ID:{" "}
                        <code className="bg-zinc-700 text-zinc-300 border border-zinc-600 px-2 py-1 rounded text-xs">
                          {category.id}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">Admin Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-amber-900/20 border border-amber-800 rounded-xl">
                      <h4 className="font-medium text-amber-300 mb-2">Security Notice</h4>
                      <p className="text-sm text-amber-200">
                        This admin panel is protected by authentication. Session expires after 24 hours.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-white mb-3">Security Settings</h4>
                      <div className="space-y-3">
                        <ChangePasswordModal
                          trigger={
                            <Button className="bg-blue-600 text-white hover:bg-blue-700">
                              <Key className="w-4 h-4 mr-2" />
                              Change Password
                            </Button>
                          }
                        />
                        <div className="text-sm text-zinc-400 space-y-2">
                          <div className="flex justify-between">
                            <span>Session Status:</span>
                            <span className="font-medium text-green-400">Active</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Login Time:</span>
                            <span className="font-medium">{new Date().toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-white mb-3">System Stats</h4>
                        <div className="text-sm text-zinc-400 space-y-2">
                          <div className="flex justify-between">
                            <span>Total Videos:</span>
                            <span className="font-medium">{uploadedVideos.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Categories:</span>
                            <span className="font-medium">{VIDEO_CATEGORIES.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Storage:</span>
                            <span className="font-medium">LocalStorage</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-700">
                      <Button onClick={handleLogout} className="bg-red-600 text-white hover:bg-red-700">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout from Admin Panel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>

              {/* Security Dashboard */}
              <SecurityDashboard />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
