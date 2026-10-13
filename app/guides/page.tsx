import { ArticleFrame } from "@/components/article-frame"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"
import { SITE_URL } from "@/lib/site"

const PATH = "/guides"
const TITLE = "Formula 1 guides | Amakuru Motorsport"
const DESCRIPTION = "Plain-language Formula 1 guides from Amakuru: a Grand Prix weekend, the undercut, and how championship points work."

export const metadata = seasonMetadata(TITLE, DESCRIPTION, PATH)

const GUIDES = [
  {
    href: "/guides/grand-prix-weekend",
    label: "THE WEEKEND",
    title: "How a Grand Prix weekend works",
    dek: "Practice, qualifying, sprint rounds and the race, and where to read those times in Kigali.",
  },
  {
    href: "/guides/undercut",
    label: "THE TACTIC",
    title: "What is an undercut?",
    dek: "Why a car pits early, what the overcut is, and why fresh tyres do not always win the stop.",
  },
  {
    href: "/guides/championship-points",
    label: "THE TABLE",
    title: "How championship points work",
    dek: "The race scale, the shorter sprint scale, and why Amakuru prints the points from the classification.",
  },
]

export default function GuidesPage() {
  return (
    <ArticleFrame
      kicker="AM / GUIDES"
      label="EVERGREEN"
      title="The sport, in plain language."
      dek="Three short guides. They do not depend on a live feed, and they do not guess at a Rwanda race date."
      crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }]}
      jsonLd={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Guides", path: PATH }])}
    >
      <p className="article-lede">
        Use these when the season pages assume a word you have not met yet. Then go back to the calendar, which is kept in Kigali time.
      </p>
      <div className="guide-index">
        {GUIDES.map((guide) => (
          <a key={guide.href} href={guide.href}>
            <span className="coverage-tag">{guide.label}</span>
            <h2>{guide.title}</h2>
            <p>{guide.dek}</p>
          </a>
        ))}
      </div>
      <p className="article-source-note">
        The season hub at <a href="/season">/season</a> is separate: it shows this year's rounds from the cached championship feed. These guides stay put between weekends.
      </p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Amakuru Formula 1 guides",
        itemListElement: GUIDES.map((guide, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: guide.title,
          url: `${SITE_URL}${guide.href}`,
        })),
      }).replace(/</g, "\\u003c") }} />
    </ArticleFrame>
  )
}
