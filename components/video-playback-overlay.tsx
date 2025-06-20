"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Volume2, Clock, SkipForward, X } from "lucide-react"

interface VideoPlaybackOverlayProps {
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

export default function VideoPlaybackOverlay({ video }: VideoPlaybackOverlayProps) {
  const [videoStarted, setVideoStarted] = useState(false)
  const [showCustomOverlay, setShowCustomOverlay] = useState(false)
  const [skipCountdown, setSkipCountdown] = useState(6)
  const [canSkip, setCanSkip] = useState(false)
  const [adDetected, setAdDetected] = useState(false)
  const [originalSkipButton, setOriginalSkipButton] = useState<HTMLElement | null>(null)
  const [playbackDetected, setPlaybackDetected] = useState(false)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playbackDetectionRef = useRef<NodeJS.Timeout | null>(null)
  const adDetectionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const overlayTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [customAdConfig] = useState<CustomAdConfig>({
    brandName: "StreamHub Premium",
    brandLogo: "/placeholder.svg?height=40&width=120&text=BRAND",
    adTitle: "Upgrade to Premium Experience",
    adDescription: "Enjoy unlimited streaming with no interruptions and exclusive content access.",
    ctaText: "Start Free Trial",
    ctaUrl: "/premium",
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    textColor: "#ffffff",
    skipDelay: 6,
  })

  // Detect when video playback starts
  const detectVideoPlayback = useCallback(() => {
    if (!iframeRef.current || playbackDetected) return

    try {
      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

      if (iframeDoc) {
        // Look for video elements that are playing
        const videoElements = iframeDoc.querySelectorAll("video")
        const playingVideo = Array.from(videoElements).find((video) => !video.paused && video.currentTime > 0)

        // Look for play button disappearance (YouTube specific)
        const playButtons = iframeDoc.querySelectorAll(".ytp-large-play-button, .ytp-play-button")
        const playButtonHidden = Array.from(playButtons).some((btn) => {
          const htmlBtn = btn as HTMLElement
          return htmlBtn.style.display === "none" || htmlBtn.offsetParent === null
        })

        // Look for player state indicators
        const playerContainer = iframeDoc.querySelector(".html5-video-player, .video-player")
        const hasPlayingClass =
          playerContainer?.classList.contains("playing-mode") ||
          playerContainer?.classList.contains("unstarted-mode") === false

        if (playingVideo || playButtonHidden || hasPlayingClass) {
          console.log("Video playback detected!")
          setPlaybackDetected(true)
          setVideoStarted(true)

          // Show overlay after 2 seconds of playback
          overlayTimeoutRef.current = setTimeout(() => {
            setShowCustomOverlay(true)
            setSkipCountdown(customAdConfig.skipDelay)
            setCanSkip(false)
            startCountdown()
          }, 2000)
        }
      } else {
        // Cross-origin iframe - use timing-based detection
        const loadTime = iframe.dataset.loadTime ? Number.parseInt(iframe.dataset.loadTime) : Date.now()
        const timeSinceLoad = Date.now() - loadTime

        // Assume playback started after 3 seconds (user had time to click play)
        if (timeSinceLoad > 3000 && !playbackDetected) {
          console.log("Video playback assumed (cross-origin)")
          setPlaybackDetected(true)
          setVideoStarted(true)

          // Show overlay after additional delay
          overlayTimeoutRef.current = setTimeout(() => {
            setShowCustomOverlay(true)
            setSkipCountdown(customAdConfig.skipDelay)
            setCanSkip(false)
            startCountdown()
          }, 2000)
        }
      }
    } catch (error) {
      console.log("Playback detection error:", error)
      // Fallback to timing-based detection
      const iframe = iframeRef.current
      if (iframe) {
        const loadTime = iframe.dataset.loadTime ? Number.parseInt(iframe.dataset.loadTime) : Date.now()
        const timeSinceLoad = Date.now() - loadTime

        if (timeSinceLoad > 4000 && !playbackDetected) {
          setPlaybackDetected(true)
          setVideoStarted(true)

          overlayTimeoutRef.current = setTimeout(() => {
            setShowCustomOverlay(true)
            setSkipCountdown(customAdConfig.skipDelay)
            setCanSkip(false)
            startCountdown()
          }, 2000)
        }
      }
    }
  }, [playbackDetected, customAdConfig.skipDelay])

  // Get ad detection patterns for different platforms
  const getAdDetectionPatterns = (hostname: string) => {
    if (hostname.includes("youtube")) {
      return {
        skipButtons: [
          ".ytp-ad-skip-button",
          ".ytp-skip-ad-button",
          ".skip-button",
          '[aria-label*="Skip"]',
          '[aria-label*="skip"]',
          ".ytp-ad-skip-button-modern",
        ],
        adContainers: [".ytp-ad-overlay-container", ".ytp-ad-text-overlay", ".ytp-ad-player-overlay", ".video-ads"],
      }
    } else if (hostname.includes("lesbian8") || hostname.includes("pornhub") || hostname.includes("xvideos")) {
      return {
        skipButtons: [
          '[class*="skip"]',
          '[id*="skip"]',
          ".skip-ad",
          ".close-ad",
          ".ad-skip",
          'button[onclick*="skip"]',
          '[data-action="skip"]',
        ],
        adContainers: ['[class*="ad-"]', '[id*="ad-"]', ".advertisement", ".overlay", ".popup-ad"],
      }
    } else {
      return {
        skipButtons: ['[class*="skip"]', ".skip-ad", ".close-ad", '[aria-label*="skip"]'],
        adContainers: ['[class*="ad-"]', '[id*="ad-"]', ".advertisement", ".sponsor"],
      }
    }
  }

  // Detect and store original skip button
  const detectOriginalSkipButton = useCallback(() => {
    if (!iframeRef.current || !showCustomOverlay) return

    try {
      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

      if (iframeDoc) {
        const url = new URL(video.embedUrl)
        const patterns = getAdDetectionPatterns(url.hostname)

        // Find visible skip buttons
        for (const selector of patterns.skipButtons) {
          const skipButton = iframeDoc.querySelector(selector) as HTMLElement
          if (skipButton && skipButton.offsetParent !== null) {
            console.log(`Found original skip button: ${selector}`)
            setOriginalSkipButton(skipButton)

            // Check if skip is immediately available
            if (!skipButton.hasAttribute("disabled") && !skipButton.classList.contains("disabled")) {
              setCanSkip(true)
              setSkipCountdown(0)
            }
            break
          }
        }
      }
    } catch (error) {
      console.log("Skip button detection error:", error)
    }
  }, [video.embedUrl, showCustomOverlay])

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

  // Handle custom overlay skip with DOM manipulation
  const handleCustomSkip = useCallback(() => {
    console.log("Custom overlay skip clicked - performing DOM manipulation")

    const performDOMSkip = () => {
      if (!iframeRef.current) return false

      try {
        const iframe = iframeRef.current
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

        if (iframeDoc) {
          // Method 1: Click stored skip button
          if (originalSkipButton && originalSkipButton.offsetParent !== null) {
            console.log("Clicking stored original skip button")
            originalSkipButton.click()
            return true
          }

          // Method 2: Find and click any available skip button
          const url = new URL(video.embedUrl)
          const patterns = getAdDetectionPatterns(url.hostname)

          for (const selector of patterns.skipButtons) {
            const skipButton = iframeDoc.querySelector(selector) as HTMLElement
            if (
              skipButton &&
              skipButton.offsetParent !== null &&
              !skipButton.hasAttribute("disabled") &&
              !skipButton.classList.contains("disabled")
            ) {
              console.log(`DOM manipulation: Clicking skip button ${selector}`)

              // Create and dispatch click event
              const clickEvent = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: iframeDoc.defaultView,
              })

              skipButton.dispatchEvent(clickEvent)

              // Also try direct click
              skipButton.click()

              return true
            }
          }

          // Method 3: Try keyboard shortcuts
          const videoElement = iframeDoc.querySelector("video")
          if (videoElement) {
            console.log("DOM manipulation: Trying keyboard shortcuts")

            // Try Tab key (common skip shortcut)
            const tabEvent = new KeyboardEvent("keydown", {
              key: "Tab",
              code: "Tab",
              bubbles: true,
            })
            videoElement.dispatchEvent(tabEvent)

            // Try Space key
            const spaceEvent = new KeyboardEvent("keydown", {
              key: " ",
              code: "Space",
              bubbles: true,
            })
            videoElement.dispatchEvent(spaceEvent)
          }

          // Method 4: Try to manipulate ad elements directly
          const adContainers = patterns.adContainers
          for (const selector of adContainers) {
            const adElements = iframeDoc.querySelectorAll(selector)
            adElements.forEach((element) => {
              const htmlElement = element as HTMLElement
              if (htmlElement.offsetParent !== null) {
                console.log(`DOM manipulation: Hiding ad element ${selector}`)
                htmlElement.style.display = "none"
                htmlElement.style.visibility = "hidden"
                htmlElement.remove()
              }
            })
          }
        } else {
          // Cross-origin iframe - use postMessage
          console.log("DOM manipulation: Using postMessage for cross-origin")

          iframe.contentWindow?.postMessage(
            {
              action: "skipAd",
              method: "click",
              source: "customOverlay",
            },
            "*",
          )

          // Try multiple message formats
          iframe.contentWindow?.postMessage(
            {
              type: "skip_ad",
              skip: true,
            },
            "*",
          )

          iframe.contentWindow?.postMessage("skip_ad", "*")

          return true
        }
      } catch (error) {
        console.log("DOM manipulation error:", error)

        // Final fallback: try postMessage
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            {
              action: "skipAd",
              fallback: true,
            },
            "*",
          )
        }
      }

      return false
    }

    // Perform skip with retries
    const success = performDOMSkip()

    if (!success) {
      // Retry after short delays
      setTimeout(() => performDOMSkip(), 200)
      setTimeout(() => performDOMSkip(), 500)
      setTimeout(() => performDOMSkip(), 1000)
    }

    // Hide our overlay
    setShowCustomOverlay(false)
    setOriginalSkipButton(null)
    stopCountdown()

    // Track skip event
    console.log("Custom overlay skipped, original ad skip attempted")
  }, [originalSkipButton, video.embedUrl, stopCountdown])

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

  // Setup playback detection
  useEffect(() => {
    if (!playbackDetected) {
      playbackDetectionRef.current = setInterval(detectVideoPlayback, 1000)
    }

    return () => {
      if (playbackDetectionRef.current) {
        clearInterval(playbackDetectionRef.current)
      }
    }
  }, [detectVideoPlayback, playbackDetected])

  // Setup skip button detection when overlay is shown
  useEffect(() => {
    if (showCustomOverlay) {
      adDetectionIntervalRef.current = setInterval(detectOriginalSkipButton, 500)
    }

    return () => {
      if (adDetectionIntervalRef.current) {
        clearInterval(adDetectionIntervalRef.current)
      }
    }
  }, [detectOriginalSkipButton, showCustomOverlay])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCountdown()
      if (playbackDetectionRef.current) {
        clearInterval(playbackDetectionRef.current)
      }
      if (adDetectionIntervalRef.current) {
        clearInterval(adDetectionIntervalRef.current)
      }
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current)
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

        {/* Custom Ad Overlay - Only Shows After Video Starts */}
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

            {/* Close Button */}
            <div className="absolute top-6 right-6">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCustomSkip}
                className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
                disabled={!canSkip}
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
          <span>Playback: {videoStarted ? "Started" : "Waiting"}</span>
          {showCustomOverlay && (
            <Badge variant="outline" className="text-green-400 border-green-400">
              Overlay Active
            </Badge>
          )}
          {originalSkipButton && (
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              Skip Button Found
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Skip Delay: 6s</span>
          <span>•</span>
          <span>DOM Manipulation: Ready</span>
        </div>
      </div>
    </Card>
  )
}
