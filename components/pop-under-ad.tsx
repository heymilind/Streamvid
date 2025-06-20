"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PopUnderAdProps {
  onClose: () => void
}

export default function PopUnderAd({ onClose }: PopUnderAdProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-sm text-gray-500 uppercase tracking-wide">Advertisement</span>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 text-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 mb-4">
            <div className="text-3xl font-bold mb-2">🎬</div>
            <div className="text-xl font-bold mb-2">Premium Streaming</div>
            <div className="text-sm opacity-90">Upgrade to Premium for ad-free viewing</div>
          </div>

          <h3 className="text-lg font-semibold mb-2">Enjoy Unlimited Streaming</h3>
          <p className="text-gray-600 mb-4">
            Get access to exclusive content, HD quality, and no advertisements with our premium subscription.
          </p>

          <div className="flex gap-2">
            <Button className="flex-1">Learn More</Button>
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Maybe Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
