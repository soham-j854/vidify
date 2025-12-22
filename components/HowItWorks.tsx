export default function HowItWorks() {
    const steps = [
        { num: '01', title: 'Paste Link', desc: 'Copy YouTube URL' },
        { num: '02', title: 'Preview', desc: 'Select quality' },
        { num: '03', title: 'Download', desc: 'Save to device' },
    ]

    return (
        <div className="relative w-full py-12">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[28%] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
                {steps.map((step, i) => (
                    <div
                        key={i}
                        className="flex flex-col items-center text-center group animate-fadeInUp"
                        style={{ animationDelay: `${i * 0.2}s` }}
                    >
                        <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-xl font-bold text-white mb-6 group-hover:scale-110 group-hover:border-neon-cyan/50 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
                                {step.num}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                        <p className="text-slate-500 text-sm">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
