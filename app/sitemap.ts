import type { MetadataRoute } from "next"
import { getF1SeasonData } from "@/lib/f1-season"
import { SITE_URL } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  const data = await getF1SeasonData()

  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/rwanda-f1-grand-prix`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/road-to-rwanda`, lastModified, changeFrequency: "monthly", priority: 0.8 },
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
