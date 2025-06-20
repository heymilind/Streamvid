"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import AdBanner from "@/components/ad-banner"
import PopUnderAd from "@/components/pop-under-ad"

interface VideoPlayerProps {
  video: {
    id: string
    title: string
    embedUrl: string
    thumbnail: string
  }
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const [showAdBanner, setShowAdBanner] = useState(false)
  const [showPopUnder, setShowPopUnder] = useState(false)
  const [adSkipCountdown, setAdSkipCountdown] = useState(5)
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false)
  const [preventRedirect, setPreventRedirect] = useState(true)
  const [showClickOverlay, setShowClickOverlay] = useState(true)

  useEffect(() => {
    // Show pop-under ad immediately when component loads
    setShowPopUnder(true)

    // Show ad banner after 10 seconds
    const adTimer = setTimeout(() => {
      setShowAdBanner(true)
      setAdSkipCountdown(5)
    }, 10000)

    return () => clearTimeout(adTimer)
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

  const skipAd = () => {
    setShowAdBanner(false)
  }

  const handleIframeLoad = () => {
    setHasStartedPlaying(true)
  }

  return (
    <Card className="overflow-hidden bg-black border-gray-200">
      <div className="relative aspect-video">
        <div className="relative w-full h-full">
          <iframe
            width="100%"
            height="100%"
            src={video.embedUrl}
            title={video.title}
            frameBorder="0"
            allowFullScreen
            onLoad={handleIframeLoad}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{
              pointerEvents: preventRedirect ? "none" : "auto",
              userSelect: "none",
            }}
          />

          {/* Anti-Redirect Overlay */}
          {showClickOverlay && preventRedirect && (
            <div
              className="absolute inset-0 z-10 cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // Optional: Show a message or do nothing
              }}
              onDoubleClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // Enable fullscreen on double click
                if (document.fullscreenElement) {
                  document.exitFullscreen()
                } else {
                  e.currentTarget.parentElement?.requestFullscreen()
                }
              }}
            />
          )}

          {/* Control Panel */}
          <div className="absolute top-2 left-2 z-20 flex gap-2">
            <button
              onClick={() => setPreventRedirect(!preventRedirect)}
              className={`px-2 py-1 text-xs rounded ${
                preventRedirect ? "bg-green-600 text-white" : "bg-red-600 text-white"
              }`}
            >
              {preventRedirect ? "🔒 Protected" : "🔓 Clickable"}
            </button>

            <button
              onClick={() => setShowClickOverlay(!showClickOverlay)}
              className="px-2 py-1 text-xs rounded bg-blue-600 text-white"
            >
              {showClickOverlay ? "👁️ Overlay ON" : "👁️ Overlay OFF"}
            </button>
          </div>
        </div>

        {/* Ad Banner Overlay */}
        {showAdBanner && (
          <div className="absolute top-4 right-4 z-10">
            <AdBanner onSkip={skipAd} canSkip={adSkipCountdown === 0} countdown={adSkipCountdown} />
          </div>
        )}
      </div>

      {/* Pop-under Ad */}
      {showPopUnder && <PopUnderAd onClose={() => setShowPopUnder(false)} />}
    </Card>
  )
}
