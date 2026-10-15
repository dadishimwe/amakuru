import type { Metadata } from "next"
import { SiteFooter, SiteNavigation } from "@/components/site-chrome"
import { Rb22StageLoader } from "@/components/technology/rb22-stage-loader"
import { RB22_CREDIT, RB22_VIEWS } from "@/lib/rb22-story"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"
import { SITE_NAME, SITE_URL } from "@/lib/site"

const PATH = "/technology/rb22"
const TITLE = "Walk around the 2026 Red Bull RB22 | Amakuru Motorsport"
const DESCRIPTION = "A scroll-through look at Dave’s CC BY model of the 2026 Red Bull RB22: side, front, rear and top, with what each view can and cannot tell you."

export const metadata: Metadata = seasonMetadata(TITLE, DESCRIPTION, PATH)

export default function Rb22Page() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Technology", path: "/technology" },
      { name: "2026 Red Bull RB22", path: PATH },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: "Walk around the 2026 Red Bull RB22",
      description: DESCRIPTION,
      url: `${SITE_URL}${PATH}`,
      author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      citation: RB22_CREDIT.modelUrl,
      isBasedOn: RB22_CREDIT.modelUrl,
    },
  ]

  return (
    <div className="site-shell rb22-shell">
      <div className="topline">
        <span>RWANDA'S HOME OF FORMULA 1</span>
        <span className="topline-right"><i aria-hidden="true" /> Kigali · Rwanda</span>
      </div>
      <SiteNavigation />
      <main id="main-content">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <span className="breadcrumb-item"><a href="/">Home</a></span>
          <span className="breadcrumb-item"><span aria-hidden="true">/</span><a href="/technology">Technology</a></span>
          <span className="breadcrumb-item"><span aria-hidden="true">/</span><span>RB22</span></span>
        </nav>
        <header className="rb22-intro">
          <div className="section-kicker">
            <span>AM / TECHNICAL NOTES</span><span className="kicker-line" /><span>A FAN MODEL</span>
          </div>
          <p className="label">2026 RED BULL · RB22</p>
          <h1>Walk around the car.</h1>
          <p>
            The car stays in view. Scrolling turns it from the side, to the nose, to the tail, then overhead. It is Dave’s model of the RB22, shared under Creative Commons. It is not an official Red Bull drawing, and it is not the unbranded schematic on the car-design page.
          </p>
        </header>
        <Rb22StageLoader />
        <section className="rb22-after">
          <h2>What the four views are for</h2>
          <div className="rb22-notes">
            {RB22_VIEWS.map((view) => (
              <article key={view.id}>
                <span className="coverage-tag">{view.kicker}</span>
                <h3>{view.title}</h3>
                <p>{view.body}</p>
              </article>
            ))}
          </div>
          <p className="article-source-note">
            Model: <a href={RB22_CREDIT.modelUrl} target="_blank" rel="noreferrer">{RB22_CREDIT.title} by {RB22_CREDIT.author}</a>, licensed <a href={RB22_CREDIT.licenseUrl} target="_blank" rel="noreferrer">{RB22_CREDIT.license}</a>. The dimension limits cited here come from the published 2026 regulations, not from measuring this file.
          </p>
          <div className="season-jump-links">
            <a href="/technology/car-design">Car schematic</a>
            <a href="/technology/power-unit">Power unit</a>
            <a href="/technology">All technology notes</a>
          </div>
        </section>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </div>
  )
}
