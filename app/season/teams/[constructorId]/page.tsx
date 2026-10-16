import type { CSSProperties } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Crest, Portrait } from "@/components/season/season-media"
import { SeasonFrame } from "@/components/season/season-frame"
import { SeasonUnavailable } from "@/components/season/season-unavailable"
import { formatPoints, getF1SeasonData, teamResults } from "@/lib/f1-season"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"
import { teamAccent } from "@/lib/team-colors"
import { SITE_URL } from "@/lib/site"

export const revalidate = 21600

export async function generateStaticParams() {
  const data = await getF1SeasonData()
  return data.gridTeams.map((team) => ({ constructorId: team.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ constructorId: string }> }): Promise<Metadata> {
  const { constructorId } = await params
  const data = await getF1SeasonData()
  const team = data.gridTeams.find((item) => item.id === constructorId)
  if (!team) return {}
  return seasonMetadata(
    `${team.name} ${data.season} F1 team | Amakuru Motorsport`,
    `${team.name} in the ${data.season} Formula 1 season: drivers, points and a link to the official ${team.officialLabel} website.`,
    `/season/teams/${team.id}`,
  )
}

export default async function TeamPage({ params }: { params: Promise<{ constructorId: string }> }) {
  const { constructorId } = await params
  const data = await getF1SeasonData()
  const team = data.gridTeams.find((item) => item.id === constructorId)
  if (!team && data.unavailable) {
    return (
      <SeasonFrame
        current="/season/teams"
        year={data.season}
        updatedAt={data.updatedAt}
        kicker="CONSTRUCTOR"
        title="This team page is waiting on the feed."
        dek="The championship source is unavailable, so this profile is not being filled with a placeholder."
        crumbs={[{ label: "Home", href: "/" }, { label: "Teams", href: "/season/teams" }, { label: "Team" }]}
        jsonLd={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Teams", path: "/season/teams" }])}
      >
        <SeasonUnavailable />
      </SeasonFrame>
    )
  }
  if (!team) notFound()
  const results = teamResults(data, team.id)
  const path = `/season/teams/${team.id}`

  return (
    <SeasonFrame
      current="/season/teams"
      year={data.season}
      updatedAt={data.updatedAt}
      kicker={team.nationality ? team.nationality.toUpperCase() : "CONSTRUCTOR"}
      title={team.name}
      dek={`Championship P${team.position || "—"} · ${formatPoints(team.points)} points · ${team.wins} wins.`}
      accent={teamAccent(team.id)}
      mark={team.position ? `P${team.position}` : ""}
      imageCredits={team.drivers.map((driver) => driver.imageCredit)}
      crumbs={[{ label: "Home", href: "/" }, { label: "Teams", href: "/season/teams" }, { label: team.name }]}
      jsonLd={[
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Teams", path: "/season/teams" },
          { name: team.name, path },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "SportsTeam",
          name: team.name,
          url: `${SITE_URL}${path}`,
          sport: "Formula 1",
          nationality: team.nationality,
          sameAs: [team.officialUrl, team.wikipedia].filter(Boolean),
          athlete: team.drivers.map((driver) => ({
            "@type": "Person",
            name: driver.name,
            url: `${SITE_URL}/season/drivers/${driver.id}`,
          })),
        },
      ]}
    >
      <div className="team-crest-panel" style={{ "--team-accent": teamAccent(team.id) } as CSSProperties}>
        <Crest src={team.image} name={team.name} teamId={team.id} large />
        <div className="team-driver-row">
          {team.drivers.map((driver) => (
            <a key={driver.id} href={`/season/drivers/${driver.id}`}>
              <Portrait src={driver.image} name={driver.code || driver.name} />
              <span>{driver.name}</span>
            </a>
          ))}
        </div>
      </div>
      <div className="profile-facts">
        {team.officialUrl && (
          <a className="official-link" href={team.officialUrl} target="_blank" rel="noreferrer">
            Official {team.officialLabel} website ↗
          </a>
        )}
        {team.wikipedia && <a href={team.wikipedia} target="_blank" rel="noreferrer">Wikipedia ↗</a>}
      </div>
      <div className="standings-scroll">
        <table className="standings-table">
          <thead>
            <tr>
              <th scope="col">ROUND</th>
              <th scope="col">RACE</th>
              <th scope="col">DRIVER</th>
              <th scope="col">POS</th>
              <th scope="col" className="points-heading">PTS</th>
            </tr>
          </thead>
          <tbody>
            {results.flatMap(({ race, results: rows }) => rows.map((result) => (
              <tr key={`${race.round}-${result.driverId}`}>
                <td className="standings-position">{race.round.padStart(2, "0")}</td>
                <td className="standings-name"><a href={`/season/results?round=${race.round}`}>{race.name}</a></td>
                <td>{result.driverId ? <a href={`/season/drivers/${result.driverId}`}>{result.driver}</a> : result.driver}</td>
                <td>{result.position}</td>
                <td className="standings-points">{formatPoints(result.points)}</td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
      {results.length === 0 && <p className="season-empty">No classified results for this team yet.</p>}
    </SeasonFrame>
  )
}
