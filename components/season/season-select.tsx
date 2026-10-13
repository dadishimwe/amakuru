"use client"

import { useEffect, useId, useRef, useState } from "react"

export function SeasonSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onPointer)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onPointer)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  function move(direction: 1 | -1) {
    const index = Math.max(0, options.findIndex((option) => option.value === value))
    const next = options[(index + direction + options.length) % options.length]
    if (next) onChange(next.value)
  }

  return (
    <div className={`season-select${open ? " is-open" : ""}`} ref={rootRef}>
      <span id={`${listId}-label`}>{label}</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${listId}-label`}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault()
            setOpen(true)
            move(1)
          } else if (event.key === "ArrowUp") {
            event.preventDefault()
            setOpen(true)
            move(-1)
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            setOpen((current) => !current)
          }
        }}
      >
        <em>{selected?.label || "Select"}</em>
        <i aria-hidden="true" />
      </button>
      {open && (
        <ul id={listId} role="listbox" aria-labelledby={`${listId}-label`}>
          {options.map((option) => {
            const active = option.value === value
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                >
                  {option.label}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
