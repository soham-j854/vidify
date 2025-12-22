import { useEffect, useState } from 'react'

interface ToastProps {
    message: string
    type?: 'success' | 'error' | 'info'
    isVisible: boolean
    onClose: () => void
}

export default function Toast({ message, type = 'info', isVisible, onClose }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 3000)
            return () => clearTimeout(timer)
        }
    }, [isVisible, onClose])

    if (!isVisible) return null

    const bgColors = {
        success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
        error: 'bg-red-500/10 border-red-500/20 text-red-300',
        info: 'bg-blue-500/10 border-blue-500/20 text-blue-300'
    }

    const iconColors = {
        success: 'text-emerald-400',
        error: 'text-red-400',
        info: 'text-blue-400'
    }

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fadeInUp">
            <div className={`
        flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl
        ${bgColors[type]}
      `}>
                {type === 'success' && (
                    <svg className={`w-5 h-5 ${iconColors[type]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                )}
                {type === 'error' && (
                    <svg className={`w-5 h-5 ${iconColors[type]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
                <span className="font-medium">{message}</span>
            </div>
        </div>
    )
}
