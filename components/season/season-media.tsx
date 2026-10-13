"use client"

import { useState } from "react"

export function Portrait({ src, name, large = false }: { src?: string; name: string; large?: boolean }) {
  const [failed, setFailed] = useState(false)
  const mark = (name || "F1").replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase() || "F1"
  if (!src || failed) return <span className={`portrait portrait-fallback${large ? " portrait-large" : ""}`} aria-hidden="true">{mark}</span>
  return <img className={`portrait${large ? " portrait-large" : ""}`} src={src} alt="" onError={() => setFailed(true)} />
}

export function Crest({ src, name, large = false }: { src?: string; name: string; large?: boolean }) {
  const [failed, setFailed] = useState(false)
  const mark = (name || "T").trim().slice(0, 1).toUpperCase()
  if (!src || failed) return <span className={`crest crest-fallback${large ? " crest-large" : ""}`} aria-hidden="true">{mark}</span>
  return <img className={`crest${large ? " crest-large" : ""}`} src={src} alt="" onError={() => setFailed(true)} />
}
