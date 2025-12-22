'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { VideoInfo } from '@/lib/types'
import GlassCard from './ui/GlassCard'
import Skeleton from './ui/Skeleton'

interface VideoPreviewProps {
  videoInfo: VideoInfo
  qualitySelector?: React.ReactNode
}

export default function VideoPreview({ videoInfo, qualitySelector }: VideoPreviewProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const formatViewCount = (count?: number): string => {
    if (!count) return ''
    if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B views`
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M views`
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K views`
    return `${count} views`
  }

  return (
    <GlassCard className="w-full max-w-4xl mx-auto overflow-hidden !p-0">
      <div className="flex flex-col md:flex-row">
        {/* Thumbnail Section */}
        <div className="relative w-full md:w-2/5 aspect-video md:aspect-auto bg-slate-950/50">
          {!imageLoaded && <Skeleton className="absolute inset-0 w-full h-full z-10" />}

          {videoInfo.thumbnail ? (
            <Image
              src={videoInfo.thumbnail}
              alt={videoInfo.title}
              fill
              className={`object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                setImageLoaded(true) // Remove skeleton on error
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Duration Badge */}
          {videoInfo.duration_string && (
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-md rounded-md text-xs font-mono text-white border border-white/10">
              {videoInfo.duration_string}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between bg-gradient-to-br from-white/5 to-transparent">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white line-clamp-2 leading-snug text-glow">
              {videoInfo.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-neon-cyan">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-semibold text-slate-200">{videoInfo.uploader}</span>
              </div>

              {videoInfo.view_count && (
                <div className="flex items-center gap-2 text-neon-purple">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="font-medium text-slate-300">{formatViewCount(videoInfo.view_count)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            {qualitySelector}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
