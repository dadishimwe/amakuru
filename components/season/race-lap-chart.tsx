"use client"

import { useEffect, useMemo, useState, type CSSProperties } from "react"
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
import type { ClassifiedRace, RaceLapData } from "@/lib/f1-season"
import { teamAccent } from "@/lib/team-colors"

type RaceLapChartProps = { race: ClassifiedRace; lapData: RaceLapData }
type RaceChartRow = { lap: number; label: string; [driverKey: string]: number | string | null }
type TooltipPayload = { dataKey?: string; value?: number; color?: string }
type ChartTooltipProps = { active?: boolean; payload?: TooltipPayload[]; label?: string }

const MS_PER_LAP = 120

function keyFor(driverId: string) {
  return `driver_${driverId}`
}

export function RaceLapChart({ race, lapData }: RaceLapChartProps) {
  const drivers = race.results
    .filter((result) => result.driverId)
    .slice()
    .sort((a, b) => Number(a.position) - Number(b.position))
  const [picked, setPicked] = useState(() => drivers.slice(0, 6).map((driver) => driver.driverId))
  const [focusOnly, setFocusOnly] = useState(true)
  const driverById = useMemo(() => new Map(drivers.map((driver) => [keyFor(driver.driverId), driver])), [drivers])
  const rows = useMemo<RaceChartRow[]>(() => {
    const grid: RaceChartRow = { lap: 0, label: "Grid" }
    for (const driver of drivers) {
      const position = Number(driver.grid)
      grid[keyFor(driver.driverId)] = Number.isFinite(position) && position > 0 ? position : null
    }
    const lapRows = lapData.laps.map((lap) => {
      const number = Number(lap.number)
      const row: RaceChartRow = { lap: number, label: String(number) }
      for (const timing of lap.Timings ?? []) {
        const position = Number(timing.position)
        if (timing.driverId && Number.isFinite(position) && position > 0) row[keyFor(timing.driverId)] = position
      }
      return row
    })
    return [grid, ...lapRows]
  }, [drivers, lapData.laps])

  const lastIndex = Math.max(rows.length - 1, 0)
  const [cursor, setCursor] = useState(lastIndex)
  const [playing, setPlaying] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setCursor(lastIndex)
    setPlaying(false)
  }, [lastIndex, race.round, race.name])

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setReducedMotion(media.matches)
    apply()
    media.addEventListener("change", apply)
    return () => media.removeEventListener("change", apply)
  }, [])

  useEffect(() => {
    if (!playing || reducedMotion) return
    const timer = window.setInterval(() => {
      setCursor((current) => {
        if (current >= lastIndex) {
          setPlaying(false)
          return lastIndex
        }
        return current + 1
      })
    }, MS_PER_LAP)
    return () => window.clearInterval(timer)
  }, [playing, lastIndex, reducedMotion])

  const visibleRows = useMemo(() => rows.slice(0, cursor + 1), [rows, cursor])
  const xMax = Number(rows[lastIndex]?.lap ?? 0)
  const currentLap = Number(visibleRows[visibleRows.length - 1]?.lap ?? 0)
  const atEnd = cursor >= lastIndex
  const shown = focusOnly ? drivers.filter((driver) => picked.includes(driver.driverId)) : drivers
  const maximum = Math.max(
    drivers.length,
    ...lapData.laps.flatMap((lap) => (lap.Timings ?? []).map((timing) => Number(timing.position) || 0)),
    1,
  )

  function toggle(driverId: string) {
    setPicked((current) => (current.includes(driverId) ? current.filter((id) => id !== driverId) : [...current, driverId]))
  }

  function play() {
    if (reducedMotion) {
      setCursor(lastIndex)
      setPlaying(false)
      return
    }
    setCursor((current) => (current >= lastIndex ? 0 : current))
    setPlaying(true)
  }

  function pause() {
    setPlaying(false)
  }

  function restart() {
    setPlaying(false)
    setCursor(0)
  }

  function showFull() {
    setPlaying(false)
    setCursor(lastIndex)
  }

  return (
    <section className="race-lap-explorer" aria-label={`${race.name} lap-by-lap position chart`}>
      <div className="race-chart-intro">
        <div>
          <p className="label label-acid">GRID → CLASSIFIED FINISH</p>
          <h2 className="season-section-title">Position, lap by lap.</h2>
          <p className="season-support">
            Lap 0 is the starting grid. Each later point is the timing feed’s recorded running position for that lap; no gaps are interpolated.
            Use Play to watch the selected lines grow through the race.
          </p>
        </div>
        <div className="progression-actions">
          <button
            type="button"
            className="progression-action"
            onClick={() => {
              setPicked(drivers.slice(0, 6).map((driver) => driver.driverId))
              setFocusOnly(true)
            }}
          >
            Top six
          </button>
          <button
            type="button"
            className={`progression-action${focusOnly ? " is-active" : ""}`}
            aria-pressed={focusOnly}
            onClick={() => setFocusOnly((value) => !value)}
          >
            {focusOnly ? "Focus selected" : "Show all"}
          </button>
        </div>
      </div>

      <fieldset className="progression-picker race-driver-picker">
        <legend>{focusOnly ? "Select drivers to compare" : "Select drivers to focus"}</legend>
        <div className="progression-options">
          {drivers.map((driver) => (
            <label className={`progression-option${picked.includes(driver.driverId) ? " is-checked" : ""}`} key={driver.driverId}>
              <input type="checkbox" checked={picked.includes(driver.driverId)} onChange={() => toggle(driver.driverId)} />
              <span className="progression-swatch" style={{ "--series-color": teamAccent(driver.teamId) } as CSSProperties} aria-hidden="true" />
              <span>{driver.code || driver.driver}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {lapData.laps.length ? (
        <>
          <div className="race-lap-playback" role="group" aria-label="Lap playback">
            <div className="race-lap-playback-actions">
              {playing ? (
                <button type="button" className="progression-action is-active" onClick={pause}>
                  Pause
                </button>
              ) : (
                <button type="button" className="progression-action is-active" onClick={play} disabled={reducedMotion && atEnd}>
                  {atEnd ? "Replay" : "Play"}
                </button>
              )}
              <button type="button" className="progression-action" onClick={restart} disabled={cursor === 0 && !playing}>
                Restart
              </button>
              <button type="button" className="progression-action" onClick={showFull} disabled={atEnd && !playing}>
                Full race
              </button>
            </div>
            <p className="race-lap-playback-status" aria-live="polite">
              {currentLap === 0 ? "Grid" : `Lap ${currentLap}`}
              <span aria-hidden="true"> · </span>
              {cursor + 1} / {rows.length}
              {playing ? " · playing" : atEnd ? " · complete" : ""}
              {reducedMotion ? " · motion reduced (jump to full race)" : ""}
            </p>
            <label className="race-lap-scrub">
              <span className="sr-only">Scrub through laps</span>
              <input
                type="range"
                min={0}
                max={lastIndex}
                value={cursor}
                onChange={(event) => {
                  setPlaying(false)
                  setCursor(Number(event.target.value))
                }}
              />
            </label>
          </div>

          <div
            className="progression-chart race-lap-chart"
            role="img"
            aria-label={`Running position through lap ${currentLap} of ${xMax}, with grid position at lap zero`}
          >
            <ResponsiveContainer width="100%" height={420}>
              <LineChart data={visibleRows} margin={{ top: 14, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="#d8d8cd" strokeDasharray="2 5" vertical={false} />
                <XAxis
                  dataKey="lap"
                  type="number"
                  domain={[0, xMax]}
                  allowDecimals={false}
                  tick={{ fill: "#697169", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "#bcbfb4" }}
                  label={{ value: "LAP · 0 = GRID", position: "insideBottomRight", offset: -4, fill: "#697169", fontSize: 10 }}
                  tickFormatter={(value: number) => (value === 0 ? "G" : String(value))}
                />
                <YAxis
                  domain={[1, maximum]}
                  reversed
                  allowDecimals={false}
                  ticks={Array.from({ length: maximum }, (_, index) => index + 1)}
                  tick={{ fill: "#697169", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={38}
                  tickFormatter={(value: number) => `P${value}`}
                />
                <Tooltip content={<LapTooltip driverById={driverById} />} cursor={{ stroke: "#9baa83", strokeDasharray: "4 4" }} />
                {shown.map((driver, index) => (
                  <Line
                    key={driver.driverId}
                    type="linear"
                    dataKey={keyFor(driver.driverId)}
                    name={driver.code || driver.driver}
                    stroke={teamAccent(driver.teamId)}
                    strokeWidth={index < 6 ? 2.6 : 1.8}
                    strokeDasharray={index % 4 === 0 ? undefined : index % 4 === 1 ? "7 4" : index % 4 === 2 ? "2 3" : "10 4 2 4"}
                    dot={false}
                    activeDot={{ r: 5, stroke: "#fbfaf3", strokeWidth: 2 }}
                    isAnimationActive={false}
                    connectNulls={false}
                  />
                ))}
                {!playing && atEnd && lapData.laps.length > 22 ? <Brush dataKey="lap" height={18} stroke="#697169" travellerWidth={8} /> : null}
              </LineChart>
            </ResponsiveContainer>
          </div>
          {!lapData.complete ? (
            <p className="chart-warning">
              The timing feed returned {lapData.loadedRecords.toLocaleString("en-RW")} of {lapData.totalRecords.toLocaleString("en-RW")} timing
              records. This chart is partial.
            </p>
          ) : null}
        </>
      ) : (
        <p className="season-empty">Lap timing is not available for this round in the current data feed. The classified finish below is still available.</p>
      )}

      <div className="race-classification">
        <div className="race-classification-head">
          <h3>Grid to final classification</h3>
          <p>
            <abbr title="Did Not Finish. The official classification can still show a finishing order for a driver who did not complete the race distance.">
              DNF
            </abbr>{" "}
            means Did Not Finish; the official status below retains the provider’s wording.
          </p>
        </div>
        <div className="standings-scroll">
          <table className="standings-table race-finish-table">
            <thead>
              <tr>
                <th scope="col">FIN</th>
                <th scope="col">GRID</th>
                <th scope="col">DRIVER</th>
                <th scope="col">TEAM</th>
                <th scope="col">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.driverId}>
                  <td className="standings-position">{driver.position.padStart(2, "0")}</td>
                  <td>{driver.grid}</td>
                  <td className="standings-name">
                    <a href={`/season/drivers/${driver.driverId}`}>{driver.driver}</a>
                    {driver.code ? <small> · {driver.code}</small> : null}
                  </td>
                  <td className="standings-team">{driver.team}</td>
                  <td>{driver.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function LapTooltip({
  active,
  payload,
  label,
  driverById,
}: ChartTooltipProps & { driverById: Map<string, ClassifiedRace["results"][number]> }) {
  if (!active || !payload?.length) return null
  const lap = Number(label)
  const title = lap === 0 ? "Starting grid" : `Lap ${lap}`
  return (
    <div className="chart-tooltip">
      <strong>{title}</strong>
      {payload
        .filter((entry) => Number.isFinite(Number(entry.value)))
        .slice()
        .sort((a, b) => Number(a.value) - Number(b.value))
        .map((entry) => {
          const driver = driverById.get(String(entry.dataKey))
          return (
            <span key={String(entry.dataKey)}>
              <i style={{ background: entry.color }} aria-hidden="true" />
              {driver?.code || driver?.driver || entry.dataKey} <b>P{entry.value}</b>
            </span>
          )
        })}
    </div>
  )
}
