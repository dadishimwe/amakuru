import { TeamsExplorer } from "@/components/season/directory-explorers"
import { SeasonFrame } from "@/components/season/season-frame"
import { getF1SeasonData } from "@/lib/f1-season"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"
import { SITE_URL } from "@/lib/site"

export const revalidate = 21600

const PATH = "/season/teams"
const TITLE = "2026 F1 teams and official websites | Amakuru Motorsport"
const DESCRIPTION = "All 2026 Formula 1 teams, their drivers and championship points, with links to each team's official website."

export const metadata = seasonMetadata(TITLE, DESCRIPTION, PATH)

export default async function TeamsPage() {
  const data = await getF1SeasonData()
  return (
    <SeasonFrame
      current={PATH}
      year={data.season}
      updatedAt={data.updatedAt}
      kicker="THE CONSTRUCTORS"
      title={`${data.season} teams.`}
      dek="Browse the constructors, open a team page, or go straight to the team's official website."
      heroImage="/images/rwanda-racing-hero.webp"
      crumbs={[{ label: "Home", href: "/" }, { label: "Season", href: "/season" }, { label: "Teams" }]}
      jsonLd={[
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: `${data.season} F1 season`, path: "/season" },
          { name: "Teams", path: PATH },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${data.season} Formula 1 teams`,
          itemListElement: data.gridTeams.map((team, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${SITE_URL}/season/teams/${team.id}`,
            name: team.name,
          })),
        },
      ]}
    >
      <TeamsExplorer teams={data.gridTeams} />
    </SeasonFrame>
  )
}
