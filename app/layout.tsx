import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, IBM_Plex_Sans } from 'next/font/google'
import { Courier_Prime } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _courierPrime = Courier_Prime({ weight: ["400", "700"], subsets: ["latin"] });
const _ibmPlexSans = IBM_Plex_Sans({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Amakuru — Rwanda-first news, verified',
  description: 'Amakuru is a Rwanda-first news platform combining source credibility scoring, community verification, journalist development, and audio-first summaries in Kinyarwanda, English, and French.',
  keywords: ['Rwanda news', 'amakuru', 'news aggregation', 'fact checking', 'community verification', 'Kinyarwanda', 'data journalism', 'solutions journalism'],
  authors: [{ name: 'Amakuru' }],
  openGraph: {
    title: 'Amakuru — Rwanda-first news, verified',
    description: 'A Rwanda-first news platform combining credibility scoring, community verification, and multilingual audio summaries.',
    type: 'website',
    url: 'https://amakuru.rw',
    siteName: 'Amakuru',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amakuru — Rwanda-first news, verified',
    description: 'Credibility scoring + community verification + multilingual audio summaries.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
