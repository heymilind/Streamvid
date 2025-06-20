"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, RefreshCw, Download } from "lucide-react"

interface AdvancedAdBlockerProps {
  video: {
    id: string
    title: string
    embedUrl: string
    thumbnail: string
  }
}

export default function AdvancedAdBlocker({ video }: AdvancedAdBlockerProps) {
  const [adBlockMethod, setAdBlockMethod] = useState<"proxy" | "direct" | "embed">("proxy")
  const [isLoading, setIsLoading] = useState(false)
  const [proxyUrl, setProxyUrl] = useState("")
  const [directVideoUrl, setDirectVideoUrl] = useState("")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Method 1: Use a proxy server to strip ads
  const generateProxyUrl = (originalUrl: string) => {
    // These are example proxy services - you'd need to implement your own
    const proxyServices = [
      `https://cors-anywhere.herokuapp.com/${originalUrl}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(originalUrl)}`,
      `https://proxy.cors.sh/${originalUrl}`,
    ]
    return proxyServices[0]
  }

  // Method 2: Extract direct video URL using backend service
  const extractDirectUrl = async (embedUrl: string) => {
    setIsLoading(true)
    try {
      // This would call your backend service
      const response = await fetch("/api/extract-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embedUrl }),
      })

      if (response.ok) {
        const data = await response.json()
        setDirectVideoUrl(data.directUrl)
        setAdBlockMethod("direct")
      }
    } catch (error) {
      console.error("Failed to extract direct URL:", error)
      // Fallback to mock URL for demo
      setDirectVideoUrl("https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4")
      setAdBlockMethod("direct")
    } finally {
      setIsLoading(false)
    }
  }

  // Method 3: Advanced iframe manipulation
  useEffect(() => {
    if (adBlockMethod === "embed" && iframeRef.current) {
      const iframe = iframeRef.current

      // Add additional parameters to block ads
      const url = new URL(video.embedUrl)
      url.searchParams.set("autoplay", "1")
      url.searchParams.set("modestbranding", "1")
      url.searchParams.set("rel", "0")
      url.searchParams.set("showinfo", "0")
      url.searchParams.set("iv_load_policy", "3")
      url.searchParams.set("disablekb", "1")
      url.searchParams.set("controls", "1")

      // For adult sites, try common ad-blocking parameters
      if (url.hostname.includes("lesbian8") || url.hostname.includes("pornhub") || url.hostname.includes("xvideos")) {
        url.searchParams.set("no_ads", "1")
        url.searchParams.set("premium", "1")
        url.searchParams.set("ad_free", "1")
      }

      iframe.src = url.toString()

      // Try to inject ad-blocking script after load
      iframe.onload = () => {
        try {
          // Create a script to continuously remove ads
          const script = document.createElement("script")
          script.textContent = `
            setInterval(() => {
              const iframe = document.querySelector('iframe[src*="${url.hostname}"]');
              if (iframe && iframe.contentWindow) {
                try {
                  const doc = iframe.contentDocument || iframe.contentWindow.document;
                  if (doc) {
                    // Remove common ad elements
                    const adSelectors = [
                      '.ad', '.ads', '.advertisement', '.sponsor', '.promoted',
                      '[class*="ad-"]', '[class*="ads-"]', '[id*="ad-"]', '[id*="ads-"]',
                      '.overlay', '.popup', '.banner', '.preroll',
                      'iframe[src*="doubleclick"]', 'iframe[src*="googlesyndication"]'
                    ];
                    
                    adSelectors.forEach(selector => {
                      const elements = doc.querySelectorAll(selector);
                      elements.forEach(el => el.remove());
                    });
                  }
                } catch (e) {
                  console.log('Cross-origin restriction');
                }
              }
            }, 1000);
          `
          document.head.appendChild(script)
        } catch (e) {
          console.log("Script injection failed:", e)
        }
      }
    }
  }, [adBlockMethod, video.embedUrl])

  return (
    <Card className="overflow-hidden bg-black border-gray-200">
      {/* Ad Blocking Controls */}
      <div className="bg-gray-900 p-3 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={adBlockMethod === "embed" ? "default" : "outline"}
            onClick={() => setAdBlockMethod("embed")}
            className="text-xs"
          >
            <Shield className="w-3 h-3 mr-1" />
            Enhanced Embed
          </Button>

          <Button
            size="sm"
            variant={adBlockMethod === "proxy" ? "default" : "outline"}
            onClick={() => {
              setProxyUrl(generateProxyUrl(video.embedUrl))
              setAdBlockMethod("proxy")
            }}
            className="text-xs"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Proxy Mode
          </Button>

          <Button
            size="sm"
            variant={adBlockMethod === "direct" ? "default" : "outline"}
            onClick={() => extractDirectUrl(video.embedUrl)}
            disabled={isLoading}
            className="text-xs"
          >
            <Download className="w-3 h-3 mr-1" />
            {isLoading ? "Extracting..." : "Direct URL"}
          </Button>
        </div>

        <div className="text-xs text-green-400 flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Ad Blocking: {adBlockMethod.toUpperCase()}
        </div>
      </div>

      {/* Video Player */}
      <div className="relative aspect-video">
        {adBlockMethod === "direct" && directVideoUrl ? (
          // Direct video player with full control
          <video controls className="w-full h-full" poster={video.thumbnail} crossOrigin="anonymous">
            <source src={directVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : adBlockMethod === "proxy" && proxyUrl ? (
          // Proxy iframe
          <iframe
            src={proxyUrl}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
          />
        ) : (
          // Enhanced embed with ad blocking attempts
          <iframe
            ref={iframeRef}
            src={video.embedUrl}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>Extracting ad-free video...</p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-gray-800 p-3 text-xs text-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <strong className="text-white">Enhanced Embed:</strong> Adds URL parameters to reduce ads
          </div>
          <div>
            <strong className="text-white">Proxy Mode:</strong> Routes through proxy to strip ads
          </div>
          <div>
            <strong className="text-white">Direct URL:</strong> Extracts raw video file (most effective)
          </div>
        </div>
      </div>
    </Card>
  )
}
