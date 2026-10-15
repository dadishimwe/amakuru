"use client"

import { useState } from "react"

export function Portrait({ src, name, large = false }: { src?: string; name: string; large?: boolean }) {
  const [failed, setFailed] = useState(false)
  const mark = (name || "F1").replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase() || "F1"
  if (!src || failed) return <span className={`portrait portrait-fallback${large ? " portrait-large" : ""}`} aria-hidden="true">{mark}</span>
  return <img className={`portrait${large ? " portrait-large" : ""}`} src={src} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} />
}

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

export function Crest({ src, name, large = false }: { src?: string; name: string; large?: boolean }) {
  const [failed, setFailed] = useState(false)
  const mark = teamMark(name)
  if (!src || failed) return <span className={`crest crest-fallback${large ? " crest-large" : ""}`} aria-hidden="true">{mark}</span>
  return <img className={`crest${large ? " crest-large" : ""}`} src={src} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} />
}
