'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import VideoInput from '@/components/VideoInput'
import VideoPreview from '@/components/VideoPreview'
import QualitySelector from '@/components/QualitySelector'
import DownloadButton from '@/components/DownloadButton'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import Toast from '@/components/ui/Toast'
import type { VideoInfo, DownloadFormat, VideoQuality } from '@/lib/types'

export default function Home() {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [isLoadingInfo, setIsLoadingInfo] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>('video')
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>('1080p')
  const [isDownloading, setIsDownloading] = useState(false)

  // Toast State
  const [toast, setToast] = useState({ message: '', type: 'info' as 'info' | 'success' | 'error', show: false })

  const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToast({ message, type, show: true })
  }

  const handleUrlSubmit = async (url: string) => {
    setIsLoadingInfo(true)
    setError(null)
    setVideoInfo(null)

    try {
      const response = await fetch('/api/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const responseData = await response.json()
        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to fetch video info')
        }
        // Extract the actual VideoInfo from the VideoInfoResponse wrapper
        setVideoInfo(responseData.data)
        showToast('Video found!', 'success')
      } else {
        // Handle non-JSON response (e.g. 404/500 HTML page)
        const text = await response.text()
        throw new Error(`Server error (${response.status}): ${text.substring(0, 100)}...`)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg)
      showToast(msg, 'error')
    } finally {
      setIsLoadingInfo(false)
    }
  }

  const handleFormatChange = (format: DownloadFormat) => {
    setSelectedFormat(format)
  }

  const handleQualityChange = (quality: VideoQuality) => {
    setSelectedQuality(quality)
  }

  const handleDownload = async () => {
    if (!videoInfo) return

    setIsDownloading(true)
    setError(null)
    showToast('Starting download...', 'info')

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: videoInfo.url || videoInfo.webpage_url, // Ensure URL is passed
          format: selectedFormat,
          quality: selectedFormat === 'audio' ? undefined : selectedQuality,
        }),
      })

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json()
          throw new Error(data.error || 'Download failed')
        } else {
          const text = await response.text()
          throw new Error(`Server error (${response.status}): ${text.substring(0, 100)}...`)
        }
      }

      // Handle file download from response blob
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      // Use title from videoInfo for filename, sanitize it
      const safeTitle = videoInfo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
      const ext = selectedFormat === 'audio' ? 'mp3' : 'mp4'
      a.download = `${safeTitle}.${ext}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      showToast('Download started!', 'success')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Download failed'
      setError(msg)
      showToast(msg, 'error')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-slate-950 selection:bg-neon-cyan/30 selection:text-white font-sans text-slate-200">

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />

      {/* Cinematic Background */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-neon-purple/20 rounded-full blur-[120px] animate-blob filter mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] bg-neon-cyan/20 rounded-full blur-[120px] animate-blob animation-delay-2000 filter mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] bg-blue-600/20 rounded-full blur-[120px] animate-blob animation-delay-4000 filter mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex-grow flex flex-col justify-center">

        {/* Hero Section */}
        <section className="text-center space-y-8 mb-20 animate-fadeInUp">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl glass-panel shadow-[0_0_50px_-10px_rgba(139,92,246,0.3)] mb-4">
            <svg
              className="w-12 h-12 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white drop-shadow-2xl">
            Vidify
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Download videos. <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple font-semibold animate-shimmer bg-[size:200%]">Instantly.</span> Beautifully.
          </p>

          <div className="pt-8">
            <VideoInput
              onSubmit={handleUrlSubmit}
              isLoading={isLoadingInfo}
              error={error && !videoInfo ? error : null}
            />
          </div>
        </section>

        {/* Preview & Download Section */}
        {videoInfo && (
          <section className="mb-24 animate-fadeInUp">
            <VideoPreview
              videoInfo={videoInfo}
              qualitySelector={
                <QualitySelector
                  videoInfo={videoInfo}
                  onFormatChange={handleFormatChange}
                  onQualityChange={handleQualityChange}
                  selectedFormat={selectedFormat}
                  selectedQuality={selectedQuality}
                />
              }
            />

            <div className="mt-8 flex justify-center transform hover:scale-105 transition-transform duration-300">
              <DownloadButton
                onDownload={handleDownload}
                isDownloading={isDownloading}
                format={selectedFormat}
              />
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="mb-24">
          <Features />
        </section>

        {/* How It Works Section */}
        <section className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16 text-glow">How It Works</h2>
          <HowItWorks />
        </section>

        {/* SEO Content (Hidden/Subtle) */}
        <article className="glass-panel p-8 md:p-12 space-y-8 text-slate-400 opacity-60 hover:opacity-100 transition-opacity duration-500 mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Professional Video Downloader</h2>
              <p className="leading-relaxed">Vidify represents the cutting edge of web-based media tools. Designed for creators, archivists, and enthusiasts who demand quality.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Supported formats</h2>
              <p className="leading-relaxed">Mp4, WebM, Mp3, M4a. Up to 4K (2160p) resolution supported where available.</p>
            </div>
          </div>
        </article>

      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} Vidify. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <a href="/privacy-policy" className="hover:text-neon-cyan transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-neon-cyan transition-colors">Terms</a>
            <a href="/contact" className="hover:text-neon-cyan transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </main>
  )
}
