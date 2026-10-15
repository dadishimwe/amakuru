import type { Metadata } from "next"
import { ArticleFrame } from "@/components/article-frame"
import { TECH_TOPICS } from "@/lib/technology"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"
import { SITE_NAME, SITE_URL } from "@/lib/site"

const PATH = "/technology"
const TITLE = "2026 Formula 1 technology explained | Amakuru Motorsport"
const DESCRIPTION = "Source-linked Formula 1 explainers for 2026 car design, the hybrid power unit and tyres, plus a walk-around of a fan-made Red Bull RB22."

export const metadata: Metadata = seasonMetadata(TITLE, DESCRIPTION, PATH)

export default function TechnologyPage() {
  const jsonLd = [
    breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Technology", path: PATH }]),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}${PATH}`,
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: [
          ...TECH_TOPICS.map((topic, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: topic.title,
            url: `${SITE_URL}${PATH}/${topic.slug}`,
          })),
          {
            "@type": "ListItem",
            position: TECH_TOPICS.length + 1,
            name: "Walk around the 2026 Red Bull RB22",
            url: `${SITE_URL}${PATH}/rb22`,
          },
        ],
      },
    },
  ]

  return (
    <ArticleFrame
      kicker="AM / TECHNICAL NOTES"
      label="2026 RULES · PLAIN LANGUAGE"
      title="The machinery, made clear."
      dek="Three original schematics, plus a walk-around of Dave’s CC BY model of the 2026 Red Bull RB22. The drawings are unbranded. The model is not."
      crumbs={[{ label: "Home", href: "/" }, { label: "Technology" }]}
      jsonLd={jsonLd}
    >
      <p className="article-lede">The headline numbers first. The useful explanation second. Official sources at the end of every page.</p>
      <div className="technology-index">
        {TECH_TOPICS.map((topic, index) => (
          <a className="technology-card" href={`${PATH}/${topic.slug}`} key={topic.slug}>
            <span className="coverage-tag">0{index + 1} · {topic.label}</span>
            <figure><img src={topic.diagram} alt={topic.diagramAlt} loading="lazy" decoding="async" /></figure>
            <h2>{topic.title}</h2>
            <p>{topic.dek}</p>
            <span className="technology-card-link">Read the explainer <span aria-hidden="true">→</span></span>
          </a>
        ))}
        <a className="technology-card technology-card-model" href="/technology/rb22">
          <span className="coverage-tag">04 · A FAN MODEL</span>
          <figure><span>RB22</span></figure>
          <h2>Walk around a 2026 Red Bull.</h2>
          <p>Dave’s model stays on screen. Scrolling turns the camera from the side, to the nose, to the tail, then overhead.</p>
          <span className="technology-card-link">Open the walk-around <span aria-hidden="true">→</span></span>
        </a>
      </div>
      <p className="article-source-note">The illustrations are Amakuru schematics, not official Formula 1 technical drawings. The RB22 viewer is a separate fan model by Dave, used under CC BY 4.0.</p>
    </ArticleFrame>
  )
}
