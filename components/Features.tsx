import GlassCard from './ui/GlassCard'

export default function Features() {
    const features = [
        {
            title: "Extremely Fast",
            desc: "Instant link generation technology",
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            color: "text-neon-cyan"
        },
        {
            title: "4K Clarity",
            desc: "Crystal clear up to 2160p resolution",
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
            color: "text-neon-purple"
        },
        {
            title: "Premium Audio",
            desc: "Extract high-fidelity MP3/M4A",
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
            ),
            color: "text-neon-aqua"
        }
    ]

    return (
        <div className="grid md:grid-cols-3 gap-6 w-full">
            {features.map((feature, i) => (
                <GlassCard
                    key={i}
                    hoverEffect={true}
                    className={`flex flex-col items-center text-center space-y-4 animate-float`}
                    style={{ animationDelay: `${i * 1.5}s` }} // Stagger floating animation
                >
                    <div className={`p-4 rounded-full bg-white/5 ${feature.color} shadow-[0_0_20px_rgba(255,255,255,0.05)]`}>
                        {feature.icon}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-slate-400 font-light">{feature.desc}</p>
                    </div>
                </GlassCard>
            ))}
        </div>
    )
}
