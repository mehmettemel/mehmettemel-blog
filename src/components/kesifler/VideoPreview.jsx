'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

/**
 * VideoPreview Component - Shows video thumbnail
 * Supports YouTube, Vimeo, and other platforms
 */
export function VideoPreview({ url, title }) {
  const [imageError, setImageError] = useState(false)

  // Extract video ID and platform
  const getVideoInfo = (url) => {
    if (!url) return null

    try {
      const urlObj = new URL(url)

      // YouTube
      if (
        urlObj.hostname.includes('youtube.com') ||
        urlObj.hostname.includes('youtu.be')
      ) {
        let videoId = null

        if (urlObj.hostname.includes('youtu.be')) {
          videoId = urlObj.pathname.slice(1)
        } else if (urlObj.searchParams.has('v')) {
          videoId = urlObj.searchParams.get('v')
        }

        if (videoId) {
          return {
            platform: 'youtube',
            videoId: videoId,
            // Try maxresdefault first, fallback to hqdefault
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
          }
        }
      }

      // Vimeo
      if (urlObj.hostname.includes('vimeo.com')) {
        const videoId = urlObj.pathname.split('/')[1]
        if (videoId) {
          return {
            platform: 'vimeo',
            // Vimeo thumbnails require API, so we'll use a placeholder
            // You could add Vimeo API integration here
            thumbnail: null,
            embedUrl: `https://player.vimeo.com/video/${videoId}`,
          }
        }
      }

      return null
    } catch {
      return null
    }
  }

  const videoInfo = getVideoInfo(url)

  if (!videoInfo || !videoInfo.thumbnail || imageError) {
    return null
  }

  return (
    <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-muted">
      <img
        src={videoInfo.thumbnail}
        alt={title || 'Video thumbnail'}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        onError={() => {
          setImageError(true)
        }}
      />
      {/* Play overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity group-hover:bg-black/30">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
          <Play className="h-6 w-6 fill-primary text-primary" />
        </div>
      </div>
    </div>
  )
}
