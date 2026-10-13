import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Portrait } from "@/components/season/season-media"
import { SeasonFrame } from "@/components/season/season-frame"
import { SeasonUnavailable } from "@/components/season/season-unavailable"
import { driverResults, formatPoints, getF1SeasonData } from "@/lib/f1-season"
import { breadcrumbJsonLd, seasonMetadata } from "@/lib/season-page"
import { teamAccent } from "@/lib/team-colors"
import { SITE_URL } from "@/lib/site"

export const revalidate = 21600

export async function generateStaticParams() {
  const data = await getF1SeasonData()
  return data.gridDrivers.map((driver) => ({ driverId: driver.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ driverId: string }> }): Promise<Metadata> {
  const { driverId } = await params
  const data = await getF1SeasonData()
  const driver = data.gridDrivers.find((item) => item.id === driverId)
  if (!driver) return {}
  const path = `/season/drivers/${driver.id}`
  return seasonMetadata(
    `${driver.name} ${data.season} F1 results | Amakuru Motorsport`,
    `${driver.name}${driver.team ? `, ${driver.team}` : ""}: ${data.season} Formula 1 championship position, points and every classified race result.`,
    path,
  )
}

export default async function DriverPage({ params }: { params: Promise<{ driverId: string }> }) {
  const { driverId } = await params
  const data = await getF1SeasonData()
  const driver = data.gridDrivers.find((item) => item.id === driverId)
  if (!driver && data.unavailable) {
    return (
      <SeasonFrame
        current="/season/drivers"
        year={data.season}
        updatedAt={data.updatedAt}
        kicker="DRIVER"
        title="This driver page is waiting on the feed."
        dek="The championship source is unavailable, so this profile is not being filled with a placeholder."
        crumbs={[{ label: "Home", href: "/" }, { label: "Drivers", href: "/season/drivers" }, { label: "Driver" }]}
        jsonLd={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Drivers", path: "/season/drivers" }])}
      >
        <SeasonUnavailable />
      </SeasonFrame>
    )
  }
  if (!driver) notFound()
  const results = driverResults(data, driver.id)
  const path = `/season/drivers/${driver.id}`

  return (
    <SeasonFrame
      current="/season/drivers"
      year={data.season}
      updatedAt={data.updatedAt}
      kicker={driver.code ? `${driver.code} · ${driver.nationality || "FORMULA 1"}` : "DRIVER"}
      title={driver.name}
      dek={`${driver.team || "Team to be confirmed"} · Championship P${driver.position || "—"} · ${formatPoints(driver.points)} points · ${driver.wins} wins.`}
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Drivers", href: "/season/drivers" },
        { label: driver.name },
      ]}
      heroImage={driver.image}
      heroAlt=""
      accent={teamAccent(driver.teamId)}
      mark={driver.number || driver.code}
      jsonLd={[
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Drivers", path: "/season/drivers" },
          { name: driver.name, path },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "Person",
          name: driver.name,
          url: `${SITE_URL}${path}`,
          nationality: driver.nationality,
          jobTitle: "Formula 1 driver",
          memberOf: driver.team ? { "@type": "SportsTeam", name: driver.team } : undefined,
          sameAs: driver.wikipedia || undefined,
        },
      ]}
    >
      <figure className="profile-portrait">
        <Portrait src={driver.image} name={driver.code || driver.name} large />
      </figure>
      <div className="profile-facts">
        <span>No. {driver.number || "—"}</span>
        <span>{driver.nationality || "Nationality TBC"}</span>
        {driver.teamId ? <a href={`/season/teams/${driver.teamId}`}>{driver.team}</a> : <span>{driver.team || "Team TBC"}</span>}
        {driver.wikipedia && <a href={driver.wikipedia} target="_blank" rel="noreferrer">Wikipedia ↗</a>}
      </div>
      <div className="standings-scroll">
        <table className="standings-table">
          <thead>
            <tr>
              <th scope="col">ROUND</th>
              <th scope="col">RACE</th>
              <th scope="col">POS</th>
              <th scope="col">GRID</th>
              <th scope="col">TIME / STATUS</th>
              <th scope="col" className="points-heading">PTS</th>
            </tr>
          </thead>
          <tbody>
            {results.map(({ race, result }) => (
              <tr key={race.round}>
                <td className="standings-position">{race.round.padStart(2, "0")}</td>
                <td className="standings-name"><a href={`/season/results?round=${race.round}`}>{race.name}</a></td>
                <td>{result.position}</td>
                <td>{result.grid}</td>
                <td>{result.time}</td>
                <td className="standings-points">{formatPoints(result.points)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {results.length === 0 && <p className="season-empty">No classified results for this driver yet.</p>}
    </SeasonFrame>
  )
}
