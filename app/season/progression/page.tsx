import { ProgressionExplorer } from "@/components/season/progression-explorer"
import { SeasonFrame } from "@/components/season/season-frame"
import { getF1SeasonData } from "@/lib/f1-season"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"
import { SITE_URL } from "@/lib/site"

export const revalidate = 21600

const PATH = "/season/progression"
const TITLE = "F1 championship points progression | Amakuru Motorsport"
const DESCRIPTION = "Compare cumulative Formula 1 driver and constructor points after every completed round, including sprint points, with custom driver and team filters."

export const metadata = seasonMetadata(TITLE, DESCRIPTION, PATH)

export default async function ProgressionPage() {
  const data = await getF1SeasonData()
  return (
    <SeasonFrame
      current={PATH}
      year={data.season}
      updatedAt={data.updatedAt}
      kicker="CHAMPIONSHIP PROGRESSION"
      title="Points, round by round."
      dek="Follow each driver or constructor as the season moves. The chart uses classified Jolpica results and sprint points, cached for six hours."
      heroImage="/images/rwanda-racing-hero.webp"
      imageCredits={data.gridDrivers.map((driver) => driver.imageCredit)}
      crumbs={[{ label: "Home", href: "/" }, { label: "Season", href: "/season" }, { label: "Progression" }]}
      jsonLd={[
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: `${data.season} F1 season`, path: "/season" },
          { name: "Championship progression", path: PATH },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          url: `${SITE_URL}${PATH}`,
          name: TITLE,
          description: DESCRIPTION,
          dateModified: data.updatedAt,
        },
      ]}
    >
      <section className="progression-section">
        <div className="progression-heading">
          <p className="label label-acid">POINTS AFTER EACH ROUND</p>
          <h2 className="season-section-title">Choose your championship battle.</h2>
          <p className="season-support">Select drivers or constructors, then switch between a focused comparison and the full field. Sprint and Grand Prix points are included in the round total.</p>
        </div>
        {data.unavailable
          ? <p className="season-empty">The championship feed is unavailable at the moment.</p>
          : <ProgressionExplorer progression={data.progression} />}
      </section>
      <div className="season-jump-links"><a href="/season">Back to the season hub</a><a href="/season/standings">Current standings</a></div>
    </SeasonFrame>
  )
}
