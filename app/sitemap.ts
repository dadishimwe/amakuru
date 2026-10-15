import type { MetadataRoute } from "next"
import { getF1News } from "@/lib/f1-news"
import { getF1SeasonData } from "@/lib/f1-season"
import { SITE_URL } from "@/lib/site"
import { TECH_TOPICS } from "@/lib/technology"

export const revalidate = 900

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  const [data, news] = await Promise.all([getF1SeasonData(), getF1News(1)])
  const circuitIds = Array.from(new Set(data.races.map((race) => race.Circuit?.circuitId).filter((id): id is string => Boolean(id))))
  const newsModified = news[0]?.publishedAt ? new Date(news[0].publishedAt) : lastModified

  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/rwanda-f1-grand-prix`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/road-to-rwanda`, lastModified, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/news`, lastModified: newsModified, changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE_URL}/circuits`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/technology`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    ...TECH_TOPICS.map((topic) => ({
      url: `${SITE_URL}/technology/${topic.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...circuitIds.map((id) => ({
      url: `${SITE_URL}/circuits/${id}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    { url: `${SITE_URL}/guides`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/guides/grand-prix-weekend`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/guides/undercut`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/guides/championship-points`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/season`, lastModified, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/season/results`, lastModified, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/season/standings`, lastModified, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/season/drivers`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/season/teams`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    ...data.gridDrivers.map((driver) => ({
      url: `${SITE_URL}/season/drivers/${driver.id}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...data.gridTeams.map((team) => ({
      url: `${SITE_URL}/season/teams/${team.id}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ]
}
