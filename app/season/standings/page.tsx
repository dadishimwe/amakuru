import { SeasonFrame } from "@/components/season/season-frame"
import { SeasonUnavailable } from "@/components/season/season-unavailable"
import { StandingsExplorer } from "@/components/season/standings-explorer"
import { getF1SeasonData } from "@/lib/f1-season"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"

export const revalidate = 21600

const PATH = "/season/standings"
const TITLE = "2026 F1 driver and constructor standings | Amakuru Motorsport"
const DESCRIPTION = "Live Formula 1 drivers' and constructors' championship tables, with points, wins, and links to every driver and team."

export const metadata = seasonMetadata(TITLE, DESCRIPTION, PATH)

export default async function StandingsPage() {
  const data = await getF1SeasonData()
  return (
    <SeasonFrame
      current={PATH}
      year={data.season}
      updatedAt={data.updatedAt}
      kicker="CHAMPIONSHIP TABLES"
      title={`${data.season} standings.`}
      dek="The full drivers' and constructors' championships. Search a name, then open a driver or team for the races behind the points."
      heroImage="/images/rwanda-racing-hero.webp"
      imageCredits={data.gridDrivers.map((driver) => driver.imageCredit)}
      crumbs={[{ label: "Home", href: "/" }, { label: "Season", href: "/season" }, { label: "Standings" }]}
      jsonLd={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: `${data.season} F1 season`, path: "/season" },
        { name: "Standings", path: PATH },
      ])}
    >
      {data.unavailable ? <SeasonUnavailable /> : <StandingsExplorer
        drivers={data.driverStandings}
        teams={data.constructorStandings}
        driverImages={Object.fromEntries(data.gridDrivers.map((driver) => [driver.id, driver.image]))}
        teamImages={Object.fromEntries(data.gridTeams.map((team) => [team.id, team.image]))}
      />}
    </SeasonFrame>
  )
}
