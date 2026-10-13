import { Crest, Portrait } from "@/components/season/season-media"
import { ScheduleExplorer } from "@/components/season/schedule-explorer"
import { SeasonFrame } from "@/components/season/season-frame"
import {
  formatKigaliDateTime,
  getF1SeasonData,
  personName,
  placeName,
  raceStartTimestamp,
} from "@/lib/f1-season"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"
import { SITE_URL } from "@/lib/site"

export const revalidate = 21600

const PATH = "/season"
const TITLE = "2026 F1 calendar in Kigali time | Amakuru Motorsport"
const DESCRIPTION = "The full Formula 1 calendar with every Grand Prix in Kigali time, plus the next race and the latest podium. Filter upcoming and completed rounds."

export const metadata = seasonMetadata(TITLE, DESCRIPTION, PATH)

export default async function SeasonPage() {
  const data = await getF1SeasonData()
  const now = Date.now()
  const completedRounds = new Set(data.classifiedRaces.map((race) => race.round))
  const nextRace = data.races
    .filter((race) => raceStartTimestamp(race) >= now)
    .sort((a, b) => raceStartTimestamp(a) - raceStartTimestamp(b))[0]
  const podium = data.latestRace?.Results?.slice(0, 3) ?? []
  const portraitById = new Map(data.gridDrivers.map((driver) => [driver.id, driver.image]))
  const crestById = new Map(data.gridTeams.map((team) => [team.id, team.image]))
  const rows = data.races.map((race) => ({
    round: race.round || "—",
    name: race.raceName || "Grand Prix",
    place: placeName(race),
    circuit: race.Circuit?.circuitName || "",
    image: race.image || "",
    when: formatKigaliDateTime(race),
    qualifying: race.Qualifying?.date ? formatKigaliDateTime(race.Qualifying) : "",
    status: completedRounds.has(race.round || "") ? "completed" as const : "upcoming" as const,
    resultHref: `/season/results?round=${race.round || ""}`,
  }))

  return (
    <SeasonFrame
      current={PATH}
      year={data.season}
      updatedAt={data.updatedAt}
      kicker="THE CHAMPIONSHIP, FROM KIGALI"
      title={`The ${data.season} Formula 1 season.`}
      dek="The full calendar, the next Grand Prix and the latest podium — with every race time in Kigali."
      heroImage={nextRace?.image || data.latestRace?.image || "/images/rwanda-racing-hero.webp"}
      crumbs={[{ label: "Home", href: "/" }, { label: `${data.season} season` }]}
      jsonLd={[
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: `${data.season} F1 season`, path: PATH }]),
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          url: `${SITE_URL}${PATH}`,
          name: TITLE,
          description: DESCRIPTION,
          dateModified: data.updatedAt,
        },
      ]}
    >
      <section className="season-feature-grid" aria-label="Next race and latest result">
        <article className={`next-race-card${nextRace?.image ? " next-race-card-photo" : ""}`}>
          {nextRace?.image ? <img className="card-photo" src={nextRace.image} alt="" /> : null}
          <p className="label label-acid">NEXT GRAND PRIX</p>
          {nextRace ? (
            <>
              <span className="season-round">ROUND {nextRace.round || "—"} · {data.season}</span>
              <h2>{nextRace.raceName || "Next Grand Prix"}</h2>
              <p className="race-location">{placeName(nextRace)}</p>
              <div className="next-race-time">{formatKigaliDateTime(nextRace)} <span>· KIGALI TIME</span></div>
            </>
          ) : (
            <>
              <span className="season-round">{data.races.length ? "SEASON COMPLETE" : "SCHEDULE UPDATE PENDING"}</span>
              <h2>{data.races.length ? "That's the chequered flag." : "The calendar is taking a pit stop."}</h2>
              <p className="race-location">{data.races.length ? "There are no further scheduled races." : "The F1 schedule could not be loaded."}</p>
            </>
          )}
        </article>
        <article className={`latest-result-card${data.latestRace?.image ? " latest-result-card-photo" : ""}`}>
          {data.latestRace?.image ? <img className="card-photo" src={data.latestRace.image} alt="" /> : null}
          <p className="label">LATEST RACE RESULT</p>
          {data.latestRace ? (
            <>
              <span className="season-round">ROUND {data.latestRace.round || "—"} · {formatKigaliDateTime(data.latestRace)}</span>
              <h2><a href={`/season/results?round=${data.latestRace.round || ""}`}>{data.latestRace.raceName || "Grand Prix"}</a></h2>
              <p className="race-location">{placeName(data.latestRace)}</p>
              <ol className="podium-list">
                {podium.map((result, index) => (
                  <li key={`${result.position || index}-${result.Driver?.driverId || "driver"}`}>
                    <span className="podium-position">{result.position || String(index + 1)}</span>
                    <Portrait src={portraitById.get(result.Driver?.driverId || "")} name={result.Driver?.code || personName(result.Driver)} />
                    {result.Driver?.driverId ? (
                      <a href={`/season/drivers/${result.Driver.driverId}`}>{personName(result.Driver)}</a>
                    ) : (
                      <span>{personName(result.Driver) || "Driver"}</span>
                    )}
                    <small>
                      <Crest src={crestById.get(result.Constructor?.constructorId || "")} name={result.Constructor?.name || "Team"} />
                      {result.Constructor?.constructorId ? (
                        <a href={`/season/teams/${result.Constructor.constructorId}`}>{result.Constructor.name}</a>
                      ) : result.Constructor?.name || "Team"}
                    </small>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <>
              <h2>First lights of the season.</h2>
              <p className="race-location">The latest classified result will appear here when available.</p>
            </>
          )}
        </article>
      </section>
      <ScheduleExplorer rows={rows} />
    </SeasonFrame>
  )
}
