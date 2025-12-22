import Link from 'next/link'

export default function Contact() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-gray-300 p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mb-4">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </Link>

                <h1 className="text-4xl font-bold text-white mb-8">Contact Us</h1>

                <div className="glass-card p-8 space-y-8">
                    <p className="text-lg">
                        Have questions or suggestions? We'd love to hear from you.
                    </p>

                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Support</h3>
                            <p className="text-xl text-white">support@vidify.app</p>
                        </div>

                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Business Inquiries</h3>
                            <p className="text-xl text-white">business@vidify.app</p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 pt-4">
                        We generally respond within 24-48 hours.
                    </p>
                </div>
            </div>
        </main>
    )
}
