'use client'

import { useMemo, useState } from 'react'
import type { VideoInfo, VideoFormat, VideoQuality } from '@/lib/types'

interface QualitySelectorProps {
  videoInfo: VideoInfo
  onFormatChange: (format: 'video' | 'audio') => void
  onQualityChange: (quality: VideoQuality) => void
  selectedFormat?: 'video' | 'audio'
  selectedQuality?: VideoQuality
}

/**
 * Extracts available video qualities from formats array
 * Returns sorted list of unique resolutions
 */
function extractVideoQualities(formats: VideoFormat[]): VideoQuality[] {
  const qualities = new Set<VideoQuality>()

  // Add "best" option
  qualities.add('best')

  // Guard clause for missing formats
  if (!formats || !Array.isArray(formats)) {
    return Array.from(qualities)
  }

  // Extract resolutions from formats
  for (const format of formats) {
    if (format.vcodec && format.vcodec !== 'none') {
      // Try to extract resolution from resolution field (e.g., "1280x720")
      if (format.resolution) {
        const match = format.resolution.match(/(\d+)x(\d+)/)
        if (match) {
          const height = parseInt(match[2])
          // Common resolutions
          if (height >= 2160) qualities.add('2160p')
          else if (height >= 1440) qualities.add('1440p')
          else if (height >= 1080) qualities.add('1080p')
          else if (height >= 720) qualities.add('720p')
          else if (height >= 480) qualities.add('480p')
          else if (height >= 360) qualities.add('360p')
          else if (height >= 240) qualities.add('240p')
          else if (height >= 144) qualities.add('144p')
        }
      }

      // Also check format_note which might contain quality info
      if (format.format_note) {
        const note = format.format_note.toLowerCase()
        if (note.includes('2160p') || note.includes('4k')) qualities.add('2160p')
        if (note.includes('1440p') || note.includes('2k')) qualities.add('1440p')
        if (note.includes('1080p') || note.includes('full hd')) qualities.add('1080p')
        if (note.includes('720p') || note.includes('hd')) qualities.add('720p')
        if (note.includes('480p')) qualities.add('480p')
        if (note.includes('360p')) qualities.add('360p')
        if (note.includes('240p')) qualities.add('240p')
        if (note.includes('144p')) qualities.add('144p')
      }
    }
  }

  // Sort qualities by resolution (best first, then descending)
  const qualityOrder: Record<string, number> = {
    'best': 0,
    '2160p': 1,
    '1440p': 2,
    '1080p': 3,
    '720p': 4,
    '480p': 5,
    '360p': 6,
    '240p': 7,
    '144p': 8,
  }

  return Array.from(qualities).sort((a, b) => {
    const orderA = qualityOrder[a] ?? 999
    const orderB = qualityOrder[b] ?? 999
    return orderA - orderB
  })
}

export default function QualitySelector({
  videoInfo,
  onFormatChange,
  onQualityChange,
  selectedFormat = 'video',
  selectedQuality = 'best',
}: QualitySelectorProps) {
  const [format, setFormat] = useState<'video' | 'audio'>(selectedFormat)
  const [quality, setQuality] = useState<VideoQuality>(selectedQuality)

  // Extract available video qualities
  const availableQualities = useMemo(() => {
    return extractVideoQualities(videoInfo.formats)
  }, [videoInfo.formats])

  const handleFormatChange = (newFormat: 'video' | 'audio') => {
    setFormat(newFormat)
    onFormatChange(newFormat)

    // Reset quality to 'best' when switching formats
    if (newFormat === 'audio') {
      setQuality('best')
      onQualityChange('best')
    } else {
      // For video, set to best available quality
      const bestQuality = availableQualities[0] || 'best'
      setQuality(bestQuality)
      onQualityChange(bestQuality)
    }
  }

  const handleQualityChange = (newQuality: VideoQuality) => {
    setQuality(newQuality)
    onQualityChange(newQuality)
  }

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3 ml-1">
          Download Format
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <label className={`flex items-center justify-center px-6 py-3 border rounded-xl cursor-pointer transition-all duration-200 ${format === 'video'
            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
            }`}>
            <input
              type="radio"
              name="format"
              value="video"
              checked={format === 'video'}
              onChange={() => handleFormatChange('video')}
              className="sr-only"
            />
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="font-semibold">Video (MP4)</span>
          </label>
          <label className={`flex items-center justify-center px-6 py-3 border rounded-xl cursor-pointer transition-all duration-200 ${format === 'audio'
            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
            }`}>
            <input
              type="radio"
              name="format"
              value="audio"
              checked={format === 'audio'}
              onChange={() => handleFormatChange('audio')}
              className="sr-only"
            />
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span className="font-semibold">Audio (M4A)</span>
          </label>
        </div>
      </div>

      {/* Quality Selection (only for video) */}
      {format === 'video' && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3 ml-1">
            Video Quality
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {availableQualities.map((q) => (
              <label
                key={q}
                className={`group flex items-center justify-center px-4 py-3 border rounded-xl cursor-pointer transition-all duration-200 ${quality === q
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-transparent shadow-lg scale-105'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-gray-200 hover:scale-105'
                  }`}
              >
                <input
                  type="radio"
                  name="quality"
                  value={q}
                  checked={quality === q}
                  onChange={() => handleQualityChange(q)}
                  className="sr-only"
                />
                <span className={`text-sm font-semibold`}>
                  {q === 'best' ? 'Best' : q.toUpperCase()}
                </span>
              </label>
            ))}
          </div>
          {availableQualities.length === 0 && (
            <div className="px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <p className="text-sm text-yellow-200 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                No quality options available
              </p>
            </div>
          )}
        </div>
      )}

      {/* Audio format info */}
      {format === 'audio' && (
        <div className="flex items-start gap-3 px-4 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-indigo-200 font-medium">
            Audio will be downloaded in the best available quality (M4A format)
          </p>
        </div>
      )}
    </div>
  )
}

