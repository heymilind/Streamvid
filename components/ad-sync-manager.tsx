"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SkipForward, Eye, EyeOff, Target, Zap } from "lucide-react"

interface AdSyncManagerProps {
  video: {
    id: string
    title: string
    embedUrl: string
    thumbnail: string
  }
}

interface AdMetrics {
  totalAdsDetected: number
  adsSkipped: number
  averageAdDuration: number
  customAdImpressions: number
  ctaClicks: number
  skipRate: number
}

export default function AdSyncManager({ video }: AdSyncManagerProps) {
  const [isActive, setIsActive] = useState(true)
  const [adMetrics, setAdMetrics] = useState<AdMetrics>({
    totalAdsDetected: 0,
    adsSkipped: 0,
    averageAdDuration: 0,
    customAdImpressions: 0,
    ctaClicks: 0,
    skipRate: 0,
  })

  const [currentAdProgress, setCurrentAdProgress] = useState(0)
  const [syncAccuracy, setSyncAccuracy] = useState(95)
  const [detectionMode, setDetectionMode] = useState<"aggressive" | "balanced" | "conservative">("balanced")

  const metricsRef = useRef<AdMetrics>(adMetrics)

  // Update metrics
  const updateMetrics = (update: Partial<AdMetrics>) => {
    const newMetrics = { ...metricsRef.current, ...update }
    metricsRef.current = newMetrics
    setAdMetrics(newMetrics)

    // Calculate skip rate
    if (newMetrics.totalAdsDetected > 0) {
      newMetrics.skipRate = (newMetrics.adsSkipped / newMetrics.totalAdsDetected) * 100
    }
  }

  // Simulate ad detection and sync
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      // Simulate ad progress
      setCurrentAdProgress((prev) => {
        if (prev >= 100) {
          // Ad completed
          updateMetrics({
            totalAdsDetected: metricsRef.current.totalAdsDetected + 1,
            customAdImpressions: metricsRef.current.customAdImpressions + 1,
          })
          return 0
        }
        return prev + Math.random() * 10
      })

      // Simulate sync accuracy fluctuation
      setSyncAccuracy((prev) => {
        const variation = (Math.random() - 0.5) * 4 // ±2%
        return Math.max(85, Math.min(99, prev + variation))
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isActive])

  const handleSkipSync = () => {
    updateMetrics({
      adsSkipped: metricsRef.current.adsSkipped + 1,
    })
    setCurrentAdProgress(100)
  }

  const handleCtaClick = () => {
    updateMetrics({
      ctaClicks: metricsRef.current.ctaClicks + 1,
    })
  }

  return (
    <Card className="p-4 bg-gray-900 text-white">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5" />
            Ad Sync Manager
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Active" : "Inactive"}</Badge>
            <Button size="sm" variant="outline" onClick={() => setIsActive(!isActive)}>
              {isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Current Ad Progress */}
        {currentAdProgress > 0 && currentAdProgress < 100 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Ad Progress</span>
              <span>{Math.round(currentAdProgress)}%</span>
            </div>
            <Progress value={currentAdProgress} className="h-2" />
          </div>
        )}

        {/* Sync Accuracy */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Sync Accuracy</span>
            <span className={syncAccuracy > 90 ? "text-green-400" : "text-yellow-400"}>{syncAccuracy.toFixed(1)}%</span>
          </div>
          <Progress value={syncAccuracy} className="h-2" />
        </div>

        {/* Detection Mode */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Detection Mode</label>
          <div className="flex gap-2">
            {(["aggressive", "balanced", "conservative"] as const).map((mode) => (
              <Button
                key={mode}
                size="sm"
                variant={detectionMode === mode ? "default" : "outline"}
                onClick={() => setDetectionMode(mode)}
                className="capitalize"
              >
                {mode}
              </Button>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="text-gray-400">Ads Detected</div>
            <div className="text-xl font-bold">{adMetrics.totalAdsDetected}</div>
          </div>

          <div className="space-y-1">
            <div className="text-gray-400">Ads Skipped</div>
            <div className="text-xl font-bold text-green-400">{adMetrics.adsSkipped}</div>
          </div>

          <div className="space-y-1">
            <div className="text-gray-400">Custom Impressions</div>
            <div className="text-xl font-bold text-blue-400">{adMetrics.customAdImpressions}</div>
          </div>

          <div className="space-y-1">
            <div className="text-gray-400">CTA Clicks</div>
            <div className="text-xl font-bold text-purple-400">{adMetrics.ctaClicks}</div>
          </div>
        </div>

        {/* Skip Rate */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Skip Rate</span>
            <span>{adMetrics.skipRate.toFixed(1)}%</span>
          </div>
          <Progress value={adMetrics.skipRate} className="h-2" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSkipSync} className="flex-1">
            <SkipForward className="w-4 h-4 mr-2" />
            Test Skip Sync
          </Button>

          <Button size="sm" variant="outline" onClick={handleCtaClick} className="flex-1">
            <Zap className="w-4 h-4 mr-2" />
            Test CTA
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="flex justify-between text-xs text-gray-400">
          <span>Z-Index: 50 (Above video)</span>
          <span>Sync Delay: ~50ms</span>
          <span>Detection: {detectionMode}</span>
        </div>
      </div>
    </Card>
  )
}
