import { DriversExplorer } from "@/components/season/directory-explorers"
import { SeasonFrame } from "@/components/season/season-frame"
import { getF1SeasonData } from "@/lib/f1-season"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"
import { SITE_URL } from "@/lib/site"

export const revalidate = 21600

const PATH = "/season/drivers"
const TITLE = "2026 F1 drivers | Amakuru Motorsport"
const DESCRIPTION = "Every Formula 1 race driver in the 2026 championship: number, team, points and a season page for each driver."

export const metadata = seasonMetadata(TITLE, DESCRIPTION, PATH)

export default async function DriversPage() {
  const data = await getF1SeasonData()
  return (
    <SeasonFrame
      current={PATH}
      year={data.season}
      updatedAt={data.updatedAt}
      kicker="THE GRID"
      title={`${data.season} drivers.`}
      dek="Filter by team or search a driver. Each card opens a season page with every classified finish."
      heroImage="/images/rwanda-racing-hero.webp"
      crumbs={[{ label: "Home", href: "/" }, { label: "Season", href: "/season" }, { label: "Drivers" }]}
      jsonLd={[
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: `${data.season} F1 season`, path: "/season" },
          { name: "Drivers", path: PATH },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${data.season} Formula 1 drivers`,
          itemListElement: data.gridDrivers.map((driver, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${SITE_URL}/season/drivers/${driver.id}`,
            name: driver.name,
          })),
        },
      ]}
    >
      <DriversExplorer drivers={data.gridDrivers} />
    </SeasonFrame>
  )
}
