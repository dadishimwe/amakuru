"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { ClassifiedRace } from "@/lib/f1-season"
import { formatPoints } from "@/lib/f1-season"

export function ResultsExplorer({ races, initialRound }: { races: ClassifiedRace[]; initialRound?: string }) {
  const router = useRouter()
  const fallback = races.at(-1)?.round || ""
  const starting = races.some((race) => race.round === initialRound) ? initialRound || fallback : fallback
  const [round, setRound] = useState(starting)
  const [query, setQuery] = useState("")
  const race = races.find((item) => item.round === round) ?? races.at(-1)

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!race) return []
    if (!needle) return race.results
    return race.results.filter((row) => `${row.driver} ${row.code} ${row.team}`.toLowerCase().includes(needle))
  }, [query, race])

  if (!race) return <p className="season-empty">No classified race results are available yet.</p>

  return (
    <section aria-labelledby="results-title">
      <h2 className="season-section-title" id="results-title">{race.name}</h2>
      <p className="season-support">{race.place}{race.circuit ? ` · ${race.circuit}` : ""} · {race.when}</p>
      <div className="season-toolbar">
        <label className="season-search">
          <span>Round</span>
          <select
            value={race.round}
            onChange={(event) => {
              const next = event.target.value
              setRound(next)
              router.replace(`/season/results?round=${next}`, { scroll: false })
            }}
          >
            {races.map((item) => (
              <option key={item.round} value={item.round}>
                R{item.round.padStart(2, "0")} · {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="season-search">
          <span>Search</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Driver or team" />
        </label>
      </div>
      <div className="standings-scroll">
        <table className="standings-table results-table">
          <thead>
            <tr>
              <th scope="col">POS</th>
              <th scope="col">NO</th>
              <th scope="col">DRIVER</th>
              <th scope="col">TEAM</th>
              <th scope="col">GRID</th>
              <th scope="col">LAPS</th>
              <th scope="col">TIME / STATUS</th>
              <th scope="col" className="points-heading">PTS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${race.round}-${row.position}-${row.driverId}`}>
                <td className="standings-position">{row.position.padStart(2, "0")}</td>
                <td>{row.number}</td>
                <td className="standings-name">
                  {row.driverId ? <a href={`/season/drivers/${row.driverId}`}>{row.driver}</a> : row.driver}
                  {row.code ? <small> {row.code}</small> : null}
                </td>
                <td className="standings-team">
                  {row.teamId ? <a href={`/season/teams/${row.teamId}`}>{row.team}</a> : row.team}
                </td>
                <td>{row.grid}</td>
                <td>{row.laps}</td>
                <td>{row.time}</td>
                <td className="standings-points">{formatPoints(row.points)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <p className="season-empty">No drivers match that search in this race.</p>}
    </section>
  )
}
