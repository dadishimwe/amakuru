"use client"

import { useMemo, useState, type CSSProperties } from "react"
import {
  Brush,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { ChampionshipProgression } from "@/lib/f1-season"
import { teamAccent } from "@/lib/team-colors"

type ProgressionExplorerProps = { progression: ChampionshipProgression }
type ChartRow = { label: string; raceName: string; round: string; [seriesId: string]: string | number }
type ChartSeries = { id: string; name: string; teamId: string }
type ChartTooltipProps = { active?: boolean; payload?: Array<{ dataKey?: string; value?: number; color?: string; name?: string; payload?: ChartRow }>; label?: string }

const DASHES = [undefined, "7 4", "2 3", "10 4 2 4", "4 3"]

export function ProgressionExplorer({ progression }: ProgressionExplorerProps) {
  const [kind, setKind] = useState<"drivers" | "constructors">("drivers")
  const [focusOnly, setFocusOnly] = useState(true)
  const [pickedDrivers, setPickedDrivers] = useState(() => progression.drivers.slice(0, 4).map((item) => item.id))
  const [pickedConstructors, setPickedConstructors] = useState(() => progression.constructors.slice(0, 4).map((item) => item.id))

  const series: ChartSeries[] = kind === "drivers"
    ? progression.drivers
    : progression.constructors.map((item) => ({ ...item, teamId: item.id }))
  const picked = kind === "drivers" ? pickedDrivers : pickedConstructors
  const setPicked = kind === "drivers" ? setPickedDrivers : setPickedConstructors
  const rows = useMemo<ChartRow[]>(() => progression.rounds.map((round) => {
    const totals = kind === "drivers" ? round.driverPoints : round.constructorPoints
    return {
      label: round.label,
      round: round.round,
      raceName: round.name,
      ...Object.fromEntries(series.map((item) => [item.id, totals[item.id] ?? 0])),
    }
  }), [kind, progression.rounds, series])
  const shown = focusOnly ? series.filter((item) => picked.includes(item.id)) : series

  function toggle(id: string) {
    setPicked((current) => current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id])
  }

  function selectLeaders() {
    setPicked(series.slice(0, Math.min(4, series.length)).map((item) => item.id))
    setFocusOnly(true)
  }

  if (progression.rounds.length === 0) {
    return <p className="season-empty">Point progression will appear after the first classified round.</p>
  }

  return (
    <section className="progression-explorer" aria-label="Championship points progression">
      <div className="progression-controls">
        <div className="progression-switch" role="group" aria-label="Championship view">
          <button type="button" aria-pressed={kind === "drivers"} onClick={() => setKind("drivers")}>Drivers</button>
          <button type="button" aria-pressed={kind === "constructors"} onClick={() => setKind("constructors")}>Constructors</button>
        </div>
        <div className="progression-actions">
          <button type="button" className="progression-action" onClick={selectLeaders}>Top four</button>
          <button type="button" className={`progression-action${focusOnly ? " is-active" : ""}`} aria-pressed={focusOnly} onClick={() => setFocusOnly((value) => !value)}>
            {focusOnly ? "Focus selected" : "Show all"}
          </button>
        </div>
      </div>

      <fieldset className="progression-picker">
        <legend>{focusOnly ? "Choose who to compare" : "Choose series to focus"}</legend>
        <div className="progression-options">
          {series.map((item) => {
            const color = teamAccent(item.teamId)
            const checked = picked.includes(item.id)
            return (
              <label className={`progression-option${checked ? " is-checked" : ""}`} key={item.id}>
                <input type="checkbox" checked={checked} onChange={() => toggle(item.id)} />
                <span className="progression-swatch" style={{ "--series-color": color } as CSSProperties} aria-hidden="true" />
                <span>{item.name}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      {shown.length === 0 ? (
        <p className="season-empty">Select at least one {kind === "drivers" ? "driver" : "constructor"} to draw a comparison.</p>
      ) : (
        <div className="progression-chart" role="img" aria-label={`${kind === "drivers" ? "Driver" : "Constructor"} cumulative points after each completed Grand Prix and sprint weekend`}>
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={rows} margin={{ top: 12, right: 18, bottom: 8, left: 0 }}>
              <CartesianGrid stroke="#d8d8cd" strokeDasharray="2 5" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#697169", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#bcbfb4" }} minTickGap={12} />
              <YAxis allowDecimals={false} tick={{ fill: "#697169", fontSize: 11 }} tickLine={false} axisLine={false} width={42} />
              <Tooltip content={<ProgressionTooltip />} cursor={{ stroke: "#9baa83", strokeDasharray: "4 4" }} />
              {shown.map((item, index) => (
                <Line
                  key={item.id}
                  type="monotone"
                  dataKey={item.id}
                  name={item.name}
                  stroke={teamAccent(item.teamId)}
                  strokeWidth={index < 4 ? 2.8 : 2}
                  strokeDasharray={DASHES[index % DASHES.length]}
                  dot={{ r: 2, strokeWidth: 0, fill: teamAccent(item.teamId) }}
                  activeDot={{ r: 5, stroke: "#fbfaf3", strokeWidth: 2 }}
                  isAnimationActive={false}
                  connectNulls={false}
                />
              ))}
              {rows.length > 9 ? <Brush dataKey="label" height={18} stroke="#697169" travellerWidth={8} /> : null}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      <p className="progression-note">Cumulative points after each completed round; sprint and Grand Prix points are both included. Hover a point for the race and totals.</p>
    </section>
  )
}

function ProgressionTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  const row = payload[0]?.payload as ChartRow | undefined
  return (
    <div className="chart-tooltip">
      <strong>{label} · {row?.raceName}</strong>
      {payload.slice().sort((a, b) => Number(b.value) - Number(a.value)).map((entry) => (
        <span key={String(entry.dataKey)}>
          <i style={{ background: entry.color }} aria-hidden="true" />
          {entry.name || String(entry.dataKey)} <b>{Number(entry.value ?? 0).toLocaleString("en-RW")} pts</b>
        </span>
      ))}
    </div>
  )
}
