import type { ReactNode } from "react"
import { SiteFooter, SiteNavigation } from "@/components/site-chrome"

export function ArticleFrame({
  kicker,
  label,
  title,
  dek,
  crumbs,
  jsonLd,
  children,
}: {
  kicker: string
  label: string
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
      <main className="feature-page" id="main-content">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="breadcrumb-item">
              {index > 0 && <span aria-hidden="true">/</span>}
              {crumb.href ? <a href={crumb.href}>{crumb.label}</a> : <span>{crumb.label}</span>}
            </span>
          ))}
        </nav>
        <header className="subpage-hero article-hero">
          <div className="section-kicker section-kicker-light">
            <span>{kicker}</span><span className="kicker-line" /><span>AMAKURU MOTORSPORT</span>
          </div>
          <p className="label label-acid subpage-label">{label}</p>
          <h1>{title}</h1>
          <p className="subpage-dek">{dek}</p>
          <div className="article-byline">AMAKURU MOTORSPORT <span>·</span> KIGALI, RWANDA</div>
        </header>
        <article className="article-content">{children}</article>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </div>
  )
}
