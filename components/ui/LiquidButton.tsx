import { ButtonHTMLAttributes, ReactNode } from 'react'

interface LiquidButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    isLoading?: boolean
    variant?: 'primary' | 'secondary' | 'ghost'
}

export default function LiquidButton({
    children,
    isLoading,
    variant = 'primary',
    className = '',
    disabled,
    ...props
}: LiquidButtonProps) {

    const baseStyles = "relative px-8 py-4 rounded-xl font-bold tracking-wide transition-all duration-300 transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 overflow-hidden group"

    const variants = {
        primary: "glass-button-primary",
        secondary: "bg-white/10 border border-white/10 hover:bg-white/20 text-white backdrop-blur-md",
        ghost: "text-gray-400 hover:text-white hover:bg-white/5"
    }

    return (
        <button
            disabled={disabled || isLoading}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {/* Content wrapper for z-index */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                    </>
                ) : children}
            </span>

            {/* Secondary liquid layer for depth */}
            {variant === 'primary' && (
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            )}
        </button>
    )
}
