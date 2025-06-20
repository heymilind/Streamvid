"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Link, AlertCircle, CheckCircle } from "lucide-react"

interface VideoDownloaderProps {
  embedUrl: string
  title: string
}

export default function VideoDownloader({ embedUrl, title }: VideoDownloaderProps) {
  const [downloadUrl, setDownloadUrl] = useState("")
  const [quality, setQuality] = useState("720p")
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedUrls, setExtractedUrls] = useState<Array<{ quality: string; url: string }>>([])

  const extractVideoUrl = async () => {
    setIsExtracting(true)

    try {
      // This is a mock implementation - in reality, you'd need a backend service
      // to extract direct video URLs from embed URLs

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock extracted URLs
      const mockUrls = [
        { quality: "1080p", url: "https://example.com/video_1080p.mp4" },
        { quality: "720p", url: "https://example.com/video_720p.mp4" },
        { quality: "480p", url: "https://example.com/video_480p.mp4" },
      ]

      setExtractedUrls(mockUrls)
      setDownloadUrl(mockUrls.find((u) => u.quality === quality)?.url || mockUrls[0].url)
    } catch (error) {
      console.error("Failed to extract video URL:", error)
    } finally {
      setIsExtracting(false)
    }
  }

  const downloadVideo = () => {
    if (downloadUrl) {
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Video Downloader & URL Extractor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="embed-url">Embed URL</Label>
          <Input id="embed-url" value={embedUrl} readOnly className="bg-gray-50" />
        </div>

        <div className="flex gap-2">
          <Button onClick={extractVideoUrl} disabled={isExtracting} className="flex-1">
            <Link className="w-4 h-4 mr-2" />
            {isExtracting ? "Extracting..." : "Extract Direct URL"}
          </Button>

          <Select value={quality} onValueChange={setQuality}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1080p">1080p</SelectItem>
              <SelectItem value="720p">720p</SelectItem>
              <SelectItem value="480p">480p</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {extractedUrls.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Direct URLs extracted successfully!</span>
            </div>

            <div className="space-y-2">
              {extractedUrls.map((item) => (
                <div key={item.quality} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="font-medium text-sm w-16">{item.quality}</span>
                  <Input value={item.url} readOnly className="flex-1 text-xs" />
                  <Button
                    size="sm"
                    onClick={() => {
                      setDownloadUrl(item.url)
                      setQuality(item.quality)
                    }}
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>

            <Button onClick={downloadVideo} className="w-full" disabled={!downloadUrl}>
              <Download className="w-4 h-4 mr-2" />
              Download {quality} Video
            </Button>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Note:</p>
              <p>
                This tool extracts direct video URLs from embed links, giving you full control over playback without
                provider ads. For production use, you'll need a backend service to handle URL extraction.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
