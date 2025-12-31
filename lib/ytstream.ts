/**
 * YTStream API wrapper for YouTube video downloads
 * Uses RapidAPI's ytstream-download-youtube-videos service
 */

import type { VideoInfo } from './types'
import { isValidYouTubeUrl } from './utils'

/**
 * Extracts video ID from YouTube URL
 */
function extractVideoId(url: string): string {
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  throw new Error('Invalid YouTube URL')
}

/**
 * Calls YTStream API to get video information
 */
export async function getVideoInfo(url: string): Promise<VideoInfo> {
  if (!url || typeof url !== 'string') {
    throw new Error('URL is required and must be a string')
  }

  const trimmedUrl = url.trim()
  if (!trimmedUrl) {
    throw new Error('URL cannot be empty')
  }

  if (trimmedUrl.length > 2048) {
    throw new Error('URL is too long')
  }

  if (!isValidYouTubeUrl(trimmedUrl)) {
    throw new Error('Invalid YouTube URL')
  }

  const videoId = extractVideoId(trimmedUrl)
  const apiKey = process.env.YTSTREAM_API_KEY

  if (!apiKey) {
    throw new Error('YTStream API key not configured')
  }

  try {
    const response = await fetch(
      `https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${videoId}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'ytstream-download-youtube-videos.p.rapidapi.com',
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      if (response.status === 404) {
        throw new Error('Video not found or is unavailable')
      }
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    // Handle API response
    if (data.error) {
      throw new Error(data.error)
    }

    if (!data.meta || !data.meta.title) {
      throw new Error('Invalid response from API')
    }

    // Convert API response to VideoInfo format
    const videoInfo: VideoInfo = {
      id: videoId,
      title: data.meta.title || 'Untitled',
      thumbnail: data.meta.image || data.meta.thumbnail || '',
      duration: data.meta.duration || 0,
      duration_string: formatDuration(data.meta.duration || 0),
      uploader: data.meta.author || 'Unknown',
      uploader_id: data.meta.author_id,
      view_count: data.meta.views ? parseInt(data.meta.views) : undefined,
      formats: [],
      description: data.meta.description,
      webpage_url: trimmedUrl,
    }

    return videoInfo
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch video information')
  }
}

/**
 * Gets direct download link for a video
 */
export async function getDownloadLink(
  url: string,
  format: 'video' | 'audio'
): Promise<string> {
  if (!url || typeof url !== 'string') {
    throw new Error('URL is required')
  }

  if (!isValidYouTubeUrl(url)) {
    throw new Error('Invalid YouTube URL')
  }

  const videoId = extractVideoId(url)
  const apiKey = process.env.YTSTREAM_API_KEY

  if (!apiKey) {
    throw new Error('YTStream API key not configured')
  }

  try {
    const response = await fetch(
      `https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${videoId}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'ytstream-download-youtube-videos.p.rapidapi.com',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to get download link')
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    // Return appropriate link based on format
    if (format === 'audio') {
      return data.links?.audio?.[0]?.url || data.links?.a?.[0]?.url
    } else {
      return data.links?.mp4?.[0]?.url || data.links?.v?.[0]?.url
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to get download link')
  }
}

/**
 * Helper function to format duration seconds to HH:MM:SS
 */
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`
}
