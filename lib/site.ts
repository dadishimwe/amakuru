/** Canonical site origin — no trailing slash. Override in Vercel with NEXT_PUBLIC_SITE_URL for previews. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://amakuru.rw"
)

export const SITE_NAME = "Amakuru Motorsport"

export const SITE_DESCRIPTION =
  "Formula 1 news, context and the road to Rwanda's African Grand Prix — told from a Rwanda-first perspective."

export const SITE_KEYWORDS = [
  "Formula 1 Rwanda",
  "Rwanda Grand Prix",
  "African Grand Prix",
  "Formula 1 Africa",
  "Amakuru Motorsport",
  "Kigali motorsport",
  "Rwanda motorsport",
  "F1 news Rwanda",
  "Visit Rwanda Grand Prix",
] as const
