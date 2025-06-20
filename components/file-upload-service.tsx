"use client"

export interface UploadProgress {
  progress: number
  status: "idle" | "uploading" | "success" | "error"
  message?: string
}

export class FileUploadService {
  static async uploadVideo(file: File, onProgress?: (progress: UploadProgress) => void): Promise<string> {
    return new Promise((resolve, reject) => {
      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 15

        if (onProgress) {
          onProgress({
            progress: Math.min(progress, 100),
            status: progress >= 100 ? "success" : "uploading",
            message: progress >= 100 ? "Upload complete!" : `Uploading... ${Math.round(progress)}%`,
          })
        }

        if (progress >= 100) {
          clearInterval(interval)

          // In a real implementation, you would:
          // 1. Upload to your storage service (AWS S3, Cloudinary, etc.)
          // 2. Return the public URL
          // For now, we'll create a blob URL
          const videoUrl = URL.createObjectURL(file)
          resolve(videoUrl)
        }
      }, 200)
    })
  }

  static async uploadThumbnail(file: File): Promise<string> {
    // In a real implementation, upload to your storage service
    return URL.createObjectURL(file)
  }

  static generateThumbnailFromVideo(videoFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video")
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      video.onloadeddata = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        video.currentTime = Math.min(5, video.duration / 2) // 5 seconds or middle of video
      }

      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const thumbnailUrl = URL.createObjectURL(blob)
                resolve(thumbnailUrl)
              } else {
                reject(new Error("Failed to generate thumbnail"))
              }
            },
            "image/jpeg",
            0.8,
          )
        }
      }

      video.onerror = () => reject(new Error("Failed to load video"))
      video.src = URL.createObjectURL(videoFile)
    })
  }

  static getVideoMetadata(file: File): Promise<{
    duration: string
    resolution: string
    format: string
    fileSize: string
  }> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video")

      video.onloadedmetadata = () => {
        const duration = Math.floor(video.duration)
        const minutes = Math.floor(duration / 60)
        const seconds = duration % 60

        resolve({
          duration: `${minutes}:${seconds.toString().padStart(2, "0")}`,
          resolution: `${video.videoWidth}x${video.videoHeight}`,
          format: file.type.split("/")[1].toUpperCase(),
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        })

        URL.revokeObjectURL(video.src)
      }

      video.onerror = () => reject(new Error("Failed to load video metadata"))
      video.src = URL.createObjectURL(file)
    })
  }

  static validateVideoFile(file: File): { isValid: boolean; error?: string } {
    const validTypes = ["video/mp4", "video/webm", "video/ogg", "video/avi", "video/mov", "video/wmv"]
    const maxSize = 500 * 1024 * 1024 // 500MB

    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "Please select a valid video file (MP4, WebM, OGG, AVI, MOV, WMV)",
      }
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "File size must be less than 500MB",
      }
    }

    return { isValid: true }
  }
}

export default FileUploadService
