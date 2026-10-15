import { ArticleFrame } from "@/components/article-frame"
import { NewsCards } from "@/components/news/news-cards"
import { getF1News, isRwandaRelatedNews } from "@/lib/f1-news"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"
import { SITE_NAME, SITE_URL } from "@/lib/site"

const PATH = "/road-to-rwanda"
const TITLE = "Road to Rwanda | Amakuru Motorsport"
const DESCRIPTION = "A short desk on Formula 1's road to Rwanda: the FIA announcement, the Kigali awards, and the questions that are still open."
const FIA_ANNOUNCEMENT = "https://api.fia.com/news/formula-1-returns-africa-10-year-agreement-race-rwanda"
const FIA_KIGALI_AWARDS = "https://api.fia.com/news/landmark-fia-awards-see-2024-fia-champions-crowned-rwanda"

export const metadata = seasonMetadata(TITLE, DESCRIPTION, PATH)
export const revalidate = 900

export default async function RoadToRwandaPage() {
  const rwandaStories = (await getF1News(24)).filter(isRwandaRelatedNews).slice(0, 6)
  return (
    <ArticleFrame
      kicker="AM / DESK 001"
      label="ROAD TO RWANDA"
      title="Three ways to read the road to Rwanda."
      dek="Each note is labeled. An official announcement is not the same thing as a report, and an open question is not a date."
      crumbs={[{ label: "Home", href: "/" }, { label: "Road to Rwanda" }]}
      jsonLd={[
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Road to Rwanda", path: PATH }]),
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Road to Rwanda",
          description: DESCRIPTION,
          url: `${SITE_URL}${PATH}`,
          author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          publisher: { "@id": `${SITE_URL}/#organization` },
        },
      ]}
    >
      <p className="article-lede">
        Amakuru follows the championship from Kigali, and the longer story of a Grand Prix in Rwanda. These three notes are the start of that desk.
      </p>

      <section id="announcement">
        <span className="coverage-tag">OFFICIAL ANNOUNCEMENT</span>
        <h2>The FIA has set the direction.</h2>
        <p>
          The FIA and Formula 1 have announced a 10-year agreement for the Formula 1 African Grand Prix, presented by Visit Rwanda, to join the calendar in the early 2030s. The first race is tied to a new circuit in Bugesera.
        </p>
        <p>
          That is the confirmed frame: a decade-long agreement, an early-2030s window, and a purpose-built circuit rather than a published race date.
        </p>
        <a className="source-link" href="/rwanda-f1-grand-prix">Read the Rwanda F1 guide</a>
        <a className="source-link" href={FIA_ANNOUNCEMENT} target="_blank" rel="noreferrer">FIA announcement ↗</a>
      </section>

      <section id="kigali-awards">
        <span className="coverage-tag">REPORTING</span>
        <h2>Kigali had already hosted the sport's night.</h2>
        <p>
          In December 2024, Rwanda hosted the FIA Awards in Kigali. The FIA described it as the first time that ceremony had been held on the African continent. Champions were crowned there, and the international motorsport community gathered in the city before any Grand Prix date existed.
        </p>
        <p>
          The awards are not the race. They are the earlier, documented moment that puts Kigali on the sport's map while the circuit and the calendar slot are still ahead.
        </p>
        <a className="source-link" href={FIA_KIGALI_AWARDS} target="_blank" rel="noreferrer">FIA Awards recap ↗</a>
      </section>

      <section id="open-questions">
        <span className="coverage-tag">OPEN QUESTION</span>
        <h2>What has not been announced.</h2>
        <p>
          No inaugural season, no race date, and no published circuit layout. The FIA has said further details on the first date, construction milestones and race plans will follow. A year named in a rumour is not a confirmed round.
        </p>
        <p>
          Amakuru will update this desk when those details are published by the FIA or Formula 1. Until then, the open questions stay open.
        </p>
      </section>

      <section id="latest-rwanda-coverage">
        <span className="coverage-tag">HEADLINES · SOURCE FIRST</span>
        <h2>Latest Rwanda and Africa coverage.</h2>
        <p>Recent publisher headlines mentioning Rwanda, Kigali or Africa. Open each story at its source; the reporting itself stays with the publisher.</p>
        <NewsCards items={rwandaStories} variant="compact" />
        <p className="article-source-note">Feeds are checked every 15 minutes. If no matching headlines are available, the wider <a href="/news">Formula 1 news desk</a> remains up to date.</p>
      </section>

      <section className="article-next">
        <p className="label">WHILE THE CALENDAR IS ELSEWHERE</p>
        <h2>Learn the weekend, then follow this season.</h2>
        <p>The guides explain a Grand Prix weekend, an undercut, and how points work. The season hub shows the current championship in Kigali time.</p>
        <a className="button button-acid" href="/guides">Open the guides</a>
        <div className="season-jump-links">
          <a href="/season">Schedule</a>
          <a href="/guides/grand-prix-weekend">A race weekend</a>
          <a href="/guides/undercut">The undercut</a>
          <a href="/guides/championship-points">Points</a>
        </div>
      </section>
    </ArticleFrame>
  )
}
