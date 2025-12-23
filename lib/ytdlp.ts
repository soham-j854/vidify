/**
 * yt-dlp wrapper utilities
 * Server-side only - uses Node.js child_process
 */

import { spawn } from 'child_process'
import type { VideoInfo, VideoFormat } from './types'
import { isValidYouTubeUrl } from './utils'

// Re-export for convenience (server-side only)
export { isValidYouTubeUrl }

/**
 * Executes yt-dlp command safely using spawn (prevents command injection)
 * @param args Command arguments array
 * @returns Promise resolving to stdout string
 */
function executeYtDlp(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = spawn('yt-dlp', args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false, // Don't use shell to prevent injection
    })

    let stdout = ''
    let stderr = ''

    process.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    process.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    process.on('error', (error) => {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        reject(new Error('yt-dlp is not installed. Please install it using: pip install yt-dlp'))
      } else {
        reject(error)
      }
    })

    process.on('close', (code) => {
      if (code !== 0) {
        // Check for specific error messages in stderr
        const errorMsg = stderr.toLowerCase()
        if (errorMsg.includes('private video') || errorMsg.includes('video unavailable') || errorMsg.includes('unavailable')) {
          reject(new Error('Video is unavailable or private'))
        } else if (errorMsg.includes('unable to download') || errorMsg.includes('error')) {
          reject(new Error(`Failed to fetch video: ${stderr.trim() || 'Unknown error'}`))
        } else {
          reject(new Error(`yt-dlp exited with code ${code}: ${stderr.trim() || 'Unknown error'}`))
        }
      } else if (!stdout.trim()) {
        reject(new Error('No data received from yt-dlp'))
      } else {
        // yt-dlp outputs warnings to stderr, which is normal
        // Only log if there are actual errors (non-warning messages)
        if (stderr && !stderr.toLowerCase().includes('warning')) {
          console.warn('yt-dlp stderr:', stderr)
        }
        resolve(stdout)
      }
    })
  })
}

/**
 * Gets video metadata using yt-dlp
 * @param url YouTube video URL
 * @returns Video metadata including title, thumbnail, formats, etc.
 */
export async function getVideoInfo(url: string): Promise<VideoInfo> {
  // Validate and sanitize URL
  if (!url || typeof url !== 'string') {
    throw new Error('URL is required and must be a string')
  }

  const trimmedUrl = url.trim()
  if (!trimmedUrl) {
    throw new Error('URL cannot be empty')
  }

  // Prevent extremely long URLs (potential DoS)
  if (trimmedUrl.length > 2048) {
    throw new Error('URL is too long')
  }

  if (!isValidYouTubeUrl(trimmedUrl)) {
    throw new Error('Invalid YouTube URL')
  }

  try {
    // Use spawn with arguments array to prevent command injection
    // --no-playlist: only download the video, not the entire playlist
    // --dump-json: output video info as JSON
    const stdout = await executeYtDlp([
      '--no-playlist',
      '--dump-json',
      // '--no-call-home' is deprecated, removed
      '--no-warnings',  // Reduce stderr noise
      '--flat-playlist', // Don't iterate playlist items
      '--no-cache-dir', // Don't use cache
      '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', // Spoof user agent
      trimmedUrl,
    ])

    // Parse JSON response
    let videoData: any
    try {
      videoData = JSON.parse(stdout)
    } catch (parseError) {
      throw new Error(`Failed to parse yt-dlp response: ${parseError instanceof Error ? parseError.message : 'Invalid JSON'}`)
    }

    // Validate required fields
    if (!videoData.id) {
      throw new Error('Invalid video data: missing video ID')
    }

    // Extract and format the video information with proper fallbacks
    const videoInfo: VideoInfo = {
      id: String(videoData.id || ''),
      title: String(videoData.title || 'Untitled'),
      thumbnail: String(
        videoData.thumbnail ||
        videoData.thumbnails?.[0]?.url ||
        videoData.thumbnails?.[videoData.thumbnails.length - 1]?.url ||
        ''
      ),
      duration: Number(videoData.duration) || 0,
      duration_string: String(videoData.duration_string || '0:00'),
      uploader: String(videoData.uploader || videoData.channel || 'Unknown'),
      uploader_id: videoData.uploader_id || videoData.channel_id || undefined,
      view_count: videoData.view_count ? Number(videoData.view_count) : undefined,
      formats: Array.isArray(videoData.formats) ? (videoData.formats as VideoFormat[]) : [],
      description: videoData.description ? String(videoData.description) : undefined,
      webpage_url: String(videoData.webpage_url || trimmedUrl),
    }

    return videoInfo
  } catch (error) {
    // Re-throw known errors as-is
    if (error instanceof Error) {
      // Check for specific error messages
      const errorMsg = error.message.toLowerCase()
      if (errorMsg.includes('invalid youtube url') || errorMsg.includes('invalid url')) {
        throw new Error('Invalid YouTube URL')
      }
      if (errorMsg.includes('unavailable') || errorMsg.includes('private')) {
        throw new Error('Video is unavailable or private')
      }
      if (errorMsg.includes('not installed')) {
        throw error
      }
      // Re-throw with original message
      throw error
    }

    // Handle unknown errors
    throw new Error(`Failed to fetch video info: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

