import type { Metadata } from "next"
import { SiteFooter, SiteNavigation } from "@/components/site-chrome"
import { SITE_NAME, SITE_URL } from "@/lib/site"

const FIA_ANNOUNCEMENT =
  "https://www.fia.com/news/formula-1-returns-africa-10-year-agreement-race-rwanda"
const FIA_KIGALI_AWARDS =
  "https://api.fia.com/news/landmark-fia-awards-see-2024-fia-champions-crowned-rwanda"
const CANONICAL_PATH = "/rwanda-f1-grand-prix"
const CANONICAL_URL = `${SITE_URL}${CANONICAL_PATH}`
const TITLE = "Rwanda F1 Grand Prix: What's Confirmed So Far"
const DESCRIPTION =
  "The FIA says Formula 1 will race in Rwanda in the early 2030s. Here's what's confirmed about the 10-year deal, Bugesera circuit, and race date."
const UPDATED = "2026-10-13"

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Amakuru` },
  description: DESCRIPTION,
  keywords: [
    "Rwanda F1 Grand Prix",
    "Formula 1 Rwanda",
    "African Grand Prix Rwanda",
    "Bugesera F1 circuit",
    "F1 Rwanda race date",
  ],
  alternates: { canonical: CANONICAL_PATH },
  openGraph: {
    type: "article",
    url: CANONICAL_URL,
    siteName: SITE_NAME,
    locale: "en_RW",
    title: `${TITLE} | Amakuru`,
    description: DESCRIPTION,
    publishedTime: `${UPDATED}T00:00:00+02:00`,
    modifiedTime: `${UPDATED}T00:00:00+02:00`,
    images: [
      {
        url: `${SITE_URL}/images/rwanda-racing-hero.webp`,
        alt: "Illustrative Formula 1 racing artwork with a Kigali-inspired night setting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | Amakuru`,
    description: DESCRIPTION,
    images: [`${SITE_URL}/images/rwanda-racing-hero.webp`],
  },
}

function ArrowUpRight() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 12.5 12 4M4.5 4H12v7.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export default function RwandaF1GrandPrixPage() {
  const articleData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: TITLE,
    description: DESCRIPTION,
    mainEntityOfPage: { "@type": "WebPage", "@id": CANONICAL_URL },
    datePublished: `${UPDATED}T00:00:00+02:00`,
    dateModified: `${UPDATED}T00:00:00+02:00`,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#organization` },
    image: [`${SITE_URL}/images/rwanda-racing-hero.webp`],
    articleSection: "Formula 1",
    inLanguage: "en",
    citation: [FIA_ANNOUNCEMENT, FIA_KIGALI_AWARDS],
    about: [
      { "@type": "SportsEvent", name: "Formula 1 African Grand Prix, presented by Visit Rwanda" },
      { "@type": "Place", name: "Bugesera, Rwanda" },
    ],
  }

  return (
    <div className="site-shell">
      <div className="topline">
        <span>RWANDA'S HOME OF FORMULA 1</span>
        <span className="topline-right"><i aria-hidden="true" /> Kigali · Rwanda</span>
      </div>
      <SiteNavigation />

      <main className="feature-page" id="main-content">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a><span aria-hidden="true">/</span><span>Rwanda F1 guide</span>
        </nav>

        <header className="subpage-hero article-hero">
          <div className="section-kicker section-kicker-light">
            <span>AM / GUIDE 001</span><span className="kicker-line" /><span>UPDATED 13 OCTOBER 2026</span>
          </div>
          <p className="label label-acid subpage-label">THE RWANDA GRAND PRIX</p>
          <h1>Rwanda's F1 Grand Prix: what's confirmed so far.</h1>
          <p className="subpage-dek">
            Formula 1 is set to race in Rwanda in the early 2030s. Here is what the FIA has confirmed—and what is still to come.
          </p>
          <div className="article-byline">AMAKURU MOTORSPORT <span>·</span> KIGALI, RWANDA</div>
        </header>

        <article className="article-content">
          <p className="article-lede">
            The FIA and Formula 1 have announced a 10-year agreement for the Formula 1 African Grand Prix, presented by Visit Rwanda, to join the calendar in the early 2030s. The first race is tied to completion of a new circuit in Bugesera.
          </p>

          <aside className="article-factbox" aria-label="Confirmed at a glance">
            <span className="coverage-tag">CONFIRMED BY THE FIA</span>
            <p><strong>10 years</strong> · <strong>Early 2030s</strong> · <strong>Bugesera, Rwanda</strong></p>
            <span>The exact first-race date has not been announced.</span>
          </aside>

          <section>
            <h2>What has Formula 1 confirmed?</h2>
            <p>
              The announcement is a 10-year partnership to bring the championship back to Africa. The event is named the Formula 1 African Grand Prix, presented by Visit Rwanda, and is expected to join the calendar in the early 2030s. The first race is planned after the purpose-built circuit is complete.
            </p>
            <p>
              The agreement sets a direction, not a race-weekend schedule. The FIA says further details on the inaugural date, circuit milestones and race plans will follow.
            </p>
            <a className="source-link" href={FIA_ANNOUNCEMENT} target="_blank" rel="noreferrer">
              Read the FIA announcement <ArrowUpRight />
            </a>
          </section>

          <section>
            <h2>Where will the Rwanda F1 race be?</h2>
            <p>
              The proposed venue is a new circuit planned to FIA Grade 1 standards in Bugesera, approximately 40 kilometres south of Kigali and next to the new Kigali International Airport. The FIA says the design is intended to work with the area's landscape and elevation changes.
            </p>
            <p>
              That means the announced venue is a purpose-built circuit in Bugesera, rather than a published city-centre street layout. The circuit layout and construction milestones have not yet been published.
            </p>
          </section>

          <section>
            <h2>When will the first Grand Prix happen?</h2>
            <p>
              The official window is the early 2030s. No exact season, calendar date or race weekend has been announced, so a specific year should not be treated as confirmed. The race depends on the circuit being completed first.
            </p>
          </section>

          <section>
            <h2>Why does Kigali already matter to motorsport?</h2>
            <p>
              Rwanda hosted the FIA Awards in Kigali in December 2024, bringing the governing body's annual celebration to Africa for the first time. That earlier milestone is part of the wider story behind Rwanda's growing place in international motorsport.
            </p>
            <a className="source-link" href={FIA_KIGALI_AWARDS} target="_blank" rel="noreferrer">
              Read the FIA Awards recap <ArrowUpRight />
            </a>
          </section>

          <section className="article-next">
            <p className="label">THE SEASON, WHILE WE WAIT</p>
            <h2>Follow the championship on the way to Rwanda.</h2>
            <p>See the current F1 calendar, recent results and championship standings, with race times shown for Kigali.</p>
            <a className="button button-acid" href="/season">Open the season hub <ArrowUpRight /></a>
            <div className="season-jump-links">
              <a href="/season">Schedule</a>
              <a href="/season/results">Results</a>
              <a href="/season/standings">Standings</a>
              <a href="/season/drivers">Drivers</a>
              <a href="/season/teams">Teams</a>
            </div>
          </section>

          <p className="article-source-note">
            Reporting is based on the FIA's published announcement. Amakuru will update this guide when official dates, circuit milestones or race-weekend details are released.
          </p>
        </article>
      </main>

      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData).replace(/</g, "\\u003c") }}
      />
    </div>
  )
}
