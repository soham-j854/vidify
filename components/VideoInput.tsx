'use client'

import { useState, FormEvent } from 'react'
import { isValidYouTubeUrl } from '@/lib/utils'
import GlassCard from './ui/GlassCard'
import LiquidButton from './ui/LiquidButton'

interface VideoInputProps {
  onSubmit: (url: string) => void
  isLoading?: boolean
  error?: string | null
}

export default function VideoInput({ onSubmit, isLoading = false, error: externalError }: VideoInputProps) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  const validateUrl = (urlToValidate: string): boolean => {
    const trimmedUrl = urlToValidate.trim()

    if (!trimmedUrl) {
      setError('Please paste a YouTube URL first')
      return false
    }

    if (!isValidYouTubeUrl(trimmedUrl)) {
      setError('That doesn\'t look like a valid YouTube link')
      return false
    }

    setError(null)
    return true
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedUrl = url.trim()
    if (validateUrl(trimmedUrl)) {
      onSubmit(trimmedUrl)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    if (error) setError(null)
  }

  const displayError = externalError || error

  return (
    <GlassCard className="w-full max-w-3xl mx-auto backdrop-blur-3xl !p-1 bg-gradient-to-br from-white/10 to-white/5">
      <form onSubmit={handleSubmit} className="relative z-10 w-full p-6 sm:p-10 bg-slate-950/50 rounded-[22px]">
        <div className="flex flex-col gap-6">
          <div className="text-center space-y-2 mb-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Paste Link</h2>
            <p className="text-slate-400 text-sm">Supports YouTube videos, Shorts, and Music</p>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-20">
              <svg className="w-5 h-5 text-slate-500 group-focus-within:text-neon-cyan transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>

            <input
              type="text"
              value={url}
              onChange={handleInputChange}
              placeholder="https://youtube.com/watch?v=..."
              disabled={isLoading}
              className="w-full pl-14 pr-4 py-5 bg-black/50 border border-white/5 rounded-2xl 
                       text-lg text-white placeholder:text-slate-500
                       focus:outline-none focus:ring-2 focus:ring-neon-purple/50 focus:border-transparent
                       transition-all duration-300 shadow-inner
                       disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* Input Glow Effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-neon-cyan/50 to-neon-purple/50 rounded-2xl opacity-0 group-focus-within:opacity-100 -z-10 blur-sm transition-opacity duration-500" />
          </div>

          <LiquidButton
            type="submit"
            isLoading={isLoading}
            className="w-full text-lg shadow-[0_0_40px_rgba(139,92,246,0.3)]"
          >
            Start Download
          </LiquidButton>
        </div>

        {displayError && (
          <div className="absolute -bottom-16 left-0 right-0 text-center animate-fadeInUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-300 text-sm backdrop-blur-md">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {displayError}
            </div>
          </div>
        )}
      </form>
    </GlassCard>
  )
}
