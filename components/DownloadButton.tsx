'use client'

interface DownloadButtonProps {
  onDownload: () => void
  isDownloading: boolean
  format: 'video' | 'audio'
}

/**
 * DownloadButton component
 * Triggers download API call, shows loading state during download, handles download completion
 */
export default function DownloadButton({ onDownload, isDownloading, format }: DownloadButtonProps) {
  return (
    <div className="flex justify-center pt-4">
      <button
        onClick={onDownload}
        disabled={isDownloading}
        className="group relative px-8 py-5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 
                 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed disabled:text-gray-500
                 text-white font-bold text-lg tracking-wide
                 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95
                 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]
                 disabled:shadow-none
                 flex items-center gap-3 min-w-[240px] justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors duration-300" />
        <div className="relative flex items-center gap-3">
          {isDownloading ? (
            <>
              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Starting Download...</span>
            </>
          ) : (
            <>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Download {format === 'audio' ? 'Audio' : 'Video'}</span>
            </>
          )}
        </div>
      </button>
    </div>
  )
}

