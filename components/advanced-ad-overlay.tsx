"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Volume2, Clock } from "lucide-react"

interface AdvancedAdOverlayProps {
  video: {
    id: string
    title: string
    embedUrl: string
    thumbnail: string
  }
}

interface AdState {
  isActive: boolean
  duration: number
  skipTime: number
  canSkip: boolean
  countdown: number
  type: "preroll" | "midroll" | "overlay" | "unknown"
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
}

export default function AdvancedAdOverlay({ video }: AdvancedAdOverlayProps) {
  const [adState, setAdState] = useState<AdState>({
    isActive: false,
    duration: 0,
    skipTime: 5,
    canSkip: false,
    countdown: 5,
    type: "unknown",
  })

  const [customAdConfig] = useState<CustomAdConfig>({
    brandName: "StreamHub Premium",
    brandLogo: "/placeholder.svg?height=40&width=120&text=BRAND",
    adTitle: "Upgrade to Premium Experience",
    adDescription: "Enjoy unlimited streaming with no interruptions and exclusive content access.",
    ctaText: "Start Free Trial",
    ctaUrl: "/premium",
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    textColor: "#ffffff",
  })

  const [showCustomAd, setShowCustomAd] = useState(false)
  const [adDetectionActive, setAdDetectionActive] = useState(true)
  const [originalAdSkipped, setOriginalAdSkipped] = useState(false)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const adDetectionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const skipSyncTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Ad detection patterns for different platforms
  const adDetectionPatterns = {
    youtube: {
      adSelectors: [
        ".ytp-ad-overlay-container",
        ".ytp-ad-text-overlay",
        ".video-ads",
        ".ytp-ad-player-overlay",
        ".ytp-ad-skip-button-container",
      ],
      skipButtonSelectors: [".ytp-ad-skip-button", ".ytp-skip-ad-button", ".skip-button"],
      adIndicators: [".ytp-ad-duration-remaining", ".ytp-ad-text", 'span[class*="ad-"]'],
    },
    generic: {
      adSelectors: ['[class*="ad-"]', '[id*="ad-"]', ".advertisement", ".sponsor", ".promoted"],
      skipButtonSelectors: ['[class*="skip"]', ".skip-ad", ".close-ad", '[aria-label*="skip"]'],
      adIndicators: [".ad-timer", ".ad-countdown", '[class*="duration"]'],
    },
  }

  // Detect ad state from iframe content
  const detectAdState = useCallback(() => {
    if (!iframeRef.current || !adDetectionActive) return

    try {
      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

      if (!iframeDoc) {
        // Cross-origin iframe - use alternative detection methods
        detectAdStateAlternative()
        return
      }

      const url = new URL(video.embedUrl)
      const platform = url.hostname.includes("youtube") ? "youtube" : "generic"
      const patterns = adDetectionPatterns[platform]

      // Check for ad elements
      const adElements = patterns.adSelectors.some((selector) => iframeDoc.querySelector(selector))

      const skipButtons = patterns.skipButtonSelectors
        .map((selector) => iframeDoc.querySelector(selector))
        .filter(Boolean)

      const adIndicators = patterns.adIndicators.map((selector) => iframeDoc.querySelector(selector)).filter(Boolean)

      if (adElements || skipButtons.length > 0) {
        // Ad detected
        const skipButton = skipButtons[0] as HTMLElement
        const canSkip = skipButton && !skipButton.hasAttribute("disabled")

        // Extract countdown from ad indicators
        let countdown = 5
        if (adIndicators.length > 0) {
          const indicator = adIndicators[0] as HTMLElement
          const text = indicator.textContent || ""
          const match = text.match(/(\d+)/)
          if (match) {
            countdown = Number.parseInt(match[1])
          }
        }

        setAdState((prev) => ({
          ...prev,
          isActive: true,
          canSkip,
          countdown: canSkip ? 0 : countdown,
          type: "preroll",
        }))

        if (!showCustomAd) {
          setShowCustomAd(true)
        }
      } else {
        // No ad detected
        if (adState.isActive) {
          setAdState((prev) => ({ ...prev, isActive: false }))
          setShowCustomAd(false)
        }
      }
    } catch (error) {
      console.log("Ad detection error:", error)
      detectAdStateAlternative()
    }
  }, [video.embedUrl, adDetectionActive, adState.isActive, showCustomAd])

  // Alternative ad detection for cross-origin iframes
  const detectAdStateAlternative = useCallback(() => {
    // Use timing-based detection
    const currentTime = Date.now()
    const timeSinceLoad =
      currentTime -
      (iframeRef.current?.dataset.loadTime ? Number.parseInt(iframeRef.current.dataset.loadTime) : currentTime)

    // Most video ads appear within first 10 seconds
    if (timeSinceLoad < 10000 && !showCustomAd) {
      setAdState((prev) => ({
        ...prev,
        isActive: true,
        canSkip: timeSinceLoad > 5000,
        countdown: Math.max(0, 5 - Math.floor(timeSinceLoad / 1000)),
        type: "preroll",
      }))
      setShowCustomAd(true)

      // Auto-hide after typical ad duration
      setTimeout(() => {
        setShowCustomAd(false)
        setAdState((prev) => ({ ...prev, isActive: false }))
      }, 15000)
    }
  }, [showCustomAd])

  // Sync skip action with original ad
  const handleCustomSkip = useCallback(() => {
    if (!iframeRef.current) return

    try {
      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

      if (iframeDoc) {
        // Try to find and click the original skip button
        const url = new URL(video.embedUrl)
        const platform = url.hostname.includes("youtube") ? "youtube" : "generic"
        const patterns = adDetectionPatterns[platform]

        for (const selector of patterns.skipButtonSelectors) {
          const skipButton = iframeDoc.querySelector(selector) as HTMLElement
          if (skipButton && !skipButton.hasAttribute("disabled")) {
            skipButton.click()
            setOriginalAdSkipped(true)
            break
          }
        }
      } else {
        // Cross-origin iframe - use postMessage or other methods
        iframe.contentWindow?.postMessage({ action: "skipAd" }, "*")
      }
    } catch (error) {
      console.log("Skip sync error:", error)
    }

    // Hide custom ad
    setShowCustomAd(false)
    setAdState((prev) => ({ ...prev, isActive: false }))
  }, [video.embedUrl])

  // Handle CTA click
  const handleCtaClick = () => {
    // Track engagement
    console.log("Custom ad CTA clicked")

    // Open CTA URL
    window.open(customAdConfig.ctaUrl, "_blank")

    // Also skip the original ad
    handleCustomSkip()
  }

  // Setup ad detection
  useEffect(() => {
    if (adDetectionActive) {
      adDetectionIntervalRef.current = setInterval(detectAdState, 500)
    }

    return () => {
      if (adDetectionIntervalRef.current) {
        clearInterval(adDetectionIntervalRef.current)
      }
    }
  }, [detectAdState, adDetectionActive])

  // Countdown timer for skip button
  useEffect(() => {
    if (adState.isActive && !adState.canSkip && adState.countdown > 0) {
      const timer = setTimeout(() => {
        setAdState((prev) => ({
          ...prev,
          countdown: prev.countdown - 1,
          canSkip: prev.countdown <= 1,
        }))
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [adState.isActive, adState.canSkip, adState.countdown])

  // Handle iframe load
  const handleIframeLoad = () => {
    if (iframeRef.current) {
      iframeRef.current.dataset.loadTime = Date.now().toString()
    }
  }

  return (
    <Card className="overflow-hidden bg-black border-gray-200 relative">
      <div className="relative aspect-video">
        {/* Original Video Iframe */}
        <iframe
          ref={iframeRef}
          width="100%"
          height="100%"
          src={video.embedUrl}
          title={video.title}
          frameBorder="0"
          allowFullScreen
          onLoad={handleIframeLoad}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />

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
            <div className="max-w-md mx-auto text-center p-8">
              {/* Brand Logo */}
              <img
                src={customAdConfig.brandLogo || "/placeholder.svg"}
                alt={customAdConfig.brandName}
                className="h-10 mx-auto mb-4"
              />

              {/* Ad Title */}
              <h2 className="text-2xl font-bold mb-3">{customAdConfig.adTitle}</h2>

              {/* Ad Description */}
              <p className="text-lg opacity-90 mb-6">{customAdConfig.adDescription}</p>

              {/* CTA Button */}
              <Button
                onClick={handleCtaClick}
                className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-3 text-lg mb-4"
              >
                {customAdConfig.ctaText}
              </Button>

              {/* Skip Section */}
              <div className="flex items-center justify-center gap-4 mt-6">
                {adState.canSkip ? (
                  <Button
                    onClick={handleCustomSkip}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Skip Ad
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 text-sm opacity-75">
                    <Clock className="w-4 h-4" />
                    Skip in {adState.countdown}s
                  </div>
                )}
              </div>
            </div>

            {/* Ad Indicator */}
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-black/50 text-white">
                Advertisement
              </Badge>
            </div>

            {/* Volume Control Passthrough */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => {
                  // Pass volume control to original video
                  const iframe = iframeRef.current
                  if (iframe?.contentWindow) {
                    iframe.contentWindow.postMessage({ action: "toggleMute" }, "*")
                  }
                }}
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Ad Detection Status (Debug) */}
        {process.env.NODE_ENV === "development" && (
          <div className="absolute top-4 right-4 z-40">
            <Badge variant={adState.isActive ? "default" : "secondary"}>
              {adState.isActive ? `Ad Active (${adState.type})` : "No Ad"}
            </Badge>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="bg-gray-900 p-3 flex justify-between items-center text-white text-sm">
        <div className="flex items-center gap-4">
          <span>Custom Ad Overlay: {showCustomAd ? "Active" : "Inactive"}</span>
          {originalAdSkipped && (
            <Badge variant="outline" className="text-green-400 border-green-400">
              Original Ad Skipped
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAdDetectionActive(!adDetectionActive)}
            className="text-xs"
          >
            Detection: {adDetectionActive ? "ON" : "OFF"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setShowCustomAd(!showCustomAd)
              setAdState((prev) => ({ ...prev, isActive: !showCustomAd, canSkip: true }))
            }}
            className="text-xs"
          >
            Test Overlay
          </Button>
        </div>
      </div>
    </Card>
  )
}
