"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Upload,
  Plus,
  X,
  Video,
  Edit,
  Trash2,
  Search,
  Grid,
  List,
  Play,
  Save,
  CheckCircle,
  Clock,
  Eye,
  Heart,
} from "lucide-react"
import Image from "next/image"

interface VideoData {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  thumbnailFile?: File
  videoFile?: File
  tags: string[]
  category: string
  people: Array<{ id: string; name: string; role: string }>
  uploadDate: string
  lastModified: string
  views: number
  likes: number
  duration: string
  fileSize: string
  resolution: string
  format: string
  status: "active" | "draft" | "archived"
}

const VIDEO_CATEGORIES = [
  { id: "entertainment", name: "Entertainment", color: "bg-purple-500" },
  { id: "education", name: "Education", color: "bg-blue-500" },
  { id: "music", name: "Music", color: "bg-green-500" },
  { id: "sports", name: "Sports", color: "bg-orange-500" },
  { id: "gaming", name: "Gaming", color: "bg-red-500" },
  { id: "technology", name: "Technology", color: "bg-indigo-500" },
  { id: "lifestyle", name: "Lifestyle", color: "bg-pink-500" },
  { id: "news", name: "News", color: "bg-gray-500" },
  { id: "comedy", name: "Comedy", color: "bg-yellow-500" },
  { id: "documentary", name: "Documentary", color: "bg-teal-500" },
  { id: "adult", name: "Adult Content", color: "bg-rose-600" },
  { id: "other", name: "Other", color: "bg-slate-500" },
]

export default function VideoCRUD() {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<VideoData | null>(null)

  // Form state
  const [formData, setFormData] = useState<Partial<VideoData>>({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    tags: [],
    category: "",
    people: [],
    duration: "",
    fileSize: "",
    resolution: "",
    format: "",
    status: "active",
  })
  const [currentTag, setCurrentTag] = useState("")
  const [personName, setPersonName] = useState("")
  const [personRole, setPersonRole] = useState("")
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoFileRef = useRef<File | null>(null)

  // Load videos from localStorage
  useEffect(() => {
    const savedVideos = localStorage.getItem("videoCRUD")
    if (savedVideos) {
      const parsedVideos = JSON.parse(savedVideos)
      setVideos(parsedVideos)
      setFilteredVideos(parsedVideos)
    }
  }, [])

  // Save videos to localStorage
  useEffect(() => {
    localStorage.setItem("videoCRUD", JSON.stringify(videos))
  }, [videos])

  // Filter videos
  useEffect(() => {
    let filtered = videos

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

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((video) => video.status === selectedStatus)
    }

    setFilteredVideos(filtered)
  }, [videos, searchQuery, selectedCategory, selectedStatus])

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      tags: [],
      category: "",
      people: [],
      duration: "",
      fileSize: "",
      resolution: "",
      format: "",
      status: "active",
    })
    setCurrentTag("")
    setPersonName("")
    setPersonRole("")
    setThumbnailFile(null)
    setThumbnailPreview("")
    videoFileRef.current = null
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setThumbnailPreview(result)
        setFormData((prev) => ({ ...prev, thumbnailUrl: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags?.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), currentTag.trim()],
      }))
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }))
  }

  const addPerson = () => {
    if (personName.trim() && personRole.trim()) {
      const newPerson = {
        id: Date.now().toString(),
        name: personName.trim(),
        role: personRole.trim(),
      }
      setFormData((prev) => ({
        ...prev,
        people: [...(prev.people || []), newPerson],
      }))
      setPersonName("")
      setPersonRole("")
    }
  }

  const removePerson = (personId: string) => {
    setFormData((prev) => ({
      ...prev,
      people: prev.people?.filter((person) => person.id !== personId) || [],
    }))
  }

  const createVideo = () => {
    const videoFile = videoFileRef.current
    if (!formData.title || !videoFile || !formData.category) {
      alert("Please fill in all required fields and select a video file")
      return
    }

    // In a real implementation, you would upload the video file to your storage service
    // For now, we'll use the object URL (this is just for demo purposes)
    const videoUrl = formData.videoUrl || URL.createObjectURL(videoFile)

    const newVideo: VideoData = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description || "",
      videoUrl: videoUrl,
      thumbnailUrl: formData.thumbnailUrl || "/placeholder.svg?height=400&width=700",
      thumbnailFile: thumbnailFile || undefined,
      videoFile: videoFile, // Store reference to video file
      tags: formData.tags || [],
      category: formData.category,
      people: formData.people || [],
      uploadDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      views: 0,
      likes: 0,
      duration: formData.duration || "0:00",
      fileSize: formData.fileSize || "Unknown",
      resolution: formData.resolution || "Unknown",
      format: formData.format || "Unknown",
      status: formData.status as "active" | "draft" | "archived",
    }

    setVideos((prev) => [newVideo, ...prev])
    setIsCreateModalOpen(false)
    resetForm()
  }

  const updateVideo = () => {
    const videoFile = videoFileRef.current
    if (!editingVideo || !formData.title || !formData.videoUrl || !formData.category) {
      alert("Please fill in all required fields")
      return
    }

    const updatedVideo: VideoData = {
      ...editingVideo,
      title: formData.title,
      description: formData.description || "",
      videoUrl: formData.videoUrl,
      thumbnailUrl: formData.thumbnailUrl || editingVideo.thumbnailUrl,
      thumbnailFile: thumbnailFile || editingVideo.thumbnailFile,
      tags: formData.tags || [],
      category: formData.category,
      people: formData.people || [],
      lastModified: new Date().toISOString(),
      duration: formData.duration || editingVideo.duration,
      fileSize: formData.fileSize || editingVideo.fileSize,
      resolution: formData.resolution || editingVideo.resolution,
      format: formData.format || editingVideo.format,
      status: formData.status as "active" | "draft" | "archived",
    }

    setVideos((prev) => prev.map((video) => (video.id === editingVideo.id ? updatedVideo : video)))
    setIsEditModalOpen(false)
    setEditingVideo(null)
    resetForm()
  }

  const deleteVideo = (videoId: string) => {
    if (confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
      setVideos((prev) => prev.filter((video) => video.id !== videoId))
    }
  }

  const openEditModal = (video: VideoData) => {
    setEditingVideo(video)
    setFormData({
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      tags: video.tags,
      category: video.category,
      people: video.people,
      duration: video.duration,
      fileSize: video.fileSize,
      resolution: video.resolution,
      format: video.format,
      status: video.status,
    })
    setThumbnailPreview(video.thumbnailUrl)
    setIsEditModalOpen(true)
  }

  const getCategoryColor = (categoryId: string) => {
    const category = VIDEO_CATEGORIES.find((cat) => cat.id === categoryId)
    return category?.color || "bg-gray-500"
  }

  const getCategoryName = (categoryId: string) => {
    const category = VIDEO_CATEGORIES.find((cat) => cat.id === categoryId)
    return category?.name || "Unknown"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "draft":
        return "bg-yellow-500"
      case "archived":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const VideoForm = ({ isEdit = false }: { isEdit?: boolean }) => {
    const [videoPreview, setVideoPreview] = useState<string>("")
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [isUploading, setIsUploading] = useState(false)
    const videoInputRef = useRef<HTMLInputElement>(null)

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        // Validate file type
        const validTypes = ["video/mp4", "video/webm", "video/ogg", "video/avi", "video/mov", "video/wmv"]
        if (!validTypes.includes(file.type)) {
          alert("Please select a valid video file (MP4, WebM, OGG, AVI, MOV, WMV)")
          return
        }

        // Validate file size (max 500MB for example)
        const maxSize = 500 * 1024 * 1024 // 500MB
        if (file.size > maxSize) {
          alert("File size must be less than 500MB")
          return
        }

        videoFileRef.current = file

        // Create preview URL
        const videoUrl = URL.createObjectURL(file)
        setVideoPreview(videoUrl)

        // Auto-fill some metadata
        setFormData((prev) => ({
          ...prev,
          videoUrl: videoUrl,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          format: file.type.split("/")[1].toUpperCase(),
        }))

        // Get video duration and resolution
        const video = document.createElement("video")
        video.preload = "metadata"
        video.onloadedmetadata = () => {
          const duration = Math.floor(video.duration)
          const minutes = Math.floor(duration / 60)
          const seconds = duration % 60

          setFormData((prev) => ({
            ...prev,
            duration: `${minutes}:${seconds.toString().padStart(2, "0")}`,
            resolution: `${video.videoWidth}x${video.videoHeight}`,
          }))

          URL.revokeObjectURL(video.src)
        }
        video.src = videoUrl
      }
    }

    const simulateUpload = () => {
      setIsUploading(true)
      setUploadProgress(0)

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsUploading(false)
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 200)
    }

    return (
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Video Upload Section */}
        <div>
          <Label>Video File *</Label>
          <div className="mt-2 space-y-4">
            {videoPreview ? (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full max-w-md rounded-lg"
                    style={{ maxHeight: "300px" }}
                  >
                    Your browser does not support the video tag.
                  </video>
                  <Button
                    type="button"
                    onClick={() => {
                      videoFileRef.current = null
                      setVideoPreview("")
                      setFormData((prev) => ({
                        ...prev,
                        videoUrl: "",
                        fileSize: "",
                        format: "",
                        duration: "",
                        resolution: "",
                      }))
                      if (videoInputRef.current) {
                        videoInputRef.current.value = ""
                      }
                    }}
                    className="absolute top-2 right-2 p-1 h-8 w-8"
                    variant="destructive"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {videoFileRef.current && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">File Information:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <strong>Name:</strong> {videoFileRef.current.name}
                      </div>
                      <div>
                        <strong>Size:</strong> {(videoFileRef.current.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                      <div>
                        <strong>Type:</strong> {videoFileRef.current.type}
                      </div>
                      <div>
                        <strong>Last Modified:</strong>{" "}
                        {new Date(videoFileRef.current.lastModified).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => videoInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <span className="text-blue-600 hover:text-blue-500 font-medium">Click to upload video</span>
                  {" or drag and drop"}
                </div>
                <p className="text-xs text-gray-500 mt-2">MP4, WebM, OGG, AVI, MOV, WMV up to 500MB</p>
              </div>
            )}
            <input ref={videoInputRef} type="file" className="hidden" accept="video/*" onChange={handleVideoChange} />
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Video Title *</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter video title"
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the video content..."
              className="mt-2"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category || ""}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {VIDEO_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || "active"}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div>
          <Label>Thumbnail</Label>
          <div className="mt-2 space-y-4">
            {thumbnailPreview ? (
              <div className="relative inline-block">
                <Image
                  src={thumbnailPreview || "/placeholder.svg"}
                  alt="Thumbnail preview"
                  width={300}
                  height={200}
                  className="rounded-lg object-cover"
                />
                <Button
                  type="button"
                  onClick={() => {
                    setThumbnailFile(null)
                    setThumbnailPreview("")
                    setFormData((prev) => ({ ...prev, thumbnailUrl: "" }))
                  }}
                  className="absolute top-2 right-2 p-1 h-8 w-8"
                  variant="destructive"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <span className="text-blue-600 hover:text-blue-500 font-medium">Upload thumbnail</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (videoFileRef.current) {
                      // Generate thumbnail from video
                      const video = document.createElement("video")
                      const canvas = document.createElement("canvas")
                      const ctx = canvas.getContext("2d")

                      video.onloadeddata = () => {
                        canvas.width = video.videoWidth
                        canvas.height = video.videoHeight
                        video.currentTime = Math.min(5, video.duration / 2) // 5 seconds or middle of video
                      }

                      video.onseeked = () => {
                        if (ctx) {
                          ctx.drawImage(video, 0, 0)
                          canvas.toBlob(
                            (blob) => {
                              if (blob) {
                                const thumbnailUrl = URL.createObjectURL(blob)
                                setThumbnailPreview(thumbnailUrl)
                                setFormData((prev) => ({ ...prev, thumbnailUrl }))
                              }
                            },
                            "image/jpeg",
                            0.8,
                          )
                        }
                      }

                      video.src = videoPreview
                    }
                  }}
                  disabled={!videoFileRef.current}
                  className="h-full"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Generate from Video
                </Button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleThumbnailChange}
            />
          </div>
        </div>

        {/* Auto-filled Video Details (Read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={formData.duration || ""}
              placeholder="Auto-detected"
              className="mt-2 bg-gray-50"
              readOnly
            />
          </div>

          <div>
            <Label htmlFor="fileSize">File Size</Label>
            <Input
              id="fileSize"
              value={formData.fileSize || ""}
              placeholder="Auto-detected"
              className="mt-2 bg-gray-50"
              readOnly
            />
          </div>

          <div>
            <Label htmlFor="resolution">Resolution</Label>
            <Input
              id="resolution"
              value={formData.resolution || ""}
              placeholder="Auto-detected"
              className="mt-2 bg-gray-50"
              readOnly
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <Label>Tags</Label>
          <div className="mt-2 space-y-2">
            <div className="flex gap-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Tagged People */}
        <div>
          <Label>Tagged People</Label>
          <div className="mt-2 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input value={personName} onChange={(e) => setPersonName(e.target.value)} placeholder="Person name" />
              <Input value={personRole} onChange={(e) => setPersonRole(e.target.value)} placeholder="Role" />
              <Button type="button" onClick={addPerson}>
                <Plus className="w-4 h-4 mr-2" />
                Add Person
              </Button>
            </div>
            <div className="space-y-2">
              {formData.people?.map((person) => (
                <div key={person.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <span className="font-medium">{person.name}</span>
                    <span className="text-gray-600 ml-2">({person.role})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePerson(person.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            onClick={() => {
              if (videoFileRef.current && !isUploading) {
                simulateUpload()
                setTimeout(() => {
                  isEdit ? updateVideo() : createVideo()
                }, 2000)
              } else if (!videoFileRef.current) {
                alert("Please select a video file")
              }
            }}
            className="flex-1"
            disabled={isUploading || !videoFileRef.current}
          >
            <Save className="w-4 h-4 mr-2" />
            {isUploading ? "Uploading..." : isEdit ? "Update Video" : "Create Video"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (isEdit) {
                setIsEditModalOpen(false)
                setEditingVideo(null)
              } else {
                setIsCreateModalOpen(false)
              }
              resetForm()
            }}
            disabled={isUploading}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold font-mono uppercase tracking-wider text-gray-900">Video Management</h2>
          <p className="text-gray-600 font-mono">Create, read, update, and delete your video content</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="sharp-button bg-black text-white hover:bg-gray-800 font-mono font-bold uppercase tracking-wide"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <DialogHeader>
              <DialogTitle className="font-mono font-bold uppercase tracking-wider">Create New Video</DialogTitle>
            </DialogHeader>
            <VideoForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="sharp-card mb-6">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="sharp-input pl-10 font-mono"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 sharp-input font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-2 border-gray-900">
                  <SelectItem value="all" className="font-mono">
                    All Categories
                  </SelectItem>
                  {VIDEO_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="font-mono">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 ${category.color}`}></div>
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32 sharp-input font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-2 border-gray-900">
                  <SelectItem value="all" className="font-mono">
                    All Status
                  </SelectItem>
                  <SelectItem value="active" className="font-mono">
                    Active
                  </SelectItem>
                  <SelectItem value="draft" className="font-mono">
                    Draft
                  </SelectItem>
                  <SelectItem value="archived" className="font-mono">
                    Archived
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="sharp-button bg-white text-black hover:bg-gray-100 font-mono"
              >
                {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="sharp-card">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono font-bold uppercase tracking-wide text-gray-600">Total Videos</p>
                <p className="text-2xl font-bold font-mono text-gray-900">{videos.length}</p>
              </div>
              <Video className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="sharp-card">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono font-bold uppercase tracking-wide text-gray-600">Active</p>
                <p className="text-2xl font-bold font-mono text-green-600">
                  {videos.filter((v) => v.status === "active").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="sharp-card">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono font-bold uppercase tracking-wide text-gray-600">Drafts</p>
                <p className="text-2xl font-bold font-mono text-yellow-600">
                  {videos.filter((v) => v.status === "draft").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="sharp-card">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono font-bold uppercase tracking-wide text-gray-600">Total Views</p>
                <p className="text-2xl font-bold font-mono text-purple-600">
                  {videos.reduce((total, video) => total + video.views, 0).toLocaleString()}
                </p>
              </div>
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Videos Display */}
      {filteredVideos.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {videos.length === 0 ? "No videos yet" : "No videos match your search"}
            </h3>
            <p className="text-gray-600 mb-4">
              {videos.length === 0 ? "Create your first video to get started" : "Try adjusting your filters"}
            </p>
            {videos.length === 0 && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Video
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <Image src={video.thumbnailUrl || "/placeholder.svg"} alt={video.title} fill className="object-cover" />
                <div className="absolute top-2 left-2 flex gap-2">
                  <Badge className={`${getCategoryColor(video.category)} text-white`}>
                    {getCategoryName(video.category)}
                  </Badge>
                  <Badge className={`${getStatusColor(video.status)} text-white`}>{video.status}</Badge>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {video.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {video.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {video.likes}
                    </span>
                  </div>
                  <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => window.open(video.videoUrl, "_blank")}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Play
                  </Button>
                  <Button onClick={() => openEditModal(video)} size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => deleteVideo(video.id)} size="sm" variant="outline" className="text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVideos.map((video) => (
            <Card key={video.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={video.thumbnailUrl || "/placeholder.svg"}
                      alt={video.title}
                      width={200}
                      height={120}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg text-gray-900">{video.title}</h3>
                        <Badge className={`${getCategoryColor(video.category)} text-white`}>
                          {getCategoryName(video.category)}
                        </Badge>
                        <Badge className={`${getStatusColor(video.status)} text-white`}>{video.status}</Badge>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button onClick={() => window.open(video.videoUrl, "_blank")} size="sm" variant="outline">
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => openEditModal(video)} size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => deleteVideo(video.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {video.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs text-gray-500">
                      <div>
                        <span className="font-medium">Duration:</span> {video.duration}
                      </div>
                      <div>
                        <span className="font-medium">Views:</span> {video.views}
                      </div>
                      <div>
                        <span className="font-medium">Size:</span> {video.fileSize}
                      </div>
                      <div>
                        <span className="font-medium">Resolution:</span> {video.resolution}
                      </div>
                      <div>
                        <span className="font-medium">Modified:</span>{" "}
                        {new Date(video.lastModified).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
          </DialogHeader>
          <VideoForm isEdit={true} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
