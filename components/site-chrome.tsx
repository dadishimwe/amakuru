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
        { label: "Latest news", href: "/news" },
        { label: "Technology", href: "/technology" },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "News", href: "/news" },
        { label: "Rwanda F1 guide", href: "/rwanda-f1-grand-prix" },
        { label: "Season hub", href: "/season" },
        { label: "Technology", href: "/technology" },
        { label: "Circuits", href: "/circuits" },
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
      <p className="site-disclaimer">This website is unofficial and is not associated in any way with the Formula 1 companies. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of Formula One Licensing B.V.</p>
      <div className="footer-links">
        <a href={sectionHref("#the-deal")}>The announcement</a>
        <a href={sectionHref("#rwanda")}>Rwanda's moment</a>
        <a href={sectionHref("#next")}>The road ahead</a>
        <a href="/rwanda-f1-grand-prix">Rwanda F1 guide</a>
        <a href="/road-to-rwanda">Road to Rwanda</a>
        <a href="/news">Latest news</a>
        <a href="/technology">Technology</a>
        <a href="/circuits">Circuits</a>
        <a href="/guides">Guides</a>
        <a href="/season">Schedule</a>
        <a href="/season/results">Results</a>
        <a href="/season/standings">Standings</a>
        <a href="/season/progression">Progression</a>
        <a href="/season/drivers">Drivers</a>
        <a href="/season/teams">Teams</a>
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
        <span>INDEPENDENT EDITORIAL · <a className="footer-author" href="https://blog.dadishimwe.com" target="_blank" rel="noreferrer">DADI ISHIMWE</a> · KIGALI, RWANDA</span>
      </div>
    </footer>
  )
}
