/**
 * TypeScript types for YouTube video metadata
 */

export interface VideoFormat {
  format_id: string
  format_note?: string
  ext: string
  resolution?: string
  filesize?: number
  filesize_approx?: number
  vcodec?: string
  acodec?: string
  fps?: number
  quality?: number
}

export interface VideoInfo {
  id: string
  title: string
  thumbnail: string
  duration: number
  duration_string: string
  uploader: string
  uploader_id?: string
  view_count?: number
  formats: VideoFormat[]
  description?: string
  webpage_url: string
  url?: string // Alias for convenience
}

export type DownloadFormat = 'video' | 'audio'
export type VideoQuality = 'best' | '2160p' | '1440p' | '1080p' | '720p' | '480p' | '360p' | '240p' | '144p'

export interface VideoInfoResponse {
  success: boolean
  data?: VideoInfo
  error?: string
}

