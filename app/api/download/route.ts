import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { isValidYouTubeUrl } from '@/lib/utils'
import { getVideoInfo } from '@/lib/ytdlp'

/**
 * Gets the appropriate format selector for yt-dlp based on format type
 */
function getFormatSelector(format: 'video' | 'audio', quality?: string): string {
  if (format === 'audio') {
    // For audio: best audio quality, prefer m4a format for better compatibility
    // When streaming to stdout, we can't do post-processing, so we get the best available format
    return 'bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio/best'
  } else {
    // For video: use quality if specified, otherwise best
    if (quality) {
      // Quality can be like "720p", "1080p", "best", etc.
      if (quality === 'best') {
        return 'best[ext=mp4]/best'
      }
      // Try to match quality (e.g., "720p" -> "720")
      const qualityMatch = quality.match(/(\d+)p?/i)
      if (qualityMatch) {
        const height = parseInt(qualityMatch[1])
        return `best[height<=${height}][ext=mp4]/best[height<=${height}]/best`
      }
    }
    return 'best[ext=mp4]/best'
  }
}

/**
 * GET /api/download
 * 
 * Streams video/audio download from yt-dlp to client
 * 
 * Query params:
 * - url: string - YouTube video URL
 * - format: 'video' | 'audio' - Download format
 * - quality: string - Optional quality preference
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

    // Get video info to extract title for filename
    let videoInfo
    try {
      videoInfo = await getVideoInfo(trimmedUrl)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch video information'
      let statusCode = 500

      if (errorMessage.includes('Invalid YouTube URL')) {
        statusCode = 400
      } else if (errorMessage.includes('unavailable') || errorMessage.includes('private')) {
        statusCode = 404
      } else if (errorMessage.includes('not installed')) {
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

    // Determine file extension and MIME type
    // For audio, we'll use m4a as the default (yt-dlp often provides this)
    // The actual format may vary, but m4a is a common audio container
    const fileExt = format === 'audio' ? 'm4a' : 'mp4'
    const mimeType = format === 'audio' ? 'audio/mp4' : 'video/mp4'

    // Use a simple, ASCII-only filename to avoid header encoding issues
    const filename = `download.${fileExt}`

    // Skip redundant version check to improve start time
    // The main process spawn below will fail if yt-dlp is missing, which is caught and handled.

    // Get format selector
    const formatSelector = getFormatSelector(format, quality)

    // Note: We already validated the video with getVideoInfo above
    // So we can proceed directly to streaming

    // Build yt-dlp arguments
    // Note: When streaming to stdout (-o -), post-processing is limited
    // We use format selectors to get the best available format directly
    const args: string[] = [
      '--no-playlist',
      '--no-warnings',
      '--no-progress',
      '--no-color',
      '--no-mtime',       // Don't set file modification time (irrelevant for stream)
      '--concurrent-fragments', '4', // Download 4 parts at once (faster from YouTube)
      '-f', formatSelector,
      '-o', '-', // Output to stdout
      trimmedUrl,
    ]

    // Create a readable stream from yt-dlp with proper error handling
    // Create a readable stream from yt-dlp with proper error handling
    let ytdlpProcess: ReturnType<typeof spawn> | null = null

    const stream = new ReadableStream({
      async start(controller) {
        let errorOutput = ''
        let hasError = false
        let hasStarted = false

        try {
          // Spawn yt-dlp process
          // Use shell: false with args array (like common yt-dlp wrappers) for safety and reliability
          ytdlpProcess = spawn('yt-dlp', args, {
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: false,
          })

          // Handle stdout - pipe to controller
          ytdlpProcess.stdout?.on('data', (chunk: Buffer) => {
            hasStarted = true
            try {
              controller.enqueue(chunk)
            } catch (err) {
              // Stream might be closed, ignore
              if (!hasError) {
                hasError = true
              }
            }
          })

          // Handle stderr - collect for error messages
          ytdlpProcess.stderr?.on('data', (data: Buffer) => {
            const stderrText = data.toString()
            errorOutput += stderrText

            // Check for critical errors in stderr
            const lowerStderr = stderrText.toLowerCase()
            if (lowerStderr.includes('error') &&
              (lowerStderr.includes('unable to download') ||
                lowerStderr.includes('video unavailable') ||
                lowerStderr.includes('private video'))) {
              if (!hasError) {
                hasError = true
                if (ytdlpProcess) {
                  ytdlpProcess.kill()
                }
                try {
                  let errorMessage = 'Download failed'
                  if (lowerStderr.includes('private video') || lowerStderr.includes('video unavailable')) {
                    errorMessage = 'Video is unavailable or private'
                  } else {
                    errorMessage = `Download error: ${stderrText.trim().substring(0, 200)}`
                  }
                  controller.error(new Error(errorMessage))
                } catch {
                  // Stream already closed
                }
              }
            }
          })

          // Handle process errors
          ytdlpProcess.on('error', (error: NodeJS.ErrnoException) => {
            if (hasError) return // Already handled

            hasError = true
            let errorMessage = 'Failed to start download'

            if (error.code === 'ENOENT') {
              errorMessage = 'yt-dlp is not installed. Please install it using: pip install yt-dlp'
            } else {
              errorMessage = `yt-dlp error: ${error.message}`
            }

            try {
              controller.error(new Error(errorMessage))
            } catch {
              // Stream already closed
            }
          })

          // Handle process completion
          ytdlpProcess.on('close', (code) => {
            if (hasError) return // Already handled

            if (code !== 0) {
              hasError = true
              const errorMsg = errorOutput.toLowerCase()
              let errorMessage = 'Download failed'

              // Log error for debugging
              console.error('yt-dlp download failed:', {
                code,
                errorOutput: errorOutput.substring(0, 500),
                format: formatSelector,
                url: trimmedUrl.substring(0, 100),
              })

              if (errorMsg.includes('private video') || errorMsg.includes('video unavailable') || errorMsg.includes('unavailable')) {
                errorMessage = 'Video is unavailable or private'
              } else if (errorMsg.includes('unable to download') || errorMsg.includes('error')) {
                errorMessage = `Failed to download: ${errorOutput.trim().substring(0, 200) || 'Unknown error'}`
              } else if (errorOutput.trim()) {
                errorMessage = `yt-dlp exited with code ${code}: ${errorOutput.trim().substring(0, 200)}`
              } else {
                errorMessage = `yt-dlp exited with code ${code}. Please check if yt-dlp is installed and working.`
              }

              try {
                controller.error(new Error(errorMessage))
              } catch {
                // Stream already closed
              }
            } else {
              // Success - close the stream
              try {
                controller.close()
              } catch {
                // Stream already closed
              }
            }
          })
        } catch (error) {
          if (!hasError) {
            hasError = true
            const errorMessage = error instanceof Error ? error.message : 'Failed to start download'
            try {
              controller.error(new Error(errorMessage))
            } catch {
              // Stream already closed
            }
          }
        }
      },
      cancel() {
        // Handle stream cancellation
        // This is called when the client cancels the request
        if (ytdlpProcess) {
          try {
            console.log('Client cancelled download, killing yt-dlp process')
            ytdlpProcess.kill()
          } catch (err) {
            console.error('Failed to kill yt-dlp process:', err)
          }
        }
      },
    })

    // Return streaming response with appropriate headers
    return new NextResponse(stream, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        // Use a simple ASCII-only filename to avoid ByteString / encoding issues
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    // Handle unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'Failed to process download request'

    // Log error for debugging
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

