"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdBannerProps {
  onSkip: () => void
  canSkip: boolean
  countdown: number
}

export default function AdBanner({ onSkip, canSkip, countdown }: AdBannerProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-gray-500 uppercase tracking-wide">Advertisement</span>
        {canSkip && (
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={onSkip}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="bg-gray-100 rounded aspect-video mb-3 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600 mb-1">AD</div>
          <div className="text-sm text-gray-500">Sample Advertisement</div>
        </div>
      </div>

      <div className="text-sm font-medium mb-2">Premium Video Streaming Service</div>
      <div className="text-xs text-gray-600 mb-3">Enjoy unlimited access to thousands of videos</div>

      {!canSkip ? (
        <div className="text-xs text-gray-500 text-center">Skip in {countdown}s</div>
      ) : (
        <Button size="sm" className="w-full" onClick={onSkip}>
          Skip Ad
        </Button>
      )}
    </div>
  )
}
