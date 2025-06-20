"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Play, AlertCircle } from "lucide-react"

interface AutomatedSkipOverlayProps {
  video: {
    id: string
    title: string
    embedUrl: string
    thumbnail?: string
  }
}

export default function AutomatedSkipOverlay({ video }: AutomatedSkipOverlayProps) {
  const [isVideoStarted, setIsVideoStarted] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Start video playback
  const startVideo = () => {
    setIsVideoStarted(true)
    console.log("🎬 Video playback started")
  }

  const getEmbedUrl = () => {
    if (!video.embedUrl) return ""

    const url = new URL(video.embedUrl)

    // Add parameters to hide video title and info
    if (url.hostname.includes("youtube")) {
      url.searchParams.set("modestbranding", "1")
      url.searchParams.set("rel", "0")
      url.searchParams.set("showinfo", "0")
      url.searchParams.set("iv_load_policy", "3")
      url.searchParams.set("cc_load_policy", "0")
    }

    return url.toString()
  }

  return (
    <Card className="overflow-hidden bg-black border-gray-200 relative">
      {/* Video Player */}
      <div className="relative aspect-video overflow-hidden">
        {!isVideoStarted ? (
          // Custom Play Button Overlay
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <div className="text-center">
              <div className="relative mb-6">
                <div
                  className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group mx-auto"
                  onClick={startVideo}
                >
                  <Play className="w-10 h-10 text-white ml-1 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">{video.title}</h3>
              <p className="text-white/70 text-sm">Click to start video</p>
            </div>
          </div>
        ) : video.embedUrl ? (
          <iframe
            ref={iframeRef}
            width="100%"
            height="100%"
            src={getEmbedUrl()}
            title="Video Player"
            frameBorder="0"
            allowFullScreen
            scrolling="no"
            className="w-full h-full overflow-hidden"
            style={{
              overflow: "hidden",
              border: "none",
              outline: "none",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          // Fallback when no embed URL is provided
          <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center text-white p-8">
            <AlertCircle className="w-16 h-16 mb-4 text-red-400" />
            <h3 className="text-xl font-semibold mb-2">No Video Source</h3>
            <p className="text-gray-300 text-center mb-4">No embed URL provided for this video.</p>
          </div>
        )}

        {/* Right-side Branding Overlay */}
        {isVideoStarted && video.embedUrl && (
          <div className="absolute bottom-3 right-0 bg-black/70 backdrop-blur-sm text-white px-3 py-1 text-xs font-medium border border-white/20 rounded-l-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
              StreamHub
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
