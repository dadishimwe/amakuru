import type { Metadata } from "next"
import { SiteFooter, SiteNavigation } from "@/components/site-chrome"
import {
  formatKigaliDateTime,
  formatUpdateTime,
  getF1SeasonData,
  raceStartTimestamp,
  type ConstructorStanding,
  type DriverStanding,
  type F1Race,
} from "@/lib/f1-season"
import { SITE_NAME, SITE_URL } from "@/lib/site"

const PAGE_TITLE = `F1 ${new Date().getUTCFullYear()} Calendar & Standings | Amakuru Motorsport`
const PAGE_DESCRIPTION =
  "Follow the F1 calendar, next Grand Prix in Kigali time, recent results, and driver and constructor standings. Season data refreshes every six hours."
const CANONICAL_PATH = "/season"
const CANONICAL_URL = `${SITE_URL}${CANONICAL_PATH}`

export const revalidate = 21600

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  keywords: ["F1 calendar", "F1 standings", "Formula 1 results", "F1 race times Kigali", "2026 Formula 1 season"],
  alternates: { canonical: CANONICAL_PATH },
  openGraph: {
    type: "website",
    url: CANONICAL_URL,
    siteName: SITE_NAME,
    locale: "en_RW",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/images/rwanda-racing-hero.webp`,
        alt: "Amakuru Motorsport, Formula 1 through a Rwanda lens",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [`${SITE_URL}/images/rwanda-racing-hero.webp`],
  },
}

function formatPoints(value?: string): string {
  const points = Number(value)
  return Number.isFinite(points) ? points.toLocaleString("en-RW", { maximumFractionDigits: 1 }) : "—"
}

function driverName(row: DriverStanding): string {
  return [row.Driver?.givenName, row.Driver?.familyName].filter(Boolean).join(" ") || "Driver TBC"
}

function teamName(row: ConstructorStanding): string {
  return row.Constructor?.name || "Team TBC"
}

function placeName(race: F1Race): string {
  const parts = [race.Circuit?.Location?.locality, race.Circuit?.Location?.country].filter(Boolean)
  return parts.join(", ") || race.Circuit?.circuitName || "Circuit details to follow"
}

function StandingsTable<T extends DriverStanding | ConstructorStanding>({
  rows,
  kind,
}: {
  rows: T[]
  kind: "drivers" | "teams"
}) {
  if (rows.length === 0) {
    return <p className="season-empty">Standings are not available from the data feed right now.</p>
  }

  return (
    <div className="standings-scroll">
      <table className="standings-table">
        <thead>
          <tr>
            <th scope="col">POS</th>
            <th scope="col">{kind === "drivers" ? "DRIVER" : "TEAM"}</th>
            {kind === "drivers" && <th scope="col">TEAM</th>}
            <th scope="col" className="points-heading">PTS</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 10).map((row, index) => {
            const position = row.position || String(index + 1)
            return (
              <tr key={`${kind}-${position}`}>
                <td className="standings-position">{position.padStart(2, "0")}</td>
                <td className="standings-name">
                  {kind === "drivers" ? driverName(row as DriverStanding) : teamName(row as ConstructorStanding)}
                </td>
                {kind === "drivers" && (
                  <td className="standings-team">{(row as DriverStanding).Constructors?.[0]?.name || "—"}</td>
                )}
                <td className="standings-points">{formatPoints(row.points)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default async function SeasonPage() {
  const data = await getF1SeasonData()
  const now = Date.now()
  const upcomingRaces = data.races
    .filter((race) => raceStartTimestamp(race) >= now)
    .sort((a, b) => raceStartTimestamp(a) - raceStartTimestamp(b))
    .slice(0, 5)
  const nextRace = upcomingRaces[0]
  const podium = data.latestRace?.Results?.slice(0, 3) ?? []
  const year = data.season
  const seasonPageData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${CANONICAL_URL}/#webpage`,
    url: CANONICAL_URL,
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    dateModified: data.updatedAt,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@type": "SportsEvent", name: `FIA Formula One World Championship ${year}` },
    inLanguage: "en",
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
          <a href="/">Home</a><span aria-hidden="true">/</span><span>{year} season</span>
        </nav>

        <header className="subpage-hero season-hero">
          <div className="section-kicker section-kicker-light">
            <span>AM / SEASON 001</span><span className="kicker-line" /><span>FORMULA 1 · {year}</span>
          </div>
          <p className="label label-acid subpage-label">THE CHAMPIONSHIP, FROM KIGALI</p>
          <h1>The {year} Formula 1 season.</h1>
          <p className="subpage-dek">
            The next Grand Prix, recent results and title battles—kept close to home with race times in Kigali.
          </p>
          <div className="season-meta-line">
            <span>DATA REFRESHES EVERY SIX HOURS</span>
            <span>UPDATED {formatUpdateTime(data.updatedAt)}</span>
          </div>
        </header>

        <div className="season-content">
          <section className="season-feature-grid" aria-label="Next race and latest result">
            <article className="next-race-card">
              <p className="label label-acid">NEXT GRAND PRIX</p>
              {nextRace ? (
                <>
                  <span className="season-round">ROUND {nextRace.round || "—"} · {year}</span>
                  <h2>{nextRace.raceName || "Next Grand Prix"}</h2>
                  <p className="race-location">{placeName(nextRace)}</p>
                  <div className="next-race-time">{formatKigaliDateTime(nextRace)} <span>· KIGALI TIME</span></div>
                </>
              ) : (
                <>
                  <span className="season-round">{data.races.length ? "SEASON COMPLETE" : "SCHEDULE UPDATE PENDING"}</span>
                  <h2>{data.races.length ? "That's the chequered flag." : "The calendar is taking a pit stop."}</h2>
                  <p className="race-location">{data.races.length ? "There are no further scheduled races in the current season." : "The F1 schedule could not be loaded. Please check back shortly."}</p>
                </>
              )}
            </article>

            <article className="latest-result-card">
              <p className="label">LATEST RACE RESULT</p>
              {data.latestRace ? (
                <>
                  <span className="season-round">ROUND {data.latestRace.round || "—"} · {formatKigaliDateTime(data.latestRace)}</span>
                  <h2>{data.latestRace.raceName || "Grand Prix"}</h2>
                  <p className="race-location">{placeName(data.latestRace)}</p>
                  {podium.length > 0 ? (
                    <ol className="podium-list">
                      {podium.map((result, index) => (
                        <li key={`${result.position || index}-${result.Driver?.familyName || "driver"}`}>
                          <span className="podium-position">{result.position || String(index + 1)}</span>
                          <span>{[result.Driver?.givenName, result.Driver?.familyName].filter(Boolean).join(" ") || "Driver"}</span>
                          <small>{result.Constructor?.name || "Team"}</small>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="season-empty">Result data is not available yet.</p>
                  )}
                </>
              ) : (
                <>
                  <h2>First lights of the season.</h2>
                  <p className="race-location">The latest classified result will appear here when available.</p>
                </>
              )}
            </article>
          </section>

          <section className="season-section" aria-labelledby="upcoming-title">
            <div className="section-kicker">
              <span>01</span><span>THE ROAD AHEAD</span><span className="kicker-line" /><span>UPCOMING ROUNDS</span>
            </div>
            <h2 className="season-section-title" id="upcoming-title">Next on the calendar.</h2>
            {upcomingRaces.length > 0 ? (
              <div className="calendar-list">
                {upcomingRaces.map((race) => (
                  <article className="calendar-row" key={`${year}-${race.round}-${race.raceName}`}>
                    <span className="calendar-round">{String(race.round || "—").padStart(2, "0")}</span>
                    <div className="calendar-race-name">
                      <h3>{race.raceName || "Grand Prix"}</h3>
                      <p>{placeName(race)}</p>
                    </div>
                    <time className="calendar-time" dateTime={race.time ? `${race.date}T${race.time}` : race.date}>
                      {formatKigaliDateTime(race)} <span>CAT</span>
                    </time>
                  </article>
                ))}
              </div>
            ) : (
              <p className="season-empty">No upcoming rounds are available right now.</p>
            )}
          </section>

          <section className="season-section" aria-labelledby="driver-standings-title">
            <div className="section-kicker">
              <span>02</span><span>CHAMPIONSHIP BATTLES</span><span className="kicker-line" /><span>{year} STANDINGS</span>
            </div>
            <h2 className="season-section-title" id="driver-standings-title">Drivers & constructors.</h2>
            <div className="standings-grid">
              <article className="standings-card">
                <div className="standings-card-head"><h3>Drivers</h3><span>TOP 10</span></div>
                <StandingsTable rows={data.driverStandings} kind="drivers" />
              </article>
              <article className="standings-card">
                <div className="standings-card-head"><h3>Constructors</h3><span>TOP 10</span></div>
                <StandingsTable rows={data.constructorStandings} kind="teams" />
              </article>
            </div>
          </section>

          <aside className="season-attribution">
            <span className="coverage-tag">DATA & TERMS</span>
            <p>
              Calendar, results and standings data by <a href="https://github.com/jolpica/jolpica-f1" target="_blank" rel="noreferrer">Jolpica-F1</a>, licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noreferrer">CC BY-NC-SA 4.0</a>. Used for personal, non-commercial purposes. This independent site is not affiliated with Formula 1.
            </p>
            <p>Data may be delayed or incomplete. Times are shown in Kigali time (CAT, UTC+2); verify the official event schedule before making travel plans.</p>
          </aside>
        </div>
      </main>

      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seasonPageData).replace(/</g, "\\u003c") }}
      />
    </div>
  )
}
