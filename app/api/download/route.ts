import { NextRequest, NextResponse } from 'next/server'
import { isValidYouTubeUrl } from '@/lib/utils'
import { getDownloadLink } from '@/lib/ytstream'

/**
 * POST /api/download
 * 
 * Gets direct download link for video/audio from YTStream API
 * 
 * Request body:
 * - url: string - YouTube video URL
 * - format: 'video' | 'audio' - Download format
 * - quality: string - Optional quality preference (not used with API)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, format, quality } = body || {}

    // Validate URL
    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'URL is required and must be a string',
        },
        { status: 400 }
      )
    }

    const trimmedUrl = url.trim()

    // Validate URL length
    if (trimmedUrl.length > 2048) {
      return NextResponse.json(
        {
          success: false,
          error: 'URL is too long',
        },
        { status: 400 }
      )
    }

    // Validate YouTube URL
    if (!isValidYouTubeUrl(trimmedUrl)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid YouTube URL',
        },
        { status: 400 }
      )
    }

    // Validate format
    if (!format || (format !== 'video' && format !== 'audio')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Format must be either "video" or "audio"',
        },
        { status: 400 }
      )
    }

    try {
      // Get download link from YTStream API
      const downloadLink = await getDownloadLink(trimmedUrl, format)

      if (!downloadLink) {
        return NextResponse.json(
          {
            success: false,
            error: 'No download link available for this format',
          },
          { status: 404 }
        )
      }

      // Return the download link for the client to fetch
      return NextResponse.json(
        {
          success: true,
          downloadUrl: downloadLink,
          format,
        },
        { status: 200 }
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get download link'
      let statusCode = 500

      if (errorMessage.includes('Invalid YouTube URL')) {
        statusCode = 400
      } else if (errorMessage.includes('unavailable') || errorMessage.includes('private')) {
        statusCode = 404
      } else if (errorMessage.includes('not configured')) {
        statusCode = 503
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: statusCode }
      )
    }
  } catch (error) {
    // Handle unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'Failed to process download request'

    console.error('Download route error:', error)

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
