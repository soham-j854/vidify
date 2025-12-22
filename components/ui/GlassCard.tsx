import { ReactNode } from 'react'

interface GlassCardProps {
    children: ReactNode
    className?: string
    hoverEffect?: boolean
    onClick?: () => void
    style?: React.CSSProperties
}

export default function GlassCard({
    children,
    className = '',
    hoverEffect = false,
    onClick,
    style
}: GlassCardProps) {
    return (
        <div
            onClick={onClick}
            style={style}
            className={`
        glass-panel p-6 sm:p-8 rounded-3xl
        ${hoverEffect ? 'hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
        >
            {/* Dynamic light refraction element */}
            <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-white/5 to-transparent rotate-45 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}
