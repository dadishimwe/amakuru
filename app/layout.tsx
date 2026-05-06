import React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, IBM_Plex_Sans } from "next/font/google"
import { Courier_Prime } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SeoJsonLd } from "@/components/seo-json-ld"
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _courierPrime = Courier_Prime({ weight: ["400", "700"], subsets: ["latin"] })
const _ibmPlexSans = IBM_Plex_Sans({ weight: ["300", "400", "500", "600"], subsets: ["latin"] })

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Rwanda-first news, verified`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "news",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      rw: "/",
      fr: "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR"],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Rwanda-first news, verified`,
    description:
      "Credibility scoring, community verification, journalist development, and multilingual audio summaries for Rwanda and the region.",
    images: [
      {
        url: "/images/arc.png",
        alt: "Amakuru — visual identity and platform preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Rwanda-first news, verified`,
    description:
      "Credibility scoring, community verification, and multilingual audio summaries.",
    images: ["/images/arc.png"],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[200] -translate-y-20 rounded-lg bg-[#111] px-4 py-2 text-sm font-medium text-white opacity-0 shadow-lg transition focus:translate-y-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#111] focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <SeoJsonLd />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
