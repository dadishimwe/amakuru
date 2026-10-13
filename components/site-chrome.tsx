"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"

const FIA_ANNOUNCEMENT =
  "https://www.fia.com/news/formula-1-returns-africa-10-year-agreement-race-rwanda"

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  )
}

function ArrowUpRight() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 12.5 12 4M4.5 4H12v7.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function SiteNavigation() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [menuOpen, setMenuOpen] = useState(false)
  const links = isHome
    ? [
        { label: "The announcement", href: "#the-deal" },
        { label: "Rwanda's moment", href: "#rwanda" },
        { label: "What comes next", href: "#next" },
        { label: "Rwanda F1 guide", href: "/rwanda-f1-grand-prix" },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "Rwanda F1 guide", href: "/rwanda-f1-grand-prix" },
        { label: "Season hub", href: "/season" },
      ]

  return (
    <header className="site-header">
      <a className="brand" href={isHome ? "#top" : "/"} aria-label="Amakuru Motorsport home">
        <BrandMark />
        <span className="brand-word">AMAKURU</span>
        <span className="brand-divider" />
        <span className="brand-section">MOTORSPORT</span>
      </a>

      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
      </button>

      <nav
        className={`primary-nav${menuOpen ? " is-open" : ""}`}
        id="primary-navigation"
        aria-label="Primary navigation"
      >
        {links.map((item) => (
          <a
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
        <a
          className="nav-cta"
          href={isHome ? "/season" : FIA_ANNOUNCEMENT}
          target={isHome ? undefined : "_blank"}
          rel={isHome ? undefined : "noreferrer"}
          onClick={() => setMenuOpen(false)}
        >
          {isHome ? "Season hub" : "FIA source"} <ArrowUpRight />
        </a>
      </nav>
    </header>
  )
}

export function SiteFooter() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const sectionHref = (fragment: string) => (isHome ? fragment : `/${fragment}`)

  return (
    <footer className="site-footer">
      <a className="brand brand-footer" href={isHome ? "#top" : "/"} aria-label="Amakuru Motorsport home">
        <BrandMark />
        <span className="brand-word">AMAKURU</span>
        <span className="brand-divider" />
        <span className="brand-section">MOTORSPORT</span>
      </a>
      <p>Formula 1, through a Rwanda lens.</p>
      <div className="footer-links">
        <a href={sectionHref("#the-deal")}>The announcement</a>
        <a href={sectionHref("#rwanda")}>Rwanda's moment</a>
        <a href={sectionHref("#next")}>The road ahead</a>
        <a href="/rwanda-f1-grand-prix">Rwanda F1 guide</a>
        <a href="/season">Season hub</a>
        <a href={FIA_ANNOUNCEMENT} target="_blank" rel="noreferrer">
          FIA source <ArrowUpRight />
        </a>
        <button
          className="footer-privacy"
          type="button"
          onClick={() => window.dispatchEvent(new Event("amakuru:open-privacy-settings"))}
        >
          Privacy choices
        </button>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Amakuru Motorsport</span>
        <span>INDEPENDENT EDITORIAL · DADI ISHIMWE · KIGALI, RWANDA</span>
      </div>
    </footer>
  )
}
