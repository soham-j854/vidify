import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vidify | Premium YouTube Video & Audio Downloader',
  description: 'Convert and download YouTube videos in 4K, 1080p, and MP3. Fast, free, and secure liquid-glass interface. No registration required.',
  keywords: ['youtube downloader', 'video converter', '4k video download', 'mp3 converter', 'youtube to mp3', 'free video downloader', 'vidify'],
  authors: [{ name: 'Vidify Team' }],
  creator: 'Vidify',
  metadataBase: new URL('https://vidify.app'), // Replace with actual domain
  openGraph: {
    title: 'Vidify - Liquid Glass YouTube Downloader',
    description: 'Experience the most beautiful and fast YouTube downloader on the web. Download in 4K & MP3.',
    url: 'https://vidify.app',
    siteName: 'Vidify',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vidify - Premium Video Downloader',
    description: 'Download YouTube videos in style. 4K, MP3, and more.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Google AdSense Script Placeholder */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous"></script> */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="h-full antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  )
}

