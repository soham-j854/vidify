/**
 * Client-safe utility functions
 * These functions can be used in both client and server components
 */

/**
 * Validates if a URL is a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  try {
    // More comprehensive URL validation
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()
    
    // Check for valid YouTube domains
    const validDomains = ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com']
    if (!validDomains.some(domain => hostname === domain || hostname.endsWith(`.${domain}`))) {
      return false
    }
    
    // Check for video path patterns
    const pathname = urlObj.pathname
    const hasVideoId = pathname.includes('/watch') || pathname.includes('/v/') || pathname.match(/^\/[a-zA-Z0-9_-]{11}$/)
    
    return hasVideoId || pathname.length > 1
  } catch {
    // If URL parsing fails, try regex fallback
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
    return youtubeRegex.test(url)
  }
}

