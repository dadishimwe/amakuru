import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArticleFrame } from "@/components/article-frame"
import { TECH_TOPICS, getTechTopic } from "@/lib/technology"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"
import { SITE_NAME, SITE_URL } from "@/lib/site"

export const dynamicParams = false

export function generateStaticParams() {
  return TECH_TOPICS.map(({ slug }) => ({ topic: slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic: slug } = await params
  const topic = getTechTopic(slug)
  if (!topic) return {}
  return seasonMetadata(`${topic.title} 2026 F1 technology | Amakuru`, topic.description, `/technology/${topic.slug}`)
}

export default async function TechnologyArticlePage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: slug } = await params
  const topic = getTechTopic(slug)
  if (!topic) notFound()
  const path = `/technology/${topic.slug}`
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Technology", path: "/technology" },
      { name: topic.title, path },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: topic.title,
      description: topic.description,
      url: `${SITE_URL}${path}`,
      image: `${SITE_URL}${topic.diagram}`,
      author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      publisher: { "@id": `${SITE_URL}/#organization` },
      mainEntityOfPage: `${SITE_URL}${path}`,
    },
  ]

  return (
    <ArticleFrame
      kicker="AM / TECHNICAL NOTES"
      label={topic.label}
      title={topic.title}
      dek={topic.dek}
      crumbs={[{ label: "Home", href: "/" }, { label: "Technology", href: "/technology" }, { label: topic.title }]}
      jsonLd={jsonLd}
    >
      <p className="article-lede">{topic.explanation}</p>
      <figure className="technical-illustration">
        <img src={topic.diagram} alt={topic.diagramAlt} width="1100" height="560" />
        <figcaption>Original Amakuru schematic · illustrative, not to scale or an official design</figcaption>
      </figure>
      <div className="technical-facts" aria-label="Key 2026 figures">
        {topic.facts.map((fact) => (
          <div className="technical-fact" key={fact.value}>
            <strong>{fact.value}</strong><span>{fact.label}</span>
          </div>
        ))}
      </div>
      {topic.details.map((detail) => (
        <section key={detail.heading}>
          <h2>{detail.heading}</h2>
          <p>{detail.text}</p>
        </section>
      ))}
      <section className="technical-sources">
        <h2>Sources and further reading</h2>
        <ul>
          {topic.sources.map((source) => (
            <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label} ↗</a></li>
          ))}
        </ul>
      </section>
      <p className="article-source-note">Figures are summarized from the cited sources and may change when regulations are updated. This page is independent and is not an official Formula 1 technical publication.</p>
    </ArticleFrame>
  )
}
