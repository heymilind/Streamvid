"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AdBanner from "@/components/ad-banner"
import PopUnderAd from "@/components/pop-under-ad"
import { Shield, RefreshCw, ExternalLink, AlertCircle } from "lucide-react"

interface ReliableVideoPlayerProps {
  video: {
    id: string
    title: string
    embedUrl: string
    thumbnail: string
  }
}

export default function ReliableVideoPlayer({ video }: ReliableVideoPlayerProps) {
  const [showAdBanner, setShowAdBanner] = useState(false)
  const [showPopUnder, setShowPopUnder] = useState(false)
  const [adSkipCountdown, setAdSkipCountdown] = useState(5)
  const [playerMode, setPlayerMode] = useState<"normal" | "enhanced" | "fallback">("normal")
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [preventRedirect, setPreventRedirect] = useState(true)
  const [showClickOverlay, setShowClickOverlay] = useState(true)

  useEffect(() => {
    // Show pop-under ad after 3 seconds
    const popUnderTimer = setTimeout(() => {
      setShowPopUnder(true)
    }, 3000)

    // Show ad banner after 10 seconds
    const adTimer = setTimeout(() => {
      setShowAdBanner(true)
      setAdSkipCountdown(5)
    }, 10000)

    return () => {
      clearTimeout(popUnderTimer)
      clearTimeout(adTimer)
    }
  }, [])

  useEffect(() => {
    // Countdown for ad skip button
    if (showAdBanner && adSkipCountdown > 0) {
      const countdown = setTimeout(() => {
        setAdSkipCountdown(adSkipCountdown - 1)
      }, 1000)
      return () => clearTimeout(countdown)
    }
  }, [showAdBanner, adSkipCountdown])

  const getEmbedUrl = () => {
    const url = new URL(video.embedUrl)

    // Add parameters that might help reduce ads without breaking playback
    if (url.hostname.includes("youtube")) {
      url.searchParams.set("modestbranding", "1")
      url.searchParams.set("rel", "0")
      url.searchParams.set("showinfo", "0")
    }

    return url.toString()
  }

  const getEnhancedEmbedUrl = () => {
    const url = new URL(video.embedUrl)

    // More aggressive parameters (might break some videos)
    if (url.hostname.includes("youtube")) {
      url.searchParams.set("modestbranding", "1")
      url.searchParams.set("rel", "0")
      url.searchParams.set("showinfo", "0")
      url.searchParams.set("iv_load_policy", "3")
      url.searchParams.set("cc_load_policy", "0")
      url.searchParams.set("fs", "1")
      url.searchParams.set("disablekb", "0")
    }

    // For adult sites, try common parameters
    if (url.hostname.includes("lesbian8") || url.hostname.includes("pornhub")) {
      // These parameters might not work but won't break the video
      url.searchParams.set("t", "0")
    }

    return url.toString()
  }

  const handleIframeError = () => {
    setHasError(true)
    setPlayerMode("fallback")
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const refreshPlayer = () => {
    setIsLoading(true)
    setHasError(false)
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  const skipAd = () => {
    setShowAdBanner(false)
  }

  const openInNewTab = () => {
    window.open(video.embedUrl, "_blank")
  }

  return (
    <Card className="overflow-hidden bg-black border-gray-200">
      {/* Player Controls */}
      <div className="bg-gray-900 p-3 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={playerMode === "normal" ? "default" : "outline"}
            onClick={() => setPlayerMode("normal")}
            className="text-xs"
          >
            Normal Mode
          </Button>

          <Button
            size="sm"
            variant={playerMode === "enhanced" ? "default" : "outline"}
            onClick={() => setPlayerMode("enhanced")}
            className="text-xs"
          >
            <Shield className="w-3 h-3 mr-1" />
            Enhanced Mode
          </Button>

          <Button
            size="sm"
            variant={preventRedirect ? "default" : "outline"}
            onClick={() => setPreventRedirect(!preventRedirect)}
            className="text-xs"
          >
            🔒 {preventRedirect ? "Protected" : "Clickable"}
          </Button>

          <Button size="sm" variant="outline" onClick={refreshPlayer} className="text-xs">
            <RefreshCw className="w-3 h-3 mr-1" />
            Refresh
          </Button>

          <Button size="sm" variant="outline" onClick={openInNewTab} className="text-xs">
            <ExternalLink className="w-3 h-3 mr-1" />
            Open External
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={playerMode === "enhanced" ? "default" : "secondary"} className="text-xs">
            {playerMode === "enhanced" ? "🛡️ Ad Reduction ON" : "📺 Standard Mode"}
          </Badge>
          <Badge variant={preventRedirect ? "default" : "destructive"} className="text-xs">
            {preventRedirect ? "🔒 Click Protected" : "🔓 Clickable"}
          </Badge>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative aspect-video">
        {hasError ? (
          // Fallback when iframe fails
          <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center text-white p-8">
            <AlertCircle className="w-16 h-16 mb-4 text-red-400" />
            <h3 className="text-xl font-semibold mb-2">Video Unavailable</h3>
            <p className="text-gray-300 text-center mb-4">The video couldn't be loaded. This might be due to:</p>
            <ul className="text-sm text-gray-400 mb-6 text-left">
              <li>• Content restrictions</li>
              <li>• Network connectivity issues</li>
              <li>• Ad blocking interference</li>
              <li>• Server-side problems</li>
            </ul>
            <div className="flex gap-2">
              <Button onClick={refreshPlayer} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={openInNewTab}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <div className="text-white text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p>Loading video...</p>
                </div>
              </div>
            )}

            {/* Main iframe */}
            {video.embedUrl ? (
              <iframe
                ref={iframeRef}
                width="100%"
                height="100%"
                src={playerMode === "enhanced" ? getEnhancedEmbedUrl() : getEmbedUrl()}
                title={video.title}
                frameBorder="0"
                allowFullScreen
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{
                  pointerEvents: preventRedirect ? "none" : "auto",
                  userSelect: "none",
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center text-white p-8">
                <AlertCircle className="w-16 h-16 mb-4 text-red-400" />
                <h3 className="text-xl font-semibold mb-2">No Video Source</h3>
                <p className="text-gray-300 text-center mb-4">No embed URL provided for this video.</p>
              </div>
            )}

            {/* Anti-Redirect Overlay */}
            {showClickOverlay && preventRedirect && (
              <div
                className="absolute inset-0 z-15 cursor-pointer bg-transparent"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  // Brief visual feedback
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.1)"
                  setTimeout(() => {
                    e.currentTarget.style.backgroundColor = "transparent"
                  }, 200)
                }}
                onDoubleClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  // Toggle fullscreen on double click
                  if (document.fullscreenElement) {
                    document.exitFullscreen()
                  } else {
                    e.currentTarget.parentElement?.requestFullscreen()
                  }
                }}
                title="Double-click for fullscreen"
              />
            )}
          </div>
        )}

        {/* Ad Banner Overlay */}
        {showAdBanner && (
          <div className="absolute top-4 right-4 z-20">
            <AdBanner onSkip={skipAd} canSkip={adSkipCountdown === 0} countdown={adSkipCountdown} />
          </div>
        )}
      </div>

      {/* Pop-under Ad */}
      {showPopUnder && <PopUnderAd onClose={() => setShowPopUnder(false)} />}
    </Card>
  )
}
