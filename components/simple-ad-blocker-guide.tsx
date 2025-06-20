"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Download, Globe, Smartphone, Monitor } from "lucide-react"

export default function SimpleAdBlockerGuide() {
  const [selectedBrowser, setSelectedBrowser] = useState("chrome")

  const adBlockers = {
    chrome: [
      {
        name: "uBlock Origin",
        description: "Most effective ad blocker",
        url: "https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm",
        rating: "★★★★★",
      },
      {
        name: "AdBlock",
        description: "Popular and user-friendly",
        url: "https://chrome.google.com/webstore/detail/adblock/gighmmpiobklfepjocnamgkkbiglidom",
        rating: "★★★★☆",
      },
    ],
    firefox: [
      {
        name: "uBlock Origin",
        description: "Most effective ad blocker",
        url: "https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/",
        rating: "★★★★★",
      },
      {
        name: "AdBlock Plus",
        description: "Well-established blocker",
        url: "https://addons.mozilla.org/en-US/firefox/addon/adblock-plus/",
        rating: "★★★★☆",
      },
    ],
    safari: [
      {
        name: "AdGuard",
        description: "Best for Safari",
        url: "https://apps.apple.com/app/adguard-for-safari/id1440147259",
        rating: "★★★★☆",
      },
    ],
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Ad Blocking Solutions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="browser" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browser" className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              Browser Extensions
            </TabsTrigger>
            <TabsTrigger value="dns" className="flex items-center gap-1">
              <Monitor className="w-4 h-4" />
              DNS Blocking
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-1">
              <Smartphone className="w-4 h-4" />
              Mobile Apps
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browser" className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button
                size="sm"
                variant={selectedBrowser === "chrome" ? "default" : "outline"}
                onClick={() => setSelectedBrowser("chrome")}
              >
                Chrome
              </Button>
              <Button
                size="sm"
                variant={selectedBrowser === "firefox" ? "default" : "outline"}
                onClick={() => setSelectedBrowser("firefox")}
              >
                Firefox
              </Button>
              <Button
                size="sm"
                variant={selectedBrowser === "safari" ? "default" : "outline"}
                onClick={() => setSelectedBrowser("safari")}
              >
                Safari
              </Button>
            </div>

            <div className="space-y-3">
              {adBlockers[selectedBrowser as keyof typeof adBlockers]?.map((blocker) => (
                <div key={blocker.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{blocker.name}</h4>
                      <Badge variant="secondary">{blocker.rating}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{blocker.description}</p>
                  </div>
                  <Button onClick={() => window.open(blocker.url, "_blank")}>
                    <Download className="w-4 h-4 mr-1" />
                    Install
                  </Button>
                </div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded p-3">
              <h4 className="font-medium text-green-800 mb-1">Recommended: uBlock Origin</h4>
              <p className="text-sm text-green-700">
                Most effective at blocking ads in embedded videos while maintaining compatibility.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="dns" className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">AdGuard DNS</h4>
                <p className="text-sm text-gray-600 mb-2">Free DNS service that blocks ads network-wide</p>
                <div className="text-xs font-mono bg-white p-2 rounded border">
                  Primary: 94.140.14.14
                  <br />
                  Secondary: 94.140.15.15
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Cloudflare for Families</h4>
                <p className="text-sm text-gray-600 mb-2">Blocks malware and adult content</p>
                <div className="text-xs font-mono bg-white p-2 rounded border">
                  Primary: 1.1.1.3
                  <br />
                  Secondary: 1.0.0.3
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mobile" className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">AdGuard (iOS/Android)</h4>
                <p className="text-sm text-gray-600 mb-2">System-wide ad blocking for mobile devices</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      window.open("https://apps.apple.com/app/adguard-adblock-privacy/id1047223162", "_blank")
                    }
                  >
                    iOS App Store
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      window.open("https://play.google.com/store/apps/details?id=com.adguard.android", "_blank")
                    }
                  >
                    Google Play
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Brave Browser</h4>
                <p className="text-sm text-gray-600 mb-2">Browser with built-in ad blocking</p>
                <Button size="sm" onClick={() => window.open("https://brave.com/download/", "_blank")}>
                  Download Brave
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3">
          <h4 className="font-medium text-blue-800 mb-2">💡 Pro Tip</h4>
          <p className="text-sm text-blue-700">
            The most effective approach is to use a browser extension like uBlock Origin. It blocks ads before they even
            load, ensuring videos play smoothly without interruption.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
