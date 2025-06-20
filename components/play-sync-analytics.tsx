"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, SkipForward, MousePointer, Eye, TrendingUp } from "lucide-react"

interface PlaySyncAnalyticsProps {
  videoId: string
}

interface AnalyticsData {
  playClicks: number
  customAdShows: number
  skipClicks: number
  ctaClicks: number
  syncSuccessRate: number
  averageViewTime: number
  conversionRate: number
}

export default function PlaySyncAnalytics({ videoId }: PlaySyncAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    playClicks: 0,
    customAdShows: 0,
    skipClicks: 0,
    ctaClicks: 0,
    syncSuccessRate: 98.5,
    averageViewTime: 4.2,
    conversionRate: 12.8,
  })

  const [isTracking, setIsTracking] = useState(true)

  // Simulate real-time analytics updates
  useEffect(() => {
    if (!isTracking) return

    const interval = setInterval(() => {
      setAnalytics((prev) => ({
        ...prev,
        playClicks: prev.playClicks + Math.floor(Math.random() * 3),
        customAdShows: prev.customAdShows + Math.floor(Math.random() * 2),
        skipClicks: prev.skipClicks + Math.floor(Math.random() * 2),
        ctaClicks: prev.ctaClicks + (Math.random() > 0.7 ? 1 : 0),
        syncSuccessRate: Math.max(95, Math.min(100, prev.syncSuccessRate + (Math.random() - 0.5) * 2)),
        averageViewTime: Math.max(2, Math.min(8, prev.averageViewTime + (Math.random() - 0.5) * 0.5)),
        conversionRate: Math.max(8, Math.min(20, prev.conversionRate + (Math.random() - 0.5) * 2)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [isTracking])

  const engagementRate =
    analytics.customAdShows > 0 ? ((analytics.ctaClicks + analytics.skipClicks) / analytics.customAdShows) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Play-Triggered Ad Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Play className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-900">{analytics.playClicks}</div>
            <div className="text-sm text-blue-600">Play Clicks</div>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Eye className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-900">{analytics.customAdShows}</div>
            <div className="text-sm text-green-600">Ad Shows</div>
          </div>

          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <SkipForward className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-900">{analytics.skipClicks}</div>
            <div className="text-sm text-purple-600">Skip Clicks</div>
          </div>

          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <MousePointer className="w-6 h-6 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-900">{analytics.ctaClicks}</div>
            <div className="text-sm text-orange-600">CTA Clicks</div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Sync Success Rate</span>
              <span className="font-medium">{analytics.syncSuccessRate.toFixed(1)}%</span>
            </div>
            <Progress value={analytics.syncSuccessRate} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Engagement Rate</span>
              <span className="font-medium">{engagementRate.toFixed(1)}%</span>
            </div>
            <Progress value={engagementRate} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Conversion Rate</span>
              <span className="font-medium">{analytics.conversionRate.toFixed(1)}%</span>
            </div>
            <Progress value={analytics.conversionRate} className="h-2" />
          </div>
        </div>

        {/* Timing Metrics */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="text-sm text-gray-600">Avg. View Time</div>
            <div className="text-xl font-bold">{analytics.averageViewTime.toFixed(1)}s</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Skip Rate</div>
            <div className="text-xl font-bold">
              {analytics.customAdShows > 0 ? ((analytics.skipClicks / analytics.customAdShows) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Play Detection: Active</Badge>
          <Badge variant="secondary">Overlay Timing: Optimized</Badge>
          <Badge variant="outline">Skip Sync: {analytics.syncSuccessRate > 95 ? "Excellent" : "Good"}</Badge>
        </div>

        {/* Implementation Notes */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>• Custom overlay appears 100ms after play click</div>
          <div>• Original iframe loads 500ms after play click</div>
          <div>• Skip synchronization attempts multiple methods</div>
          <div>• Cross-origin fallbacks ensure compatibility</div>
        </div>
      </CardContent>
    </Card>
  )
}
