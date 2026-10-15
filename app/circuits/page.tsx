import type { Metadata } from "next"
import { SeasonFrame } from "@/components/season/season-frame"
import { SeasonUnavailable } from "@/components/season/season-unavailable"
import { formatKigaliDateTime, getF1SeasonData, placeName, type F1Race } from "@/lib/f1-season"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"
import { SITE_URL } from "@/lib/site"

const PATH = "/circuits"
export const revalidate = 21600

function uniqueCircuits(races: F1Race[]): F1Race[] {
  const byId = new Map<string, F1Race>()
  for (const race of races) {
    const id = race.Circuit?.circuitId
    if (id && !byId.has(id)) byId.set(id, race)
  }
  return Array.from(byId.values()).sort((a, b) => Number(a.round) - Number(b.round))
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getF1SeasonData()
  const title = `${data.season} Formula 1 circuits and race guide | Amakuru`
  const description = `Browse the ${data.season} Formula 1 circuit list, race locations and dates in Kigali time, with one page for every scheduled venue.`
  return seasonMetadata(title, description, PATH)
}

export default async function CircuitsPage() {
  const data = await getF1SeasonData()
  const circuits = uniqueCircuits(data.races)
  const title = `${data.season} Formula 1 circuits | Amakuru`
  const description = `The ${data.season} Formula 1 calendar by circuit, with locations and scheduled race dates in Kigali time.`
  const jsonLd = [
    breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Season", path: "/season" }, { name: "Circuits", path: PATH }]),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description,
      url: `${SITE_URL}${PATH}`,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: circuits.map((race, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: race.Circuit?.circuitName || race.raceName || "Circuit",
          url: `${SITE_URL}${PATH}/${race.Circuit?.circuitId}`,
        })),
      },
    },
  ]

  return (
    <SeasonFrame
      current={PATH}
      year={data.season}
      updatedAt={data.updatedAt}
      kicker="THE VENUES"
      title={`${data.season} circuits.`}
      dek="Explore the venues on the season calendar. Locations and race dates are shown in Kigali time; every circuit image is individually credited."
      crumbs={[{ label: "Home", href: "/" }, { label: "Season", href: "/season" }, { label: "Circuits" }]}
      jsonLd={jsonLd}
      imageCredits={circuits.map((race) => race.imageCredit)}
    >
      {data.unavailable ? <SeasonUnavailable /> : (
        <>
          <p className="season-support">The 2026 season feed lists {circuits.length} distinct circuits. Venue-specific lap lengths and turn counts are shown only when separately verified.</p>
          <div className="circuit-grid">
            {circuits.map((race) => {
              const id = race.Circuit?.circuitId || ""
              const name = race.Circuit?.circuitName || race.raceName || "Grand Prix circuit"
              return (
                <a className="circuit-card" href={`${PATH}/${id}`} key={id}>
                  {race.image ? <img src={race.image} alt={`${name} circuit`} loading="lazy" decoding="async" /> : <span className="circuit-card-art" aria-hidden="true"><i /></span>}
                  <span className="directory-kicker">ROUND {race.round || "—"} · {data.season}</span>
                  <h2>{name}</h2>
                  <p>{placeName(race)}</p>
                  <time dateTime={race.date}>{formatKigaliDateTime(race)}</time>
                </a>
              )
            })}
          </div>
          {circuits.length === 0 && <p className="season-empty">Circuit details will appear when the calendar feed is available.</p>}
        </>
      )}
    </SeasonFrame>
  )
}
