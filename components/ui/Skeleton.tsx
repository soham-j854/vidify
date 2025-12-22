interface SkeletonProps {
    className?: string
}

export default function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`
        bg-white/5 relative overflow-hidden rounded-lg
        before:absolute before:inset-0
        before:-translate-x-full
        before:animate-[shimmer_2s_infinite]
        before:bg-gradient-to-r
        before:from-transparent before:via-white/10 before:to-transparent
        ${className}
      `}
        />
    )
}
