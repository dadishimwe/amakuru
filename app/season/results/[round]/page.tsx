import { notFound } from "next/navigation"
import { RaceLapChart } from "@/components/season/race-lap-chart"
import { SeasonFrame } from "@/components/season/season-frame"
import { getF1SeasonData, getRaceLapData } from "@/lib/f1-season"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"
import { SITE_URL } from "@/lib/site"

export const revalidate = 21600

const PATH = "/season/results"

export async function generateMetadata({ params }: { params: Promise<{ round: string }> }) {
  const { round } = await params
  const data = await getF1SeasonData()
  const race = data.classifiedRaces.find((item) => item.round === round)
  const title = `${race?.name || `Round ${round}`} lap-by-lap positions | Amakuru Motorsport`
  const description = `Compare the starting grid with lap-by-lap recorded positions and the classified finish for ${race?.name || `round ${round}`} of the ${data.season} Formula 1 season.`
  return seasonMetadata(title, description, `${PATH}/${round}`)
}

export default async function RaceProgressPage({ params }: { params: Promise<{ round: string }> }) {
  const { round } = await params
  const data = await getF1SeasonData()
  const race = data.classifiedRaces.find((item) => item.round === round)
  if (!race) notFound()
  const lapData = await getRaceLapData(data.season, race.round)
  const title = `${race.name} lap-by-lap positions`
  const description = `Starting grid, recorded lap positions and the classified finish for ${race.name}.`

  return (
    <SeasonFrame
      current={PATH}
      year={data.season}
      updatedAt={data.updatedAt}
      kicker="RACE PROGRESS"
      title={`${race.name}.`}
      dek="From the starting grid to the final classification, lap by lap — using the Jolpica timing feed, not live telemetry."
      heroImage="/images/rwanda-racing-hero.webp"
      imageCredits={race.imageCredit ? [race.imageCredit] : []}
      crumbs={[{ label: "Home", href: "/" }, { label: "Season", href: "/season" }, { label: "Results", href: "/season/results" }, { label: race.name }]}
      jsonLd={[
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: `${data.season} F1 season`, path: "/season" },
          { name: "Results", path: "/season/results" },
          { name: title, path: `${PATH}/${race.round}` },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "SportsEvent",
          name: race.name,
          description,
          url: `${SITE_URL}${PATH}/${race.round}`,
          location: race.place,
          eventStatus: "https://schema.org/EventCompleted",
        },
      ]}
    >
      <p className="season-support race-progress-support">{race.place} · {race.when} · Round {race.round}</p>
      <RaceLapChart race={race} lapData={lapData} />
      <div className="season-jump-links race-progress-links">
        <a href={`/season/results?round=${race.round}`}>Full classified result</a>
        <a href="/season/progression">Championship progression</a>
      </div>
    </SeasonFrame>
  )
}
