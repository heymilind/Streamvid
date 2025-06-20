"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import AdBanner from "@/components/ad-banner"
import PopUnderAd from "@/components/pop-under-ad"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  SkipForward,
  SkipBack,
  Shield,
  Download,
} from "lucide-react"

interface EnhancedVideoPlayerProps {
  video: {
    id: string
    title: string
    embedUrl: string
    directUrl?: string // Direct video file URL for full control
    thumbnail: string
  }
}

export default function EnhancedVideoPlayer({ video }: EnhancedVideoPlayerProps) {
  const [showAdBanner, setShowAdBanner] = useState(false)
  const [showPopUnder, setShowPopUnder] = useState(false)
  const [adSkipCountdown, setAdSkipCountdown] = useState(5)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([100])
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [adBlockEnabled, setAdBlockEnabled] = useState(true)
  const [useDirectPlayer, setUseDirectPlayer] = useState(false)
  const [preventRedirect, setPreventRedirect] = useState(true)
  const [showClickOverlay, setShowClickOverlay] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Show pop-under ad immediately when component loads (only if ads not blocked)
    if (!adBlockEnabled) {
      setShowPopUnder(true)

      // Show ad banner after 10 seconds
      const adTimer = setTimeout(() => {
        setShowAdBanner(true)
        setAdSkipCountdown(5)
      }, 10000)

      return () => clearTimeout(adTimer)
    }
  }, [adBlockEnabled])

  useEffect(() => {
    // Countdown for ad skip button
    if (showAdBanner && adSkipCountdown > 0) {
      const countdown = setTimeout(() => {
        setAdSkipCountdown(adSkipCountdown - 1)
      }, 1000)
      return () => clearTimeout(countdown)
    }
  }, [showAdBanner, adSkipCountdown])

  useEffect(() => {
    // Block ads in iframe using CSS injection
    if (adBlockEnabled && iframeRef.current) {
      try {
        const iframe = iframeRef.current
        iframe.onload = () => {
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
            if (iframeDoc) {
              // Inject ad-blocking CSS
              const style = iframeDoc.createElement("style")
              style.textContent = `
                /* Common ad selectors */
                .ad, .ads, .advertisement, .sponsor, .promoted,
                [class*="ad-"], [class*="ads-"], [id*="ad-"], [id*="ads-"],
                .ytp-ad-overlay-container, .ytp-ad-text-overlay,
                .video-ads, .preroll-ads, .overlay-ads,
                iframe[src*="doubleclick"], iframe[src*="googlesyndication"],
                iframe[src*="googleadservices"], iframe[src*="adsystem"] {
                  display: none !important;
                  visibility: hidden !important;
                  opacity: 0 !important;
                  height: 0 !important;
                  width: 0 !important;
                }
                
                /* Skip ad buttons enhancement */
                .ytp-ad-skip-button, .skip-ad, [class*="skip"] {
                  background: #ff0000 !important;
                  color: white !important;
                  font-weight: bold !important;
                  z-index: 9999 !important;
                }
              `
              iframeDoc.head.appendChild(style)
            }
          } catch (e) {
            console.log("Cross-origin iframe - cannot inject ad blocking CSS")
          }
        }
      } catch (e) {
        console.log("Ad blocking injection failed:", e)
      }
    }
  }, [adBlockEnabled])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value)
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10
    }
  }

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const skipAd = () => {
    setShowAdBanner(false)
  }

  return (
    <Card className="overflow-hidden bg-black border-gray-200">
      <div ref={containerRef} className="relative aspect-video group">
        {/* Ad Block Controls */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <Button
            size="sm"
            variant={adBlockEnabled ? "default" : "outline"}
            onClick={() => setAdBlockEnabled(!adBlockEnabled)}
            className="bg-black/50 hover:bg-black/70 text-white border-white/20"
          >
            <Shield className="w-4 h-4 mr-1" />
            {adBlockEnabled ? "Ad Block ON" : "Ad Block OFF"}
          </Button>

          <Button
            size="sm"
            variant={preventRedirect ? "default" : "outline"}
            onClick={() => setPreventRedirect(!preventRedirect)}
            className="bg-black/50 hover:bg-black/70 text-white border-white/20"
          >
            🔒 {preventRedirect ? "Protected" : "Clickable"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowClickOverlay(!showClickOverlay)}
            className="bg-black/50 hover:bg-black/70 text-white border-white/20"
          >
            👁️ {showClickOverlay ? "Overlay ON" : "OFF"}
          </Button>

          {video.directUrl && (
            <Button
              size="sm"
              variant={useDirectPlayer ? "default" : "outline"}
              onClick={() => setUseDirectPlayer(!useDirectPlayer)}
              className="bg-black/50 hover:bg-black/70 text-white border-white/20"
            >
              {useDirectPlayer ? "Direct Player" : "Embed Player"}
            </Button>
          )}
        </div>

        {/* Direct Video Player (Full Control) */}
        {useDirectPlayer && video.directUrl ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster={video.thumbnail}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              crossOrigin="anonymous"
            >
              <source src={video.directUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Custom Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Progress Bar */}
              <div className="mb-4">
                <Slider value={[currentTime]} max={duration} step={1} onValueChange={handleSeek} className="w-full" />
                <div className="flex justify-between text-xs text-white mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={skipBackward} className="text-white hover:bg-white/20">
                    <SkipBack className="w-4 h-4" />
                  </Button>

                  <Button size="sm" variant="ghost" onClick={togglePlay} className="text-white hover:bg-white/20">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>

                  <Button size="sm" variant="ghost" onClick={skipForward} className="text-white hover:bg-white/20">
                    <SkipForward className="w-4 h-4" />
                  </Button>

                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="ghost" onClick={toggleMute} className="text-white hover:bg-white/20">
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <div className="w-20">
                      <Slider value={volume} max={100} step={1} onValueChange={handleVolumeChange} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <Download className="w-4 h-4" />
                  </Button>

                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <Settings className="w-4 h-4" />
                  </Button>

                  <Button size="sm" variant="ghost" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Iframe Player with Ad Blocking */
          <div className="relative w-full h-full">
            <iframe
              ref={iframeRef}
              width="100%"
              height="100%"
              src={video.embedUrl}
              title={video.title}
              frameBorder="0"
              allowFullScreen
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-presentation"
              style={{
                pointerEvents: preventRedirect ? "none" : "auto",
                userSelect: "none",
              }}
            />

            {/* Anti-Redirect Overlay */}
            {showClickOverlay && preventRedirect && (
              <div
                className="absolute inset-0 z-10 cursor-pointer bg-transparent"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  // Show brief notification
                  const notification = document.createElement("div")
                  notification.textContent = "Click protection active"
                  notification.className = "fixed top-4 right-4 bg-black text-white px-3 py-1 rounded z-50"
                  document.body.appendChild(notification)
                  setTimeout(() => notification.remove(), 2000)
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
          </div>
        )}

        {/* Ad Banner Overlay (only if ads not blocked) */}
        {showAdBanner && !adBlockEnabled && (
          <div className="absolute top-4 right-4 z-10">
            <AdBanner onSkip={skipAd} canSkip={adSkipCountdown === 0} countdown={adSkipCountdown} />
          </div>
        )}

        {/* Ad Block Notification */}
        {adBlockEnabled && (
          <div className="absolute bottom-4 right-4 z-10 bg-green-600 text-white px-3 py-1 rounded text-sm">
            🛡️ Ads Blocked
          </div>
        )}
      </div>

      {/* Pop-under Ad (only if ads not blocked) */}
      {showPopUnder && !adBlockEnabled && <PopUnderAd onClose={() => setShowPopUnder(false)} />}
    </Card>
  )
}
