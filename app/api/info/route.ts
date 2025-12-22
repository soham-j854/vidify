import { NextRequest, NextResponse } from 'next/server'
import { getVideoInfo } from '@/lib/ytdlp'
import type { VideoInfoResponse } from '@/lib/types'

/**
 * POST /api/info
 * 
 * Accepts a YouTube URL and returns video metadata using yt-dlp
 * 
 * Request body:
 * {
 *   url: string - YouTube video URL
 * }
 * 
 * Response:
 * {
 *   success: boolean
 *   data?: {
 *     id: string
 *     title: string
 *     thumbnail: string
 *     duration: number
 *     duration_string: string
 *     uploader: string
 *     formats: VideoFormat[]
 *     ...
 *   }
 *   error?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    let body: any
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json<VideoInfoResponse>(
        {
          success: false,
          error: 'Invalid JSON in request body',
        },
        { status: 400 }
      )
    }

    // Validate body structure
    if (!body || typeof body !== 'object') {
      return NextResponse.json<VideoInfoResponse>(
        {
          success: false,
          error: 'Request body must be a JSON object',
        },
        { status: 400 }
      )
    }

    const { url } = body

    // Validate input
    if (!url || typeof url !== 'string') {
      return NextResponse.json<VideoInfoResponse>(
        {
          success: false,
          error: 'URL is required and must be a string',
        },
        { status: 400 }
      )
    }

    // Validate URL is not empty after trimming
    if (!url.trim()) {
      return NextResponse.json<VideoInfoResponse>(
        {
          success: false,
          error: 'URL cannot be empty',
        },
        { status: 400 }
      )
    }

    // Get video info using yt-dlp
    const videoInfo = await getVideoInfo(url)

    // Return successful response
    return NextResponse.json<VideoInfoResponse>({
      success: true,
      data: videoInfo,
    })
  } catch (error) {
    // Handle errors with appropriate status codes
    let errorMessage = 'Failed to fetch video information'
    let statusCode = 500

    if (error instanceof Error) {
      errorMessage = error.message
      
      // Set appropriate status codes based on error type
      if (errorMessage.includes('Invalid YouTube URL') || errorMessage.includes('URL is required')) {
        statusCode = 400
      } else if (errorMessage.includes('unavailable') || errorMessage.includes('private')) {
        statusCode = 404
      } else if (errorMessage.includes('not installed')) {
        statusCode = 503 // Service unavailable
      }
    }
    
    return NextResponse.json<VideoInfoResponse>(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    )
  }
}

