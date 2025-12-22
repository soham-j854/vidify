import Link from 'next/link'

export default function TermsOfService() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-gray-300 p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mb-4">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </Link>

                <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

                <div className="glass-card p-8 space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">1. Agreement to Terms</h2>
                        <p>
                            By accessing our website at Vidify, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">2. Use License</h2>
                        <p>
                            Permission is granted to temporarily download one copy of the materials (information or software) on Vidify's website for personal, non-commercial transitory viewing only.
                            You must not use this service to download content that is copyrighted or for which you do not have permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">3. Disclaimer</h2>
                        <p>
                            The materials on Vidify's website are provided on an 'as is' basis. Vidify makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">4. Limitations</h2>
                        <p>
                            In no event shall Vidify or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Vidify's website.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}
