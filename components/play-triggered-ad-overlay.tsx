"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Volume2, Clock, SkipForward } from "lucide-react"

interface PlayTriggeredAdOverlayProps {
  video: {
    id: string
    title: string
    embedUrl: string
    thumbnail: string
  }
}

interface CustomAdConfig {
  brandName: string
  brandLogo: string
  adTitle: string
  adDescription: string
  ctaText: string
  ctaUrl: string
  backgroundColor: string
  textColor: string
  skipDelay: number // seconds before skip is available
}

export default function PlayTriggeredAdOverlay({ video }: PlayTriggeredAdOverlayProps) {
  const [showPlayButton, setShowPlayButton] = useState(true)
  const [showCustomAd, setShowCustomAd] = useState(false)
  const [videoStarted, setVideoStarted] = useState(false)
  const [skipCountdown, setSkipCountdown] = useState(5)
  const [canSkip, setCanSkip] = useState(false)
  const [adPhase, setAdPhase] = useState<"waiting" | "preload" | "active" | "syncing" | "completed">("waiting")

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const skipSyncTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const adTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [customAdConfig] = useState<CustomAdConfig>({
    brandName: "StreamHub Premium",
    brandLogo: "/placeholder.svg?height=40&width=120&text=BRAND",
    adTitle: "Upgrade to Premium Experience",
    adDescription: "Enjoy unlimited streaming with no interruptions and exclusive content access.",
    ctaText: "Start Free Trial",
    ctaUrl: "/premium",
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    textColor: "#ffffff",
    skipDelay: 5,
  })

  // Handle play button click
  const handlePlayClick = useCallback(() => {
    console.log("Play button clicked - initiating ad sequence")

    setShowPlayButton(false)
    setVideoStarted(true)
    setAdPhase("preload")

    // Show our custom ad immediately (1 second before original ad loads)
    setTimeout(() => {
      setShowCustomAd(true)
      setAdPhase("active")
      setSkipCountdown(customAdConfig.skipDelay)
      setCanSkip(false)

      // Start countdown timer
      startSkipCountdown()
    }, 100) // Show almost immediately

    // Load the iframe after a brief delay to ensure our ad shows first
    setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.src = video.embedUrl
      }
    }, 500)
  }, [video.embedUrl, customAdConfig.skipDelay])

  // Skip countdown timer
  const startSkipCountdown = useCallback(() => {
    let countdown = customAdConfig.skipDelay

    const countdownInterval = setInterval(() => {
      countdown -= 1
      setSkipCountdown(countdown)

      if (countdown <= 0) {
        setCanSkip(true)
        clearInterval(countdownInterval)
      }
    }, 1000)

    // Store reference for cleanup
    adTimerRef.current = countdownInterval
  }, [customAdConfig.skipDelay])

  // Handle custom ad skip
  const handleCustomSkip = useCallback(() => {
    console.log("Custom ad skip clicked - syncing with original ad")

    setAdPhase("syncing")

    // Try to skip the original embedded ad
    const skipOriginalAd = () => {
      if (!iframeRef.current) return false

      try {
        const iframe = iframeRef.current
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

        if (iframeDoc) {
          // YouTube skip button selectors
          const youtubeSkipSelectors = [
            ".ytp-ad-skip-button",
            ".ytp-skip-ad-button",
            ".skip-button",
            '[aria-label*="Skip"]',
            '[aria-label*="skip"]',
          ]

          // Generic skip button selectors
          const genericSkipSelectors = [
            '[class*="skip"]',
            '[id*="skip"]',
            ".skip-ad",
            ".close-ad",
            ".ad-skip",
            'button[onclick*="skip"]',
          ]

          const allSelectors = [...youtubeSkipSelectors, ...genericSkipSelectors]

          for (const selector of allSelectors) {
            const skipButton = iframeDoc.querySelector(selector) as HTMLElement
            if (skipButton && skipButton.offsetParent !== null) {
              // Check if visible
              console.log(`Found skip button: ${selector}`)
              skipButton.click()
              return true
            }
          }

          // If no skip button found, try to find and click play button to resume
          const playSelectors = [
            ".ytp-large-play-button",
            ".ytp-play-button",
            '[aria-label*="Play"]',
            'button[title*="Play"]',
          ]

          for (const selector of playSelectors) {
            const playButton = iframeDoc.querySelector(selector) as HTMLElement
            if (playButton) {
              console.log(`Clicking play button: ${selector}`)
              playButton.click()
              return true
            }
          }
        } else {
          // Cross-origin iframe - use postMessage
          console.log("Cross-origin iframe detected, using postMessage")
          iframe.contentWindow?.postMessage(
            {
              action: "skipAd",
              source: "customAdOverlay",
            },
            "*",
          )

          // Also try keyboard shortcut (works on some platforms)
          iframe.contentWindow?.postMessage(
            {
              action: "keypress",
              key: "Tab",
            },
            "*",
          )

          return true
        }
      } catch (error) {
        console.log("Error accessing iframe:", error)

        // Fallback: try to simulate keyboard events
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            {
              action: "skipAd",
            },
            "*",
          )
        }
      }

      return false
    }

    // Try to skip immediately
    const skipped = skipOriginalAd()

    if (!skipped) {
      // If immediate skip failed, try again after a short delay
      setTimeout(() => {
        skipOriginalAd()
      }, 500)

      // And try once more after a longer delay
      setTimeout(() => {
        skipOriginalAd()
      }, 1500)
    }

    // Hide our custom ad after a brief delay
    setTimeout(() => {
      setShowCustomAd(false)
      setAdPhase("completed")
    }, 800)
  }, [])

  // Handle CTA click
  const handleCtaClick = useCallback(() => {
    console.log("CTA clicked")

    // Track engagement
    window.gtag?.("event", "custom_ad_cta_click", {
      video_id: video.id,
      ad_title: customAdConfig.adTitle,
    })

    // Open CTA URL
    window.open(customAdConfig.ctaUrl, "_blank")

    // Also skip the ad
    handleCustomSkip()
  }, [video.id, customAdConfig.adTitle, customAdConfig.ctaUrl, handleCustomSkip])

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.action === "adSkipped") {
        console.log("Received ad skip confirmation from iframe")
        setShowCustomAd(false)
        setAdPhase("completed")
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (adTimerRef.current) {
        clearInterval(adTimerRef.current)
      }
      if (skipSyncTimeoutRef.current) {
        clearTimeout(skipSyncTimeoutRef.current)
      }
    }
  }, [])

  // Monitor iframe for ad completion
  useEffect(() => {
    if (!videoStarted || !iframeRef.current) return

    const checkAdStatus = () => {
      try {
        const iframe = iframeRef.current
        if (!iframe?.contentDocument) return

        const doc = iframe.contentDocument

        // Check if ad elements are gone (ad completed)
        const adElements = doc.querySelectorAll(
          [".ytp-ad-overlay-container", ".ytp-ad-text-overlay", '[class*="ad-"]', '[id*="ad-"]'].join(","),
        )

        if (adElements.length === 0 && showCustomAd) {
          console.log("Original ad completed, hiding custom overlay")
          setShowCustomAd(false)
          setAdPhase("completed")
        }
      } catch (error) {
        // Cross-origin restriction, ignore
      }
    }

    const interval = setInterval(checkAdStatus, 1000)
    return () => clearInterval(interval)
  }, [videoStarted, showCustomAd])

  return (
    <Card className="overflow-hidden bg-black border-gray-200 relative">
      <div className="relative aspect-video bg-black">
        {/* Thumbnail and Play Button */}
        {showPlayButton && (
          <div className="absolute inset-0 z-30">
            <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Button
                onClick={handlePlayClick}
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white rounded-full w-20 h-20 p-0"
              >
                <Play className="w-8 h-8 ml-1" fill="currentColor" />
              </Button>
            </div>
          </div>
        )}

        {/* Video Iframe */}
        {videoStarted && (
          <iframe
            ref={iframeRef}
            width="100%"
            height="100%"
            title={video.title}
            frameBorder="0"
            allowFullScreen
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        )}

        {/* Custom Ad Overlay */}
        {showCustomAd && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center"
            style={{
              background: customAdConfig.backgroundColor,
              color: customAdConfig.textColor,
            }}
          >
            {/* Ad Content */}
            <div className="max-w-lg mx-auto text-center p-8">
              {/* Brand Logo */}
              <img
                src={customAdConfig.brandLogo || "/placeholder.svg"}
                alt={customAdConfig.brandName}
                className="h-12 mx-auto mb-6"
              />

              {/* Ad Title */}
              <h2 className="text-3xl font-bold mb-4">{customAdConfig.adTitle}</h2>

              {/* Ad Description */}
              <p className="text-xl opacity-90 mb-8 leading-relaxed">{customAdConfig.adDescription}</p>

              {/* CTA Button */}
              <Button
                onClick={handleCtaClick}
                className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-10 py-4 text-lg mb-6 rounded-full shadow-lg transform hover:scale-105 transition-all"
              >
                {customAdConfig.ctaText}
              </Button>

              {/* Skip Section */}
              <div className="flex items-center justify-center gap-4">
                {canSkip ? (
                  <Button
                    onClick={handleCustomSkip}
                    variant="outline"
                    className="border-white/40 text-white hover:bg-white/10 px-6 py-2 rounded-full"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Skip Ad
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 text-lg opacity-80">
                    <Clock className="w-5 h-5" />
                    Skip in {skipCountdown}s
                  </div>
                )}
              </div>
            </div>

            {/* Ad Indicator */}
            <div className="absolute top-6 left-6">
              <Badge variant="secondary" className="bg-black/50 text-white px-3 py-1">
                Advertisement
              </Badge>
            </div>

            {/* Phase Indicator (Debug) */}
            {process.env.NODE_ENV === "development" && (
              <div className="absolute top-6 right-6">
                <Badge variant="outline" className="text-white border-white/30">
                  Phase: {adPhase}
                </Badge>
              </div>
            )}

            {/* Volume Control Passthrough */}
            <div className="absolute bottom-6 left-6">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 rounded-full"
                onClick={() => {
                  // Pass volume control to original video
                  const iframe = iframeRef.current
                  if (iframe?.contentWindow) {
                    iframe.contentWindow.postMessage({ action: "toggleMute" }, "*")
                  }
                }}
              >
                <Volume2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-900 p-3 flex justify-between items-center text-white text-sm">
        <div className="flex items-center gap-4">
          <span>Status: {adPhase}</span>
          {showCustomAd && (
            <Badge variant="outline" className="text-green-400 border-green-400">
              Custom Ad Active
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Skip Sync: Ready</span>
          <span>•</span>
          <span>Z-Index: 50</span>
        </div>
      </div>
    </Card>
  )
}
