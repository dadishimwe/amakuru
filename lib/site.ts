/** Canonical site origin — no trailing slash. Override in Vercel with NEXT_PUBLIC_SITE_URL for previews. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://amakuru.rw"
)

export const SITE_NAME = "Amakuru"

export const SITE_DESCRIPTION =
  "Amakuru is a Rwanda-first news platform: source credibility scoring, community verification, journalist development, and audio summaries in Kinyarwanda, English, and French."

export const SITE_KEYWORDS = [
  "Rwanda news",
  "Amakuru",
  "Kinyarwanda news",
  "East Africa news",
  "news verification",
  "fact checking Rwanda",
  "community journalism",
  "misinformation",
  "data journalism",
  "solutions journalism",
  "Kigali",
  "NISR",
  "radio news Rwanda",
] as const
