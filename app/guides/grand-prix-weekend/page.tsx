import { ArticleFrame } from "@/components/article-frame"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"
import { SITE_NAME, SITE_URL } from "@/lib/site"

const PATH = "/guides/grand-prix-weekend"
const TITLE = "How a Grand Prix weekend works | Amakuru Motorsport"
const DESCRIPTION = "What happens from practice to the race on a Formula 1 weekend, including how a sprint round changes the shape, with a link to Kigali times."

export const metadata = seasonMetadata(TITLE, DESCRIPTION, PATH)

export default function GrandPrixWeekendGuide() {
  return (
    <ArticleFrame
      kicker="AM / GUIDE"
      label="THE WEEKEND"
      title="How a Grand Prix weekend works."
      dek="A race is the last session, not the whole visit. The shape of the days changes when the round includes a sprint."
      crumbs={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: "A race weekend" }]}
      jsonLd={[
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: "How a Grand Prix weekend works", path: PATH },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "How a Grand Prix weekend works",
          description: DESCRIPTION,
          url: `${SITE_URL}${PATH}`,
          author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        },
      ]}
    >
      <p className="article-lede">
        Most rounds give the teams practice, then qualifying, then the Grand Prix. A sprint round compresses that order and adds a short race that also pays points.
      </p>
      <section>
        <h2>A standard round</h2>
        <p>
          Practice is where the cars run in the open and the teams learn the track. Qualifying sets the grid: it is usually three sessions, with the slowest cars dropped after the first two, and the final session deciding the first ten places. The Grand Prix is the long race. Its result is the one that fills the classification.
        </p>
      </section>
      <section>
        <h2>When there is a sprint</h2>
        <p>
          A sprint weekend still has one main Grand Prix, and it also has a shorter race. That sprint has its own qualifying and its own, smaller, points. The timetable moves. Do not assume Friday practice, Saturday qualifying and a Sunday race until you check that round.
        </p>
      </section>
      <section>
        <h2>Read it in Kigali time</h2>
        <p>
          Amakuru lists the current season's rounds in Kigali time on the schedule. Session names on that page follow the feed. If a time is missing, it has not been published there yet.
        </p>
        <a className="source-link" href="/season">Open the season schedule</a>
      </section>
      <p className="article-source-note">
        This is a guide to the shape of a weekend, not a live timing feed. Official session times belong to Formula 1 and the FIA.
      </p>
    </ArticleFrame>
  )
}
