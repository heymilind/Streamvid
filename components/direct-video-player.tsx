"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import Hls from "hls.js"

interface DirectVideoPlayerProps {
  src: string
  poster?: string
  autoPlay?: boolean
  muted?: boolean
  controls?: boolean
  loop?: boolean
  className?: string
}

const DirectVideoPlayer: React.FC<DirectVideoPlayerProps> = ({
  src,
  poster,
  autoPlay = false,
  muted = false,
  controls = true,
  loop = false,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let hls: Hls | null = null

    const video = videoRef.current

    if (video) {
      if (Hls.isSupported()) {
        hls = new Hls()
        hls.loadSource(src)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false)
          if (autoPlay) {
            video.play().catch((e) => {
              console.error("Autoplay failed:", e)
            })
          }
        })
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error:", data)
          setError(`HLS error: ${data.type} - ${data.details}`)
          setIsLoading(false)
        })
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src
        video.addEventListener("loadedmetadata", () => {
          setIsLoading(false)
          if (autoPlay) {
            video.play().catch((e) => {
              console.error("Autoplay failed:", e)
            })
          }
        })
        video.addEventListener("error", (e) => {
          console.error("Video error:", e)
          setError(`Video error: ${e}`)
          setIsLoading(false)
        })
      } else {
        setError("HLS is not supported in this browser.")
        setIsLoading(false)
      }
    }

    return () => {
      if (hls) {
        hls.destroy()
      }
    }
  }, [src, autoPlay])

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className={`w-full h-full object-contain ${className}`}
        poster={poster}
        muted={muted}
        controls={controls}
        loop={loop}
        preload="metadata"
      />
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      {error && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-red-500/50 text-white">
          {error}
        </div>
      )}
    </div>
  )
}

export default DirectVideoPlayer
