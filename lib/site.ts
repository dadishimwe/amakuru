/** Canonical site origin — no trailing slash. Preview origins may be supplied with NEXT_PUBLIC_SITE_URL. */
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")
const normalizedConfiguredUrl =
  configuredSiteUrl?.toLowerCase() === "https://amakuru.rw"
    ? "https://www.amakuru.rw"
    : configuredSiteUrl

export const SITE_URL = normalizedConfiguredUrl || "https://www.amakuru.rw"

export const SITE_NAME = "Amakuru Motorsport"

export const SITE_DESCRIPTION =
  "Independent Formula 1 news and context from Rwanda: the road to the African Grand Prix, race-weekend updates, and the stories behind African motorsport."

export const SITE_KEYWORDS = [
  "Formula 1 Rwanda",
  "Rwanda F1 Grand Prix",
  "Rwanda Grand Prix",
  "Formula 1 African Grand Prix",
  "F1 calendar 2026",
  "F1 standings 2026",
  "Kigali motorsport",
  "Amakuru Motorsport",
] as const
