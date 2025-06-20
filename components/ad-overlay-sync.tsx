"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Volume2, Clock, SkipForward, X } from "lucide-react"

interface AdOverlaySyncProps {
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
  skipDelay: number
}

export default function AdOverlaySync({ video }: AdOverlaySyncProps) {
  const [showCustomOverlay, setShowCustomOverlay] = useState(false)
  const [skipCountdown, setSkipCountdown] = useState(5)
  const [canSkip, setCanSkip] = useState(false)
  const [adDetected, setAdDetected] = useState(false)
  const [originalSkipButton, setOriginalSkipButton] = useState<HTMLElement | null>(null)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const adDetectionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)

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

  // Ad detection patterns for different platforms
  const getAdDetectionPatterns = (hostname: string) => {
    if (hostname.includes("youtube")) {
      return {
        adContainers: [
          ".ytp-ad-overlay-container",
          ".ytp-ad-text-overlay",
          ".ytp-ad-player-overlay",
          ".video-ads",
          '[class*="ad-overlay"]',
        ],
        skipButtons: [
          ".ytp-ad-skip-button",
          ".ytp-skip-ad-button",
          ".skip-button",
          '[aria-label*="Skip"]',
          '[aria-label*="skip"]',
        ],
        adIndicators: [".ytp-ad-duration-remaining", ".ytp-ad-text", '[class*="ad-duration"]', ".ad-countdown"],
      }
    } else if (hostname.includes("lesbian8") || hostname.includes("pornhub") || hostname.includes("xvideos")) {
      return {
        adContainers: ['[class*="ad-"]', '[id*="ad-"]', ".advertisement", ".sponsor", ".overlay", ".popup-ad"],
        skipButtons: [
          '[class*="skip"]',
          '[id*="skip"]',
          ".skip-ad",
          ".close-ad",
          ".ad-skip",
          'button[onclick*="skip"]',
        ],
        adIndicators: [".ad-timer", ".countdown", '[class*="timer"]', '[class*="duration"]'],
      }
    } else {
      return {
        adContainers: ['[class*="ad-"]', '[id*="ad-"]', ".advertisement", ".sponsor", ".promoted"],
        skipButtons: ['[class*="skip"]', ".skip-ad", ".close-ad", '[aria-label*="skip"]'],
        adIndicators: [".ad-timer", ".ad-countdown", '[class*="duration"]'],
      }
    }
  }

  // Detect when original video ad starts
  const detectAdStart = useCallback(() => {
    if (!iframeRef.current) return

    try {
      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

      if (!iframeDoc) {
        // Cross-origin iframe - use alternative detection
        detectAdAlternative()
        return
      }

      const url = new URL(video.embedUrl)
      const patterns = getAdDetectionPatterns(url.hostname)

      // Check for ad containers
      const adContainers = patterns.adContainers.some((selector) => {
        const elements = iframeDoc.querySelectorAll(selector)
        return Array.from(elements).some((el) => {
          const htmlEl = el as HTMLElement
          return htmlEl.offsetParent !== null && htmlEl.offsetWidth > 0 && htmlEl.offsetHeight > 0
        })
      })

      // Check for skip buttons
      const skipButtons = patterns.skipButtons
        .map((selector) => iframeDoc.querySelector(selector) as HTMLElement)
        .filter((btn) => btn && btn.offsetParent !== null)

      if (adContainers || skipButtons.length > 0) {
        if (!adDetected) {
          console.log("Ad detected in original video!")
          setAdDetected(true)
          setShowCustomOverlay(true)
          setSkipCountdown(customAdConfig.skipDelay)
          setCanSkip(false)
          startCountdown()

          // Store reference to original skip button
          if (skipButtons.length > 0) {
            setOriginalSkipButton(skipButtons[0])
          }
        }

        // Update skip button availability
        const activeSkipButton = skipButtons.find((btn) => !btn.hasAttribute("disabled"))
        if (activeSkipButton && !canSkip) {
          setCanSkip(true)
          setSkipCountdown(0)
        }
      } else {
        // No ad detected - hide overlay if it was showing
        if (adDetected) {
          console.log("Ad ended in original video")
          setAdDetected(false)
          setShowCustomOverlay(false)
          setOriginalSkipButton(null)
          stopCountdown()
        }
      }
    } catch (error) {
      console.log("Cross-origin restriction, using alternative detection")
      detectAdAlternative()
    }
  }, [video.embedUrl, adDetected, canSkip, customAdConfig.skipDelay])

  // Alternative ad detection for cross-origin iframes
  const detectAdAlternative = useCallback(() => {
    // Monitor iframe for common ad behavior patterns
    if (!iframeRef.current) return

    const iframe = iframeRef.current

    // Listen for iframe size changes (ads often resize)
    const observer = new ResizeObserver(() => {
      // Ad might be loading
      if (!adDetected) {
        // Use timing-based detection - most ads appear within first 10 seconds
        const loadTime = iframe.dataset.loadTime ? Number.parseInt(iframe.dataset.loadTime) : Date.now()
        const timeSinceLoad = Date.now() - loadTime

        if (timeSinceLoad < 15000) {
          // Likely ad period
          setAdDetected(true)
          setShowCustomOverlay(true)
          setSkipCountdown(customAdConfig.skipDelay)
          setCanSkip(false)
          startCountdown()

          // Auto-detect skip availability after 5 seconds
          setTimeout(() => {
            setCanSkip(true)
            setSkipCountdown(0)
          }, 5000)

          // Auto-hide after typical ad duration
          setTimeout(() => {
            setAdDetected(false)
            setShowCustomOverlay(false)
            stopCountdown()
          }, 20000)
        }
      }
    })

    observer.observe(iframe)

    return () => observer.disconnect()
  }, [adDetected, customAdConfig.skipDelay])

  // Start countdown timer
  const startCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }

    let countdown = customAdConfig.skipDelay

    countdownIntervalRef.current = setInterval(() => {
      countdown -= 1
      setSkipCountdown(countdown)

      if (countdown <= 0) {
        setCanSkip(true)
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current)
        }
      }
    }, 1000)
  }, [customAdConfig.skipDelay])

  // Stop countdown timer
  const stopCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
  }, [])

  // Handle custom overlay skip
  const handleCustomSkip = useCallback(() => {
    console.log("Custom overlay skip clicked - syncing with original ad")

    // Try to click the original skip button
    const skipOriginalAd = () => {
      if (originalSkipButton) {
        console.log("Clicking stored original skip button")
        originalSkipButton.click()
        return true
      }

      // Fallback: try to find skip button again
      if (!iframeRef.current) return false

      try {
        const iframe = iframeRef.current
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

        if (iframeDoc) {
          const url = new URL(video.embedUrl)
          const patterns = getAdDetectionPatterns(url.hostname)

          for (const selector of patterns.skipButtons) {
            const skipButton = iframeDoc.querySelector(selector) as HTMLElement
            if (skipButton && skipButton.offsetParent !== null && !skipButton.hasAttribute("disabled")) {
              console.log(`Found and clicking skip button: ${selector}`)
              skipButton.click()
              return true
            }
          }
        } else {
          // Cross-origin iframe - use postMessage
          console.log("Using postMessage for cross-origin skip")
          iframe.contentWindow?.postMessage(
            {
              action: "skipAd",
              source: "customOverlay",
            },
            "*",
          )

          // Try keyboard shortcut
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
        console.log("Error clicking original skip button:", error)
      }

      return false
    }

    // Attempt to skip original ad
    const skipped = skipOriginalAd()

    if (!skipped) {
      // Retry after delays
      setTimeout(() => skipOriginalAd(), 300)
      setTimeout(() => skipOriginalAd(), 1000)
    }

    // Hide our overlay
    setShowCustomOverlay(false)
    setAdDetected(false)
    setOriginalSkipButton(null)
    stopCountdown()
  }, [originalSkipButton, video.embedUrl])

  // Handle CTA click
  const handleCtaClick = useCallback(() => {
    console.log("CTA clicked")

    // Track engagement
    window.gtag?.("event", "custom_overlay_cta_click", {
      video_id: video.id,
      ad_title: customAdConfig.adTitle,
    })

    // Open CTA URL
    window.open(customAdConfig.ctaUrl, "_blank")

    // Also skip the ad
    handleCustomSkip()
  }, [video.id, customAdConfig.adTitle, customAdConfig.ctaUrl, handleCustomSkip])

  // Setup ad detection
  useEffect(() => {
    adDetectionIntervalRef.current = setInterval(detectAdStart, 500)

    return () => {
      if (adDetectionIntervalRef.current) {
        clearInterval(adDetectionIntervalRef.current)
      }
    }
  }, [detectAdStart])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCountdown()
      if (adDetectionIntervalRef.current) {
        clearInterval(adDetectionIntervalRef.current)
      }
    }
  }, [stopCountdown])

  // Handle iframe load
  const handleIframeLoad = () => {
    if (iframeRef.current) {
      iframeRef.current.dataset.loadTime = Date.now().toString()
    }
  }

  return (
    <Card className="overflow-hidden bg-black border-gray-200 relative">
      <div className="relative aspect-video">
        {/* Original Video Iframe - Always Visible */}
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

        {/* Custom Ad Overlay - Only Shows When Ad Detected */}
        {showCustomOverlay && (
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

            {/* Close Button (Alternative Skip) */}
            <div className="absolute top-6 right-6">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCustomSkip}
                className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Volume Control Passthrough */}
            <div className="absolute bottom-6 left-6">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 rounded-full"
                onClick={() => {
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
          <span>Ad Detection: {adDetected ? "Active" : "Monitoring"}</span>
          {showCustomOverlay && (
            <Badge variant="outline" className="text-green-400 border-green-400">
              Custom Overlay Active
            </Badge>
          )}
          {originalSkipButton && (
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              Skip Button Synced
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Overlay Z-Index: 50</span>
          <span>•</span>
          <span>Detection: 500ms intervals</span>
        </div>
      </div>
    </Card>
  )
}
