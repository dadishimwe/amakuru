"use client"

import { useMemo, useState } from "react"
import type { CSSProperties } from "react"
import { Crest, Portrait } from "@/components/season/season-media"
import { SeasonSelect } from "@/components/season/season-select"
import type { GridDriver, GridTeam } from "@/lib/f1-season"
import { formatPoints } from "@/lib/f1-season"
import { teamAccent } from "@/lib/team-colors"

export function DriversExplorer({ drivers }: { drivers: GridDriver[] }) {
  const [query, setQuery] = useState("")
  const [team, setTeam] = useState("all")
  const teams = useMemo(
    () => Array.from(new Set(drivers.map((driver) => driver.team).filter(Boolean))).sort(),
    [drivers],
  )
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return drivers.filter((driver) => {
      if (team !== "all" && driver.team !== team) return false
      if (!needle) return true
      return `${driver.name} ${driver.code} ${driver.number} ${driver.nationality}`.toLowerCase().includes(needle)
    })
  }, [drivers, query, team])

  return (
    <>
      <div className="season-toolbar">
        <SeasonSelect
          label="Team"
          value={team}
          options={[{ value: "all", label: "All teams" }, ...teams.map((name) => ({ value: name, label: name }))]}
          onChange={setTeam}
        />
        <label className="season-search">
          <span>Search</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, code or nationality" />
        </label>
      </div>
      <div className="directory-grid">
        {visible.map((driver) => (
          <a className="directory-card driver-directory-card" key={driver.id} href={`/season/drivers/${driver.id}`} style={{ "--team-accent": teamAccent(driver.teamId) } as CSSProperties}>
            <span className="directory-photo"><Portrait src={driver.image} name={driver.code || driver.name} large /></span>
            <span className="directory-kicker">{driver.code || "F1"} · {driver.number ? `#${driver.number}` : "NO TBC"}</span>
            <h2>{driver.name}</h2>
            <p>{driver.team || "Team to be confirmed"}</p>
            <div>
              <span>P{driver.position || "—"}</span>
              <strong>{formatPoints(driver.points)} pts</strong>
            </div>
          </a>
        ))}
      </div>
      {visible.length === 0 && <p className="season-empty">No drivers match those filters.</p>}
    </>
  )
}

export function TeamsExplorer({ teams }: { teams: GridTeam[] }) {
  const [query, setQuery] = useState("")
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return teams
    return teams.filter((team) => `${team.name} ${team.nationality} ${team.drivers.map((driver) => driver.name).join(" ")}`.toLowerCase().includes(needle))
  }, [query, teams])

  return (
    <>
      <label className="season-search season-search-wide">
        <span>Search teams</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Team, nationality or driver" />
      </label>
      <div className="directory-grid">
        {visible.map((team) => (
          <article className="directory-card team-directory-card" key={team.id} style={{ "--team-accent": teamAccent(team.id) } as CSSProperties}>
            <span className="team-mark-area"><Crest src={team.image} name={team.name} large /></span>
            <span className="directory-kicker">{team.nationality || "FORMULA 1"} · P{team.position || "—"}</span>
            <h2><a href={`/season/teams/${team.id}`}>{team.name}</a></h2>
            <p>{team.drivers.map((driver) => driver.code || driver.name).join(" · ") || "Drivers to be confirmed"}</p>
            <div>
              <span>{team.wins} wins</span>
              <strong>{formatPoints(team.points)} pts</strong>
            </div>
            {team.officialUrl && (
              <a className="official-link" href={team.officialUrl} target="_blank" rel="noreferrer">
                {team.officialLabel} ↗
              </a>
            )}
          </article>
        ))}
      </div>
      {visible.length === 0 && <p className="season-empty">No teams match that search.</p>}
    </>
  )
}
