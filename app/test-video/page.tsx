import DirectVideoPlayer from "@/components/direct-video-player"

export default function TestVideoPage() {
  // Note: This is the Gofile.io link you provided
  // However, this likely won't work due to CORS and temporary nature of Gofile links
  const gofileVideoUrl = "https://store1.gofile.io/download/web/uPznQM/2160p.h264.mov"

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Video Player</h1>
          <p className="text-gray-600">Testing direct video file embedding</p>
        </div>

        {/* Warning about Gofile.io */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 mt-0.5">⚠️</div>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">Important Notice</h3>
              <p className="text-yellow-700 text-sm">
                Gofile.io links are temporary and not suitable for permanent video embedding. The video below may not
                play due to CORS restrictions or link expiration.
              </p>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <DirectVideoPlayer
          videoUrl={gofileVideoUrl}
          title="Test Video from Gofile.io"
          thumbnail="/placeholder.svg?height=400&width=700&text=Video+Thumbnail"
        />

        {/* Better Alternatives */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Better Video Hosting Alternatives:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">For Adult Content:</h4>
              <ul className="text-blue-700 space-y-1">
                <li>• Pornhub (embed codes)</li>
                <li>• Xvideos (embed codes)</li>
                <li>• RedTube (embed codes)</li>
                <li>• Adult-friendly CDNs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">For General Content:</h4>
              <ul className="text-blue-700 space-y-1">
                <li>• YouTube (embed codes)</li>
                <li>• Vimeo (embed codes)</li>
                <li>• Dailymotion (embed codes)</li>
                <li>• Your own server/CDN</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
