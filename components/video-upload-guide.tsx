"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Video, ImageIcon, HardDrive, Clock, Monitor, CheckCircle, AlertTriangle, Info } from "lucide-react"

export default function VideoUploadGuide() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Video Upload Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Supported Formats */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Video className="w-4 h-4" />
              Supported Video Formats
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">MP4</Badge>
              <Badge variant="outline">WebM</Badge>
              <Badge variant="outline">OGG</Badge>
              <Badge variant="outline">AVI</Badge>
              <Badge variant="outline">MOV</Badge>
              <Badge variant="outline">WMV</Badge>
            </div>
          </div>

          {/* File Size Limits */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              File Size Limits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="font-medium text-green-800">Recommended</div>
                <div className="text-sm text-green-600">Under 100MB</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="font-medium text-yellow-800">Acceptable</div>
                <div className="text-sm text-yellow-600">100MB - 300MB</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="font-medium text-red-800">Maximum</div>
                <div className="text-sm text-red-600">500MB</div>
              </div>
            </div>
          </div>

          {/* Recommended Settings */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Recommended Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Resolution:</span>
                  <span className="text-sm">1920x1080 (Full HD)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Frame Rate:</span>
                  <span className="text-sm">30 FPS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Bitrate:</span>
                  <span className="text-sm">5-10 Mbps</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Audio:</span>
                  <span className="text-sm">AAC, 128-320 kbps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Duration:</span>
                  <span className="text-sm">Any length</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Aspect Ratio:</span>
                  <span className="text-sm">16:9 preferred</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnail Options */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Thumbnail Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Upload Custom Thumbnail</h4>
                <p className="text-sm text-gray-600">Upload your own thumbnail image (PNG, JPG, GIF)</p>
                <div className="mt-2">
                  <Badge variant="secondary">Recommended: 1280x720</Badge>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Auto-Generate</h4>
                <p className="text-sm text-gray-600">Automatically generate thumbnail from video frame</p>
                <div className="mt-2">
                  <Badge variant="secondary">Taken at 5 seconds</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Process */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Upload Process
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <div className="font-medium">Select Video File</div>
                  <div className="text-sm text-gray-600">Choose your video file from your computer</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <div className="font-medium">Auto-Detection</div>
                  <div className="text-sm text-gray-600">Video metadata is automatically detected</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <div className="font-medium">Add Details</div>
                  <div className="text-sm text-gray-600">Fill in title, description, tags, and category</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <div className="font-medium">Upload & Publish</div>
                  <div className="text-sm text-gray-600">Upload the video and make it live</div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="space-y-3">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>For Netlify Hosting:</strong> Large video files should be hosted on external services like AWS
                S3, Cloudinary, or Vimeo for better performance.
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>File Storage:</strong> Currently, videos are stored locally in your browser. For production,
                integrate with a cloud storage service.
              </AlertDescription>
            </Alert>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Best Practice:</strong> Compress your videos before uploading to reduce file size and improve
                loading times.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
