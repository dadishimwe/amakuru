"use client"

import { useMemo, useState } from "react"

export type ScheduleRow = {
  round: string
  name: string
  place: string
  circuit: string
  circuitId: string
  image: string
  when: string
  qualifying: string
  status: "upcoming" | "completed"
  resultHref: string
}

const FILTERS = [
  { id: "all", label: "All rounds" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
] as const

export function ScheduleExplorer({ rows }: { rows: ScheduleRow[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all")
  const [query, setQuery] = useState("")

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (filter !== "all" && row.status !== filter) return false
      if (!needle) return true
      return `${row.name} ${row.place} ${row.circuit}`.toLowerCase().includes(needle)
    })
  }, [filter, query, rows])

  return (
    <section className="season-section" aria-labelledby="calendar-title">
      <div className="section-kicker">
        <span>01</span><span>THE FULL CALENDAR</span><span className="kicker-line" /><span>{rows.length} ROUNDS</span>
      </div>
      <h2 className="season-section-title" id="calendar-title">Every round, in Kigali time.</h2>
      <div className="season-toolbar">
        <div className="season-chips" role="group" aria-label="Filter rounds">
          {FILTERS.map((item) => (
            <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        <label className="season-search">
          <span>Search</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Race, city or country" />
        </label>
      </div>
      {visible.length > 0 ? (
        <div className="calendar-list">
          {visible.map((row) => (
            <article className="calendar-row" key={row.round}>
              {row.image ? <img className="calendar-thumb" src={row.image} alt="" loading="lazy" decoding="async" /> : <span className="calendar-thumb calendar-thumb-fallback" aria-hidden="true" />}
              <span className="calendar-round">{row.round.padStart(2, "0")}</span>
              <div className="calendar-race-name">
                <h3>
                  {row.status === "completed" ? <a href={row.resultHref}>{row.name}</a> : row.name}
                </h3>
                <p>{row.place}{row.circuit ? <> · <a href={row.circuitId ? `/circuits/${row.circuitId}` : "/circuits"}>{row.circuit}</a></> : ""}</p>
              </div>
              <div className="calendar-meta">
                <time aria-label={`Race date and start time: ${row.when} Kigali time`}>{row.when} <span>CAT</span></time>
                <small>{row.status === "completed" ? "Result posted" : row.qualifying ? `Qualifying ${row.qualifying}` : "Upcoming"}</small>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="season-empty">No rounds match that filter.</p>
      )}
    </section>
  )
}
