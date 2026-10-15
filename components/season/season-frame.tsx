import type { CSSProperties, ReactNode } from "react"
import { SeasonSubnav } from "@/components/season/season-subnav"
import { ImageCredits } from "@/components/season/image-credits"
import { SiteFooter, SiteNavigation } from "@/components/site-chrome"
import { formatUpdateTime, type ImageCredit } from "@/lib/f1-season"

export function SeasonFrame({
  current,
  year,
  updatedAt,
  kicker,
  title,
  dek,
  crumbs,
  jsonLd,
  heroImage,
  heroAlt,
  accent,
  mark,
  imageCredits,
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
  heroImage?: string
  heroAlt?: string
  accent?: string
  mark?: string
  imageCredits?: Array<ImageCredit | null | undefined>
  children: ReactNode
}) {
  return (
    <div className="site-shell">
      <div className="topline">
        <span>RWANDA'S HOME OF FORMULA 1</span>
        <span className="topline-right"><i aria-hidden="true" /> Kigali · Rwanda</span>
      </div>
      <SiteNavigation />
      <SeasonSubnav current={current} />

      <main
        className={`feature-page season-page${accent ? " season-page-accent" : ""}`}
        id="main-content"
        style={accent ? { "--team-accent": accent } as CSSProperties : undefined}
      >
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="breadcrumb-item">
              {index > 0 && <span aria-hidden="true">/</span>}
              {crumb.href ? <a href={crumb.href}>{crumb.label}</a> : <span>{crumb.label}</span>}
            </span>
          ))}
        </nav>

        <header className={`subpage-hero season-hero${heroImage ? " season-hero-photo" : ""}`}>
          {heroImage ? <img className="season-hero-image" src={heroImage} alt={heroAlt || ""} /> : null}
          {heroImage ? <span className="season-hero-shade" aria-hidden="true" /> : null}
          <div className="section-kicker section-kicker-light">
            <span>AM / SEASON 001</span><span className="kicker-line" /><span>FORMULA 1 · {year}</span>
          </div>
          <p className="label label-acid subpage-label">{kicker}</p>
          <h1>{title}</h1>
          <p className="subpage-dek">{dek}</p>
          {mark ? <span className="season-watermark" aria-hidden="true">{mark}</span> : null}
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
              Calendar, results and standings data by <a href="https://github.com/jolpica/jolpica-f1" target="_blank" rel="noreferrer">Jolpica-F1</a>, licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noreferrer">CC BY-NC-SA 4.0</a>. Driver portraits and circuit images are used only when their Wikimedia Commons reuse licence is verified; creators and file-level licences are listed below. Team marks are represented with plain text, not copied logos.
            </p>
            <p>Times are shown in Kigali time (CAT, UTC+2). Data can lag the official classification, so check the official event schedule before travel.</p>
            <ImageCredits items={imageCredits} />
          </aside>
        </div>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </div>
  )
}
