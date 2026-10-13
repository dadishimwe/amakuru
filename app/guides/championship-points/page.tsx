import { ArticleFrame } from "@/components/article-frame"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"
import { SITE_NAME, SITE_URL } from "@/lib/site"

const PATH = "/guides/championship-points"
const TITLE = "How championship points work | Amakuru Motorsport"
const DESCRIPTION = "How Formula 1 race and sprint points feed the drivers' and constructors' championships, and how Amakuru shows the classified points."
const FIA_REGULATIONS = "https://www.fia.com/regulation/category/110"

export const metadata = seasonMetadata(TITLE, DESCRIPTION, PATH)

export default function PointsGuide() {
  return (
    <ArticleFrame
      kicker="AM / GUIDE"
      label="THE TABLE"
      title="How championship points work."
      dek="Two tables share one season: drivers, and the teams that add their drivers' points together."
      crumbs={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: "Points" }]}
      jsonLd={[
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: "How championship points work", path: PATH },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "How championship points work",
          description: DESCRIPTION,
          url: `${SITE_URL}${PATH}`,
          author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        },
      ]}
    >
      <p className="article-lede">
        A Grand Prix pays the first ten finishers. A sprint pays a shorter scale to fewer cars. Both counts go into the same championships. The sporting regulations are the authority if a season changes the numbers.
      </p>
      <section>
        <h2>The race</h2>
        <p>
          The familiar Grand Prix scale is 25, 18, 15, 12, 10, 8, 6, 4, 2 and 1, from first place to tenth. Finish outside the first ten and the race adds nothing to the table. A retirement is not a placing.
        </p>
      </section>
      <section>
        <h2>The sprint</h2>
        <p>
          On a sprint weekend the short race has its own result. Its scale is smaller: eight points for the winner, then seven down to one point for eighth. Those points are real championship points. They are not a rehearsal for Sunday.
        </p>
      </section>
      <section>
        <h2>Drivers and teams</h2>
        <p>
          Each driver keeps the points scored in their car. A team keeps the points of its drivers. That is why a constructor can lead while neither of its drivers leads the other table. Switching teams mid-season does not move points already scored for the previous team.
        </p>
      </section>
      <section>
        <h2>What Amakuru prints</h2>
        <p>
          The standings and the race tables repeat the points on the classification. Amakuru does not recalculate them and does not add a bonus the feed did not record. If the official scale changes, the feed is what the pages follow, and the FIA regulations are where the rule is written.
        </p>
        <a className="source-link" href="/season/standings">Open the standings</a>
        <a className="source-link" href={FIA_REGULATIONS} target="_blank" rel="noreferrer">FIA Formula 1 regulations ↗</a>
      </section>
    </ArticleFrame>
  )
}
