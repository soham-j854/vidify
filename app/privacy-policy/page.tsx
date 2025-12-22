import Link from 'next/link'

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-gray-300 p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mb-4">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </Link>

                <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

                <div className="glass-card p-8 space-y-6">
                    <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">1. Information We Collect</h2>
                        <p>
                            Vidify ("we", "our", or "us") operates as a tool site. We do not collect personal information (PII) such as names, email addresses, or phone numbers from our users.
                            Our server logs may collect standard information such as IP addresses, browser types, and access times for security and analytics purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">2. Cookies and Web Beacons</h2>
                        <p>
                            Like any other website, Vidify uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">3. Google DoubleClick DART Cookie</h2>
                        <p>
                            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet.
                            However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" className="text-indigo-400 hover:text-indigo-300 underline">https://policies.google.com/technologies/ads</a>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">4. Log Files</h2>
                        <p>
                            Vidify follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}
