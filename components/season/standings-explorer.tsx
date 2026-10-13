"use client"

import { useMemo, useState } from "react"
import type { ConstructorStanding, DriverStanding } from "@/lib/f1-season"
import { formatPoints, personName } from "@/lib/f1-season"

export function StandingsExplorer({
  drivers,
  teams,
}: {
  drivers: DriverStanding[]
  teams: ConstructorStanding[]
}) {
  const [query, setQuery] = useState("")
  const needle = query.trim().toLowerCase()

  const driverRows = useMemo(
    () => drivers.filter((row) => {
      if (!needle) return true
      const name = personName(row.Driver)
      const team = row.Constructors?.[0]?.name || ""
      return `${name} ${row.Driver?.code || ""} ${team}`.toLowerCase().includes(needle)
    }),
    [drivers, needle],
  )
  const teamRows = useMemo(
    () => teams.filter((row) => !needle || (row.Constructor?.name || "").toLowerCase().includes(needle)),
    [needle, teams],
  )

  return (
    <>
      <label className="season-search season-search-wide">
        <span>Search standings</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Driver, code or team" />
      </label>
      <div className="standings-grid">
        <article className="standings-card">
          <div className="standings-card-head"><h2>Drivers</h2><span>{driverRows.length} LISTED</span></div>
          <StandingTable
            rows={driverRows.map((row, index) => ({
              key: row.Driver?.driverId || String(index),
              position: row.position || String(index + 1),
              name: personName(row.Driver) || "Driver",
              href: row.Driver?.driverId ? `/season/drivers/${row.Driver.driverId}` : "",
              detail: row.Constructors?.[0]?.name || "—",
              detailHref: row.Constructors?.[0]?.constructorId ? `/season/teams/${row.Constructors[0].constructorId}` : "",
              extra: row.wins || "0",
              points: row.points,
            }))}
          />
        </article>
        <article className="standings-card">
          <div className="standings-card-head"><h2>Teams</h2><span>{teamRows.length} LISTED</span></div>
          <StandingTable
            rows={teamRows.map((row, index) => ({
              key: row.Constructor?.constructorId || String(index),
              position: row.position || String(index + 1),
              name: row.Constructor?.name || "Team",
              href: row.Constructor?.constructorId ? `/season/teams/${row.Constructor.constructorId}` : "",
              detail: row.Constructor?.nationality || "—",
              detailHref: "",
              extra: row.wins || "0",
              points: row.points,
            }))}
          />
        </article>
      </div>
    </>
  )
}

function StandingTable({
  rows,
}: {
  rows: Array<{ key: string; position: string; name: string; href: string; detail: string; detailHref: string; extra: string; points?: string }>
}) {
  if (rows.length === 0) return <p className="season-empty">Nothing matches that search.</p>
  return (
    <div className="standings-scroll">
      <table className="standings-table">
        <thead>
          <tr>
            <th scope="col">POS</th>
            <th scope="col">NAME</th>
            <th scope="col">DETAIL</th>
            <th scope="col">WINS</th>
            <th scope="col" className="points-heading">PTS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <td className="standings-position">{row.position.padStart(2, "0")}</td>
              <td className="standings-name">{row.href ? <a href={row.href}>{row.name}</a> : row.name}</td>
              <td className="standings-team">{row.detailHref ? <a href={row.detailHref}>{row.detail}</a> : row.detail}</td>
              <td>{row.extra}</td>
              <td className="standings-points">{formatPoints(row.points)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
