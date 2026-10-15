import type { Metadata } from "next"
import { ArticleFrame } from "@/components/article-frame"
import { TECH_TOPICS } from "@/lib/technology"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"
import { SITE_NAME, SITE_URL } from "@/lib/site"

const PATH = "/technology"
const TITLE = "2026 Formula 1 technology explained | Amakuru Motorsport"
const DESCRIPTION = "Minimal, source-linked Formula 1 explainers for 2026 car design, hybrid power units and tyres, with original technical diagrams."

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
        itemListElement: TECH_TOPICS.map((topic, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: topic.title,
          url: `${SITE_URL}${PATH}/${topic.slug}`,
        })),
      },
    },
  ]

  return (
    <ArticleFrame
      kicker="AM / TECHNICAL NOTES"
      label="2026 RULES · PLAIN LANGUAGE"
      title="The machinery, made clear."
      dek="Three compact explainers on the car, the hybrid system and the tyres. Each drawing is original, unbranded and labelled as a schematic."
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
      </div>
      <p className="article-source-note">The illustrations are Amakuru schematics, not official Formula 1 technical drawings, CAD, component layouts or scale models.</p>
    </ArticleFrame>
  )
}
