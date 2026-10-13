"use client"

import { useState } from "react"

const FIA_ANNOUNCEMENT =
  "https://api.fia.com/news/formula-1-returns-africa-10-year-agreement-race-rwanda"
const FIA_KIGALI_AWARDS =
  "https://api.fia.com/news/landmark-fia-awards-see-2024-fia-champions-crowned-rwanda"

const navItems = [
  { label: "The announcement", href: "#the-deal" },
  { label: "Rwanda's moment", href: "#rwanda" },
  { label: "What comes next", href: "#next" },
]

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path d="M3.5 12.5 12 4M4.5 4H12v7.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  )
}

export default function AmakuruPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <div className="topline">
        <span>RWANDA'S HOME OF FORMULA 1</span>
        <span className="topline-right">
          <i aria-hidden="true" /> Kigali · Rwanda
        </span>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Amakuru Motorsport home">
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
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
          <a className="nav-cta" href="#latest" onClick={() => setMenuOpen(false)}>
            Latest story <ArrowUpRight />
          </a>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <img
            className="hero-image"
            src="/images/rwanda-racing-hero.webp"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <div className="eyebrow eyebrow-light">
              <span className="eyebrow-dot" />
              THE NEXT CHAPTER STARTS HERE
            </div>
            <h1 id="hero-title">
              The road to
              <br />
              Rwanda is on.
            </h1>
            <p className="hero-dek">
              Formula 1 is returning to Africa. Rwanda is set to host a new Grand Prix in the early 2030s.
            </p>
            <div className="hero-actions">
              <a className="button button-acid" href="#the-deal">
                Get the story <span>↓</span>
              </a>
              <a className="text-link text-link-light" href="#rwanda">
                Why Rwanda? <ArrowUpRight />
              </a>
            </div>
          </div>
          <div className="hero-side-note">
            <span>01 / THE RETURN TO AFRICA</span>
            <span>ILLUSTRATIVE ARTWORK · NOT A CIRCUIT MAP</span>
          </div>
          <div className="hero-bottomline">
            <span>AMAKURU MOTORSPORT</span>
            <span>FORMULA 1 · RWANDA · AFRICA</span>
          </div>
        </section>

        <div className="ticker" aria-label="Formula 1 in Rwanda, the story starts now">
          <div className="ticker-track" aria-hidden="true">
            {[0, 1].map((copy) => (
              <div className="ticker-copy" key={copy}>
                <span>RWANDA ON THE GRID</span><b>✳</b>
                <span>FORMULA 1 RETURNS TO AFRICA</span><b>✳</b>
                <span>THE STORY STARTS NOW</span><b>✳</b>
                <span>RWANDA ON THE GRID</span><b>✳</b>
                <span>FORMULA 1 RETURNS TO AFRICA</span><b>✳</b>
                <span>THE STORY STARTS NOW</span><b>✳</b>
              </div>
            ))}
          </div>
        </div>

        <section className="section latest-section" id="latest" aria-labelledby="latest-title">
          <div className="section-kicker">
            <span>01</span>
            <span>THE BIG STORY</span>
            <span className="kicker-line" />
            <span>13 OCTOBER 2026</span>
          </div>
          <div className="latest-grid">
            <div className="latest-copy">
              <p className="label">THE ANNOUNCEMENT</p>
              <h2 id="latest-title">Africa, we're back.</h2>
              <p className="latest-intro">
                Formula 1 and the FIA have announced a landmark 10-year agreement to bring the championship back to Africa. The Rwanda-hosted Formula 1 African Grand Prix is set to join the calendar in the early 2030s.
              </p>
              <a
                className="source-link"
                href={FIA_ANNOUNCEMENT}
                target="_blank"
                rel="noreferrer"
              >
                Read the FIA announcement <ArrowUpRight />
              </a>
            </div>

            <div className="deal-card" id="the-deal">
              <div className="deal-card-top">
                <span className="deal-label"><i /> CONFIRMED BY THE FIA</span>
                <span className="deal-index">AM / 001</span>
              </div>
              <div className="deal-number">10<span>YR</span></div>
              <p className="deal-caption">A landmark agreement to bring Formula 1 racing to Rwanda.</p>
              <div className="deal-card-bottom">
                <div>
                  <span className="micro-label">TARGET WINDOW</span>
                  <strong>EARLY 2030s</strong>
                </div>
                <div className="deal-stamp" aria-label="Rwanda, Africa">
                  RW<br />AF
                </div>
              </div>
            </div>
          </div>
          <p className="source-note">
            The announced event is the Formula 1 African Grand Prix, presented by Visit Rwanda. Timing is currently described as the early 2030s.
          </p>
        </section>

        <section className="rwanda-section" id="rwanda" aria-labelledby="rwanda-title">
          <div className="section rwanda-inner">
            <div className="section-kicker section-kicker-light">
              <span>02</span>
              <span>RWANDA'S MOMENT</span>
              <span className="kicker-line" />
              <span>FROM KIGALI TO THE GRID</span>
            </div>
            <div className="rwanda-heading-grid">
              <div>
                <p className="label label-acid">A NEW CHAPTER FOR AFRICAN MOTORSPORT</p>
                <h2 id="rwanda-title">The story didn't start today.</h2>
              </div>
              <p className="rwanda-intro">
                Kigali has already welcomed the sport's global community. In December 2024, Rwanda hosted the FIA Awards—the first time the ceremony had taken place on the African continent.
              </p>
            </div>

            <div className="timeline" aria-label="Rwanda and Formula 1 timeline">
              <article className="timeline-item">
                <span className="timeline-date">DEC 2024</span>
                <span className="timeline-marker" aria-hidden="true" />
                <div>
                  <h3>Motorsport's spotlight turns to Kigali.</h3>
                  <p>The FIA Awards bring the international motorsport community to Rwanda for the first time on African soil.</p>
                  <a href={FIA_KIGALI_AWARDS} target="_blank" rel="noreferrer">
                    FIA event recap <ArrowUpRight />
                  </a>
                </div>
              </article>
              <article className="timeline-item">
                <span className="timeline-date">OCT 2026</span>
                <span className="timeline-marker" aria-hidden="true" />
                <div>
                  <h3>A 10-year agreement is announced.</h3>
                  <p>Formula 1 and the FIA confirm the African Grand Prix in Rwanda, with a calendar arrival planned for the early 2030s.</p>
                  <a href={FIA_ANNOUNCEMENT} target="_blank" rel="noreferrer">
                    Read the announcement <ArrowUpRight />
                  </a>
                </div>
              </article>
              <article className="timeline-item timeline-item-future">
                <span className="timeline-date">EARLY 2030s</span>
                <span className="timeline-marker" aria-hidden="true" />
                <div>
                  <h3>The lights are on the horizon.</h3>
                  <p>The race is expected to join the Formula 1 calendar. We'll follow the road to race day as more official details emerge.</p>
                  <span className="timeline-upcoming">THE ROAD AHEAD</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section next-section" id="next" aria-labelledby="next-title">
          <div className="section-kicker">
            <span>03</span>
            <span>THE ROAD AHEAD</span>
            <span className="kicker-line" />
            <span>WHAT WE'RE FOLLOWING</span>
          </div>
          <div className="next-heading-grid">
            <h2 id="next-title">Big news.<br /><em>More to learn.</em></h2>
            <p>
              The agreement sets the direction. Now comes the detail. Amakuru will track the facts, the decisions and the people shaping Formula 1's next African chapter.
            </p>
          </div>
          <div className="coverage-grid">
            <article className="coverage-card">
              <span className="coverage-no">01</span>
              <div className="coverage-icon coverage-icon-track" aria-hidden="true"><span /></div>
              <h3>Where will they race?</h3>
              <p>Follow official updates on the venue, circuit plans and what a Rwanda Grand Prix could look like.</p>
              <span className="coverage-tag">CIRCUIT WATCH</span>
            </article>
            <article className="coverage-card">
              <span className="coverage-no">02</span>
              <div className="coverage-icon coverage-icon-calendar" aria-hidden="true"><span /></div>
              <h3>When does it get real?</h3>
              <p>The announcement points to the early 2030s. We'll separate confirmed milestones from speculation.</p>
              <span className="coverage-tag">THE TIMELINE</span>
            </article>
            <article className="coverage-card">
              <span className="coverage-no">03</span>
              <div className="coverage-icon coverage-icon-people" aria-hidden="true"><span /></div>
              <h3>Who gets to take part?</h3>
              <p>Explore the people, skills and local motorsport stories behind a race weekend in Rwanda.</p>
              <span className="coverage-tag">RWANDA, IN FOCUS</span>
            </article>
          </div>
        </section>

        <section className="closing-section" aria-labelledby="closing-title">
          <div className="closing-mark" aria-hidden="true"><BrandMark /></div>
          <p className="label label-acid">THE GRID IS GETTING BIGGER</p>
          <h2 id="closing-title">This is Rwanda's<br />moment in motorsport.</h2>
          <p className="closing-copy">Follow the facts, the build-up and the stories behind the headline.</p>
          <a className="button button-acid" href={FIA_ANNOUNCEMENT} target="_blank" rel="noreferrer">
            Read the official announcement <ArrowUpRight />
          </a>
          <span className="closing-orbit closing-orbit-one" aria-hidden="true" />
          <span className="closing-orbit closing-orbit-two" aria-hidden="true" />
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand brand-footer" href="#top" aria-label="Amakuru Motorsport home">
          <BrandMark />
          <span className="brand-word">AMAKURU</span>
          <span className="brand-divider" />
          <span className="brand-section">MOTORSPORT</span>
        </a>
        <p>Formula 1, through a Rwanda lens.</p>
        <div className="footer-links">
          <a href="#the-deal">The announcement</a>
          <a href="#rwanda">Rwanda's moment</a>
          <a href="#next">The road ahead</a>
          <a href={FIA_ANNOUNCEMENT} target="_blank" rel="noreferrer">FIA source <ArrowUpRight /></a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Amakuru Motorsport</span>
          <span>INDEPENDENT EDITORIAL · KIGALI, RWANDA</span>
        </div>
      </footer>
    </div>
  )
}
