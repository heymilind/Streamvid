"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, ExternalLink, AlertTriangle } from "lucide-react"

export default function BrowserExtensionHelper() {
  const [adBlockerDetected, setAdBlockerDetected] = useState(false)
  const [extensionRecommendations, setExtensionRecommendations] = useState<string[]>([])

  useEffect(() => {
    // Detect if user has ad blocker installed
    const detectAdBlocker = () => {
      const testAd = document.createElement("div")
      testAd.innerHTML = "&nbsp;"
      testAd.className = "adsbox"
      testAd.style.position = "absolute"
      testAd.style.left = "-10000px"
      document.body.appendChild(testAd)

      setTimeout(() => {
        const isBlocked = testAd.offsetHeight === 0
        setAdBlockerDetected(isBlocked)
        document.body.removeChild(testAd)

        if (!isBlocked) {
          setExtensionRecommendations(["uBlock Origin", "AdBlock Plus", "Ghostery", "Privacy Badger"])
        }
      }, 100)
    }

    detectAdBlocker()
  }, [])

  const extensionLinks = {
    "uBlock Origin": {
      chrome: "https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm",
      firefox: "https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/",
    },
    "AdBlock Plus": {
      chrome: "https://chrome.google.com/webstore/detail/adblock-plus/cfhdojbkjhnklbpkdaibdccddilifddb",
      firefox: "https://addons.mozilla.org/en-US/firefox/addon/adblock-plus/",
    },
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Ad Blocking Status & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={adBlockerDetected ? "default" : "destructive"}>
            {adBlockerDetected ? "Ad Blocker Detected" : "No Ad Blocker"}
          </Badge>
          {adBlockerDetected ? (
            <span className="text-sm text-green-600">✓ Ads should be blocked</span>
          ) : (
            <span className="text-sm text-red-600">⚠ Ads may still appear</span>
          )}
        </div>

        {!adBlockerDetected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">Install a Browser Extension for Better Ad Blocking</h4>
                <p className="text-sm text-yellow-700 mb-3">
                  For the most effective ad blocking, we recommend installing one of these browser extensions:
                </p>

                <div className="space-y-2">
                  {extensionRecommendations.map((extension) => (
                    <div key={extension} className="flex items-center justify-between bg-white rounded p-2">
                      <span className="font-medium">{extension}</span>
                      <div className="flex gap-2">
                        {extensionLinks[extension as keyof typeof extensionLinks] && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                window.open(extensionLinks[extension as keyof typeof extensionLinks].chrome, "_blank")
                              }
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Chrome
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                window.open(extensionLinks[extension as keyof typeof extensionLinks].firefox, "_blank")
                              }
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Firefox
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <h4 className="font-medium text-blue-800 mb-2">Additional Ad Blocking Methods:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use DNS-level blocking (Pi-hole, AdGuard DNS)</li>
            <li>• Enable "Enhanced Tracking Protection" in Firefox</li>
            <li>• Use Brave browser with built-in ad blocking</li>
            <li>• Configure router-level ad blocking</li>
          </ul>
        </div>

        <div className="bg-red-50 border border-red-200 rounded p-4">
          <h4 className="font-medium text-red-800 mb-2">Why Embed Ads Are Hard to Block:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Cross-origin restrictions prevent direct manipulation</li>
            <li>• Ads are served from the same domain as content</li>
            <li>• Dynamic ad injection bypasses static filters</li>
            <li>• Some sites detect and counter ad blockers</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
