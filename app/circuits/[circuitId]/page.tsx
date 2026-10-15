import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SeasonFrame } from "@/components/season/season-frame"
import { SeasonUnavailable } from "@/components/season/season-unavailable"
import { formatKigaliDateTime, getF1SeasonData, placeName, type F1Race } from "@/lib/f1-season"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"
import { SITE_URL } from "@/lib/site"

export const revalidate = 21600

function circuitRaces(races: F1Race[]) {
  const byId = new Map<string, F1Race>()
  for (const race of races) {
    const id = race.Circuit?.circuitId
    if (id && !byId.has(id)) byId.set(id, race)
  }
  return Array.from(byId.entries()).map(([circuitId, race]) => ({ circuitId, race }))
}

export async function generateStaticParams() {
  const data = await getF1SeasonData()
  return circuitRaces(data.races).map(({ circuitId }) => ({ circuitId }))
}

export async function generateMetadata({ params }: { params: Promise<{ circuitId: string }> }): Promise<Metadata> {
  const { circuitId } = await params
  const data = await getF1SeasonData()
  const race = data.races.find((item) => item.Circuit?.circuitId === circuitId)
  if (!race) return {}
  const name = race.Circuit?.circuitName || race.raceName || "F1 circuit"
  return seasonMetadata(
    `${name} circuit: ${data.season} Grand Prix guide | Amakuru`,
    `The ${data.season} ${race.raceName || "Grand Prix"} at ${name}: location, published race date in Kigali time and a credited circuit image.`,
    `/circuits/${circuitId}`,
    race.image,
  )
}

export default async function CircuitPage({ params }: { params: Promise<{ circuitId: string }> }) {
  const { circuitId } = await params
  const data = await getF1SeasonData()
  const race = data.races.find((item) => item.Circuit?.circuitId === circuitId)
  if (!race && data.unavailable) {
    return (
      <SeasonFrame
        current="/circuits"
        year={data.season}
        updatedAt={data.updatedAt}
        kicker="CIRCUIT"
        title="Circuit details are waiting on the calendar feed."
        dek="The championship source is unavailable, so the venue details are not being filled with placeholders."
        crumbs={[{ label: "Home", href: "/" }, { label: "Circuits", href: "/circuits" }, { label: "Circuit" }]}
        jsonLd={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Circuits", path: "/circuits" }])}
      ><SeasonUnavailable /></SeasonFrame>
    )
  }
  if (!race) notFound()

  const name = race.Circuit?.circuitName || race.raceName || "Grand Prix circuit"
  const location = placeName(race)
  const hasResult = data.classifiedRaces.some((classified) => classified.round === race.round)
  const path = `/circuits/${circuitId}`
  const startDate = race.date && race.time ? `${race.date}T${race.time}` : race.date
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: `${data.season} season`, path: "/season" },
      { name: "Circuits", path: "/circuits" },
      { name, path },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: race.raceName || `${name} Grand Prix`,
      url: `${SITE_URL}${path}`,
      ...(startDate ? { startDate } : {}),
      sport: "Formula 1",
      location: {
        "@type": "Place",
        name,
        address: {
          "@type": "PostalAddress",
          addressLocality: race.Circuit?.Location?.locality,
          addressCountry: race.Circuit?.Location?.country,
        },
      },
      image: race.image || `${SITE_URL}/images/rwanda-racing-hero.webp`,
    },
  ]

  return (
    <SeasonFrame
      current="/circuits"
      year={data.season}
      updatedAt={data.updatedAt}
      kicker={`ROUND ${race.round || "—"} · ${data.season}`}
      title={name}
      dek={`${race.raceName || "Grand Prix"} · ${location} · ${formatKigaliDateTime(race)} in Kigali time.`}
      crumbs={[{ label: "Home", href: "/" }, { label: "Circuits", href: "/circuits" }, { label: name }]}
      jsonLd={jsonLd}
      mark="TRACK"
      imageCredits={race.imageCredit ? [race.imageCredit] : []}
    >
      {race.image ? (
        <figure className="circuit-profile-image">
          <img src={race.image} alt={`${name} circuit image`} loading="lazy" decoding="async" />
          <figcaption>Licensed circuit image · creator and file licence listed below</figcaption>
        </figure>
      ) : null}
      <div className="circuit-facts">
        <div><span className="coverage-tag">LOCATION</span><strong>{location}</strong></div>
        <div><span className="coverage-tag">SCHEDULED RACE</span><strong>{formatKigaliDateTime(race)} · Kigali time</strong></div>
        <div><span className="coverage-tag">ROUND</span><strong>{race.round || "—"} / {data.races.length}</strong></div>
      </div>
      <section className="circuit-brief">
        <h2>Venue notes</h2>
        <p>This page is based on the published championship calendar and location record. Lap distance and corner count are not shown until verified; the licensed circuit artwork is reference imagery, not an official or guaranteed current layout.</p>
        <div className="season-jump-links">
          <a href="/season">Full calendar</a>
          {hasResult ? <a href={`/season/results?round=${race.round || ""}`}>Race classification</a> : <span className="jump-disabled">Result not yet published</span>}
          {race.url ? <a href={race.url} target="_blank" rel="noreferrer">Venue background ↗</a> : null}
        </div>
      </section>
      <p className="article-source-note">Circuit images are licensed individually and credited below. Circuit names are used editorially; no official Formula 1 or team marks are reproduced.</p>
    </SeasonFrame>
  )
}
