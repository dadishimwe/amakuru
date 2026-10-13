import type { ReactNode } from "react"
import { SiteFooter, SiteNavigation } from "@/components/site-chrome"
import { formatUpdateTime } from "@/lib/f1-season"

const SECTIONS = [
  { href: "/season", label: "Schedule" },
  { href: "/season/results", label: "Results" },
  { href: "/season/standings", label: "Standings" },
  { href: "/season/drivers", label: "Drivers" },
  { href: "/season/teams", label: "Teams" },
]

export function SeasonFrame({
  current,
  year,
  updatedAt,
  kicker,
  title,
  dek,
  crumbs,
  jsonLd,
  children,
}: {
  current: string
  year: string
  updatedAt: string
  kicker: string
  title: string
  dek: string
  crumbs: Array<{ label: string; href?: string }>
  jsonLd: unknown
  children: ReactNode
}) {
  return (
    <div className="site-shell">
      <div className="topline">
        <span>RWANDA'S HOME OF FORMULA 1</span>
        <span className="topline-right"><i aria-hidden="true" /> Kigali · Rwanda</span>
      </div>
      <SiteNavigation />
      <nav className="season-subnav" aria-label="Championship sections">
        {SECTIONS.map((section) => (
          <a key={section.href} href={section.href} aria-current={current === section.href ? "page" : undefined}>
            {section.label}
          </a>
        ))}
      </nav>

      <main className="feature-page" id="main-content">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="breadcrumb-item">
              {index > 0 && <span aria-hidden="true">/</span>}
              {crumb.href ? <a href={crumb.href}>{crumb.label}</a> : <span>{crumb.label}</span>}
            </span>
          ))}
        </nav>

        <header className="subpage-hero season-hero">
          <div className="section-kicker section-kicker-light">
            <span>AM / SEASON 001</span><span className="kicker-line" /><span>FORMULA 1 · {year}</span>
          </div>
          <p className="label label-acid subpage-label">{kicker}</p>
          <h1>{title}</h1>
          <p className="subpage-dek">{dek}</p>
          <div className="season-meta-line">
            <span>DATA REFRESHES EVERY SIX HOURS</span>
            <span>UPDATED {formatUpdateTime(updatedAt)}</span>
          </div>
        </header>

        <div className="season-content">
          {children}
          <aside className="season-attribution">
            <span className="coverage-tag">DATA & TERMS</span>
            <p>
              Calendar, results and standings data by <a href="https://github.com/jolpica/jolpica-f1" target="_blank" rel="noreferrer">Jolpica-F1</a>, licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noreferrer">CC BY-NC-SA 4.0</a>. Used for personal, non-commercial purposes. This independent site is not affiliated with Formula 1, the FIA, or the teams linked from these pages.
            </p>
            <p>Times are shown in Kigali time (CAT, UTC+2). Data can lag the official classification, so check the official event schedule before travel.</p>
          </aside>
        </div>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </div>
  )
}
