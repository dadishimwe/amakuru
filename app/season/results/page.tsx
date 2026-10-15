import { ResultsExplorer } from "@/components/season/results-explorer"
import { SeasonUnavailable } from "@/components/season/season-unavailable"
import { SeasonFrame } from "@/components/season/season-frame"
import { getF1SeasonData } from "@/lib/f1-season"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"
import { SITE_URL } from "@/lib/site"

export const revalidate = 21600

const PATH = "/season/results"
const TITLE = "2026 F1 race results | Amakuru Motorsport"
const DESCRIPTION = "Full Formula 1 race classification for every 2026 round: finishing order, grid, laps, time and points, with links to each driver and team."

export const metadata = seasonMetadata(TITLE, DESCRIPTION, PATH)

export default async function ResultsPage({ searchParams }: { searchParams: Promise<{ round?: string }> }) {
  const { round } = await searchParams
  const data = await getF1SeasonData()
  const selected = data.classifiedRaces.find((race) => race.round === round) ?? data.classifiedRaces.at(-1)

  return (
    <SeasonFrame
      current={PATH}
      year={data.season}
      updatedAt={data.updatedAt}
      kicker="CLASSIFIED RESULTS"
      title={`${data.season} race results.`}
      dek="Pick any completed round and read the full classification. Every driver and team links through to their season page."
      heroImage="/images/rwanda-racing-hero.webp"
      imageCredits={data.classifiedRaces.flatMap((race) => [race.imageCredit, ...race.results.map((result) => result.driverImageCredit)])}
      crumbs={[{ label: "Home", href: "/" }, { label: "Season", href: "/season" }, { label: "Results" }]}
      jsonLd={[
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: `${data.season} F1 season`, path: "/season" },
          { name: "Results", path: PATH },
        ]),
        ...(selected ? [{
          "@context": "https://schema.org",
          "@type": "SportsEvent",
          name: selected.name,
          description: `${selected.name} classification, ${selected.when}.`,
          url: `${SITE_URL}${PATH}?round=${selected.round}`,
          location: selected.place,
        }] : []),
      ]}
    >
      {data.unavailable ? <SeasonUnavailable /> : <ResultsExplorer races={data.classifiedRaces} initialRound={round} />}
    </SeasonFrame>
  )
}
