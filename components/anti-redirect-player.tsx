"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import AdBanner from "@/components/ad-banner"
import PopUnderAd from "@/components/pop-under-ad"
import { RefreshCw, ExternalLink, Lock, Unlock, Eye, EyeOff, Settings } from "lucide-react"

interface AntiRedirectPlayerProps {
  video: {
    id: string
    title: string
    embedUrl: string
    thumbnail: string
  }
}

export default function AntiRedirectPlayer({ video }: AntiRedirectPlayerProps) {
  const [showAdBanner, setShowAdBanner] = useState(false)
  const [showPopUnder, setShowPopUnder] = useState(false)
  const [adSkipCountdown, setAdSkipCountdown] = useState(5)
  const [preventRedirect, setPreventRedirect] = useState(true)
  const [showClickOverlay, setShowClickOverlay] = useState(true)
  const [overlayOpacity, setOverlayOpacity] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setClickCount((prev) => prev + 1)

    // Visual feedback
    setOverlayOpacity(0.2)
    setTimeout(() => setOverlayOpacity(0), 200)

    // Show notification
    showNotification(`Click blocked! (${clickCount + 1} clicks prevented)`)
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Toggle fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current?.requestFullscreen()
    }
  }

  const showNotification = (message: string) => {
    const notification = document.createElement("div")
    notification.textContent = message
    notification.className = "fixed top-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse"
    document.body.appendChild(notification)
    setTimeout(() => notification.remove(), 3000)
  }

  const refreshPlayer = () => {
    setIsLoading(true)
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
    setTimeout(() => setIsLoading(false), 2000)
  }

  const openInNewTab = () => {
    window.open(video.embedUrl, "_blank")
  }

  const skipAd = () => {
    setShowAdBanner(false)
  }

  const toggleProtection = () => {
    setPreventRedirect(!preventRedirect)
    showNotification(!preventRedirect ? "🔒 Click protection enabled" : "🔓 Click protection disabled")
  }

  return (
    <Card className="overflow-hidden bg-black border-gray-200">
      {/* Advanced Controls Panel */}
      <div className="bg-gray-900 p-4 space-y-3">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={refreshPlayer} className="text-xs">
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </Button>

            <Button size="sm" variant="outline" onClick={openInNewTab} className="text-xs">
              <ExternalLink className="w-3 h-3 mr-1" />
              Open External
            </Button>

            <Button size="sm" variant="outline" onClick={() => setShowControls(!showControls)} className="text-xs">
              <Settings className="w-3 h-3 mr-1" />
              {showControls ? "Hide" : "Show"} Controls
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={preventRedirect ? "default" : "destructive"} className="text-xs">
              {preventRedirect ? "🔒 Protected" : "🔓 Clickable"}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Clicks Blocked: {clickCount}
            </Badge>
          </div>
        </div>

        {/* Advanced Settings */}
        {showControls && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <Switch id="prevent-redirect" checked={preventRedirect} onCheckedChange={toggleProtection} />
              <Label htmlFor="prevent-redirect" className="text-white text-sm">
                <Lock className="w-4 h-4 inline mr-1" />
                Prevent Redirects
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="show-overlay" checked={showClickOverlay} onCheckedChange={setShowClickOverlay} />
              <Label htmlFor="show-overlay" className="text-white text-sm">
                <Eye className="w-4 h-4 inline mr-1" />
                Click Overlay
              </Label>
            </div>
          </div>
        )}
      </div>

      {/* Video Player */}
      <div ref={containerRef} className="relative aspect-video group">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
            <div className="text-white text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>Refreshing video...</p>
            </div>
          </div>
        )}

        {/* Main iframe */}
        <iframe
          ref={iframeRef}
          width="100%"
          height="100%"
          src={video.embedUrl}
          title={video.title}
          frameBorder="0"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{
            pointerEvents: preventRedirect ? "none" : "auto",
            userSelect: "none",
          }}
        />

        {/* Anti-Redirect Overlay */}
        {showClickOverlay && preventRedirect && (
          <div
            className="absolute inset-0 z-20 cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
            }}
            onClick={handleOverlayClick}
            onDoubleClick={handleDoubleClick}
            title="Double-click for fullscreen • Click protection active"
          />
        )}

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 z-25 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant={preventRedirect ? "default" : "destructive"}
            onClick={toggleProtection}
            className="bg-black/70 hover:bg-black/90"
          >
            {preventRedirect ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowClickOverlay(!showClickOverlay)}
            className="bg-black/70 hover:bg-black/90 text-white border-white/20"
          >
            {showClickOverlay ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
        </div>

        {/* Protection Status Indicator */}
        {preventRedirect && (
          <div className="absolute bottom-4 left-4 z-25 bg-green-600/90 text-white px-3 py-1 rounded-full text-xs font-medium">
            🛡️ Click Protection Active
          </div>
        )}

        {/* Ad Banner Overlay */}
        {showAdBanner && (
          <div className="absolute top-4 left-4 z-25">
            <AdBanner onSkip={skipAd} canSkip={adSkipCountdown === 0} countdown={adSkipCountdown} />
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="bg-gray-800 p-3 text-xs text-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <strong className="text-white">Click Protection:</strong> {preventRedirect ? "Enabled" : "Disabled"}
          </div>
          <div>
            <strong className="text-white">Clicks Blocked:</strong> {clickCount}
          </div>
        </div>
        <div className="mt-2 text-yellow-300">
          💡 Double-click video for fullscreen • Toggle protection with the lock button
        </div>
      </div>

      {/* Pop-under Ad */}
      {showPopUnder && <PopUnderAd onClose={() => setShowPopUnder(false)} />}
    </Card>
  )
}
