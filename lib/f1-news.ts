import { XMLParser } from "fast-xml-parser"

export const NEWS_REFRESH_SECONDS = 15 * 60

export type F1NewsItem = {
  title: string
  href: string
  publishedAt: string
  sourceName: string
  sourceUrl: string
  imageUrl?: string
}

type FeedConfig = {
  name: string
  feedUrl: string
  siteUrl: string
  hosts: string[]
  imageHosts?: string[]
}

const FEEDS: FeedConfig[] = [
  {
    name: "BBC Sport",
    feedUrl: "https://feeds.bbci.co.uk/sport/formula1/rss.xml",
    siteUrl: "https://www.bbc.co.uk/sport/formula1",
    hosts: ["bbc.co.uk", "bbc.com"],
    imageHosts: ["ichef.bbci.co.uk", "ichef.bbc.net.uk"],
  },
  {
    name: "Motorsport.com",
    feedUrl: "https://www.motorsport.com/rss/f1/news/",
    siteUrl: "https://www.motorsport.com/f1/",
    hosts: ["motorsport.com"],
  },
]

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
  parseTagValue: false,
  parseAttributeValue: false,
  removeNSPrefix: true,
})

type XmlNode = string | number | boolean | null | undefined | Record<string, unknown>

function asArray(value: unknown): unknown[] {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

function text(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value).trim()
  if (!value || typeof value !== "object") return ""
  const record = value as Record<string, unknown>
  return text(record["#text"] ?? record["#cdata"] ?? record.__cdata ?? "")
}

function allowedUrl(raw: string, domains: string[]): string | null {
  try {
    const url = new URL(raw)
    if (url.protocol !== "https:") return null
    const host = url.hostname.toLowerCase()
    if (!domains.some((domain) => host === domain || host.endsWith(`.${domain}`))) return null
    return url.href
  } catch {
    return null
  }
}

function parseFeed(xml: string, feed: FeedConfig): F1NewsItem[] {
  const parsed = parser.parse(xml) as Record<string, XmlNode>
  const root = (parsed.rss ?? parsed["rdf:RDF"] ?? parsed) as Record<string, unknown>
  const channel = (root.channel ?? root) as Record<string, unknown>
  const entries = asArray(channel.item)

  return entries.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return []
    const item = entry as Record<string, unknown>
    const title = text(item.title)
    const href = allowedUrl(text(item.link), feed.hosts)
    const dateRaw = text(item.pubDate ?? item.date ?? item.published)
    const timestamp = Date.parse(dateRaw)
    if (!title || !href || !Number.isFinite(timestamp)) return []

    let imageUrl: string | undefined
    if (feed.imageHosts?.length) {
      const media = item.thumbnail ?? item.content
      const mediaUrl = media && typeof media === "object"
        ? text((media as Record<string, unknown>)["@_url"] ?? (media as Record<string, unknown>)["@_href"])
        : ""
      const enclosure = item.enclosure
      const enclosureUrl = enclosure && typeof enclosure === "object"
        ? text((enclosure as Record<string, unknown>)["@_url"])
        : ""
      imageUrl = allowedUrl(mediaUrl || enclosureUrl, feed.imageHosts) ?? undefined
    }

    return [{
      title,
      href,
      publishedAt: new Date(timestamp).toISOString(),
      sourceName: feed.name,
      sourceUrl: feed.siteUrl,
      ...(imageUrl ? { imageUrl } : {}),
    }]
  })
}

async function fetchFeed(feed: FeedConfig): Promise<F1NewsItem[]> {
  try {
    const response = await fetch(feed.feedUrl, {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
        "User-Agent": "Amakuru Motorsport (https://www.amakuru.rw; non-commercial F1 news links)",
      },
      next: { revalidate: NEWS_REFRESH_SECONDS },
    })
    if (!response.ok) return []
    return parseFeed(await response.text(), feed)
  } catch {
    return []
  }
}

export async function getF1News(limit = 18): Promise<F1NewsItem[]> {
  const feedResults = await Promise.all(FEEDS.map(fetchFeed))
  const unique = new Map<string, F1NewsItem>()
  for (const item of feedResults.flat().sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))) {
    const key = `${new URL(item.href).hostname}${new URL(item.href).pathname}`
    if (!unique.has(key)) unique.set(key, item)
  }
  return Array.from(unique.values()).slice(0, Math.max(0, limit))
}

export function isRwandaRelatedNews(item: F1NewsItem): boolean {
  return /rwanda|kigali|bugesera|africa|african/i.test(item.title)
}
