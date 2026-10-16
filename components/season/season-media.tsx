"use client"

import { useState, type CSSProperties } from "react"
import { teamAccent } from "@/lib/team-colors"

const TEAM_IDS: Array<[string, string]> = [
  ["mercedes", "mercedes"],
  ["ferrari", "ferrari"],
  ["mclaren", "mclaren"],
  ["red bull", "red_bull"],
  ["racing bulls", "rb"],
  ["rb f1", "rb"],
  ["aston martin", "aston_martin"],
  ["williams", "williams"],
  ["alpine", "alpine"],
  ["haas", "haas"],
  ["cadillac", "cadillac"],
  ["audi", "audi"],
]

function teamMark(name: string): string {
  const value = name.toLowerCase()
  if (value.includes("mercedes")) return "MER"
  if (value.includes("ferrari")) return "FER"
  if (value.includes("mclaren")) return "MCL"
  if (value.includes("red bull")) return "RBR"
  if (value.includes("racing bulls") || value.includes("rb f1")) return "RB"
  if (value.includes("aston martin")) return "AMR"
  if (value.includes("williams")) return "WIL"
  if (value.includes("alpine")) return "ALP"
  if (value.includes("haas")) return "HAA"
  if (value.includes("cadillac")) return "CAD"
  if (value.includes("audi")) return "AUD"
  return (name || "TEAM").replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase() || "TM"
}

function teamIdFor(name: string, explicit?: string): string {
  if (explicit) return explicit
  const value = name.toLowerCase()
  return TEAM_IDS.find(([needle]) => value.includes(needle))?.[1] || ""
}

export function Portrait({ src, name, large = false }: { src?: string; name: string; large?: boolean }) {
  const [failed, setFailed] = useState(false)
  const mark = (name || "F1").replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase() || "F1"
  if (!src || failed) return <span className={`portrait portrait-fallback${large ? " portrait-large" : ""}`} aria-hidden="true">{mark}</span>
  return <img className={`portrait${large ? " portrait-large" : ""}`} src={src} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} />
}

export function Crest({ src, name, large = false, teamId }: { src?: string; name: string; large?: boolean; teamId?: string }) {
  const [failed, setFailed] = useState(false)
  const mark = teamMark(name)
  const resolvedId = teamIdFor(name, teamId)
  const accent = teamAccent(resolvedId)
  const style = { "--team-accent": accent } as CSSProperties
  if (src && !failed) {
    return (
      <img
        className={`crest crest-mark${large ? " crest-large" : ""}`}
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    )
  }
  return (
    <span className={`crest crest-fallback${large ? " crest-large" : ""}`} style={style} aria-hidden="true">
      <span className="crest-bars"><i /><i /><i /></span>
      <span className="crest-lettermark">{mark}</span>
    </span>
  )
}
