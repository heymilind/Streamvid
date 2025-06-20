"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Check, AlertCircle } from "lucide-react"

interface EmbedUrlInputProps {
  value: string
  onChange: (value: string) => void
  onPreview?: (url: string) => void
}

export default function EmbedUrlInput({ value, onChange, onPreview }: EmbedUrlInputProps) {
  const [isValidUrl, setIsValidUrl] = useState(false)
  const [urlType, setUrlType] = useState<string>("")

  const validateEmbedUrl = (url: string) => {
    if (!url) {
      setIsValidUrl(false)
      setUrlType("")
      return
    }

    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname.toLowerCase()

      if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
        setUrlType("YouTube")
        setIsValidUrl(url.includes("/embed/"))
      } else if (hostname.includes("vimeo.com")) {
        setUrlType("Vimeo")
        setIsValidUrl(url.includes("/video/") || url.includes("player.vimeo.com"))
      } else if (hostname.includes("dailymotion.com")) {
        setUrlType("Dailymotion")
        setIsValidUrl(url.includes("/embed/"))
      } else if (hostname.includes("twitch.tv")) {
        setUrlType("Twitch")
        setIsValidUrl(url.includes("/embed/"))
      } else {
        setUrlType("Custom")
        setIsValidUrl(true) // Allow custom embed URLs
      }
    } catch {
      setIsValidUrl(false)
      setUrlType("")
    }
  }

  const handleUrlChange = (newUrl: string) => {
    onChange(newUrl)
    validateEmbedUrl(newUrl)
  }

  const convertToEmbedUrl = (url: string): string => {
    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname.toLowerCase()

      // YouTube conversion
      if (hostname.includes("youtube.com") && url.includes("watch?v=")) {
        const videoId = urlObj.searchParams.get("v")
        return `https://www.youtube.com/embed/${videoId}`
      }

      // YouTube short URL conversion
      if (hostname.includes("youtu.be")) {
        const videoId = urlObj.pathname.slice(1)
        return `https://www.youtube.com/embed/${videoId}`
      }

      // Vimeo conversion
      if (hostname.includes("vimeo.com") && !url.includes("player.vimeo.com")) {
        const videoId = urlObj.pathname.split("/").pop()
        return `https://player.vimeo.com/video/${videoId}`
      }

      return url
    } catch {
      return url
    }
  }

  const handleConvertUrl = () => {
    const convertedUrl = convertToEmbedUrl(value)
    if (convertedUrl !== value) {
      handleUrlChange(convertedUrl)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="embed-url">Video Embed URL</Label>
        <div className="mt-2 space-y-2">
          <div className="flex gap-2">
            <Input
              id="embed-url"
              type="url"
              placeholder="Enter video URL or embed URL"
              value={value}
              onChange={(e) => handleUrlChange(e.target.value)}
              className={`flex-1 ${isValidUrl ? "border-green-500" : value ? "border-red-500" : ""}`}
            />
            <Button type="button" variant="outline" onClick={handleConvertUrl} disabled={!value}>
              Convert
            </Button>
          </div>

          {value && (
            <div className="flex items-center gap-2 text-sm">
              {isValidUrl ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-green-600">Valid {urlType} embed URL</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-600">Invalid embed URL format</span>
                </>
              )}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Supported platforms: YouTube, Vimeo, Dailymotion, Twitch, and custom iframe URLs
        </p>
      </div>

      {isValidUrl && value && onPreview && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Preview</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => onPreview(value)}>
                <ExternalLink className="w-4 h-4 mr-1" />
                Test
              </Button>
            </div>
            <div className="aspect-video bg-gray-100 rounded overflow-hidden">
              <iframe
                src={value}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-2">URL Format Examples:</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <div>
              <strong>YouTube:</strong> https://www.youtube.com/embed/VIDEO_ID
            </div>
            <div>
              <strong>Vimeo:</strong> https://player.vimeo.com/video/VIDEO_ID
            </div>
            <div>
              <strong>Dailymotion:</strong> https://www.dailymotion.com/embed/video/VIDEO_ID
            </div>
            <div>
              <strong>Custom:</strong> Any iframe-compatible embed URL
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
