"use client"

import { useEffect, useRef, useState } from "react"

export function EasterEgg() {
  const [visible, setVisible] = useState(false)
  const sequence = useRef("")
  const logoClicks = useRef(0)
  const clickWindow = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const reveal = () => {
      setVisible(true)
      if (hideTimer.current) clearTimeout(hideTimer.current)
      hideTimer.current = setTimeout(() => setVisible(false), 6500)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) return
      if (event.key.length !== 1 || event.metaKey || event.ctrlKey || event.altKey) return

      sequence.current = `${sequence.current}${event.key.toLowerCase()}`.slice(-6)
      if (sequence.current === "kigali") {
        sequence.current = ""
        reveal()
      }
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element) || !target.closest(".brand-mark")) return

      logoClicks.current += 1
      if (clickWindow.current) clearTimeout(clickWindow.current)
      clickWindow.current = setTimeout(() => { logoClicks.current = 0 }, 2400)

      if (logoClicks.current >= 6) {
        logoClicks.current = 0
        reveal()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("click", onClick)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("click", onClick)
      if (clickWindow.current) clearTimeout(clickWindow.current)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="easter-egg-toast" role="status" aria-live="polite">
      <span className="easter-egg-lights" aria-hidden="true"><i /><i /><i /></span>
      <p><strong>Dadi&apos;s lights are on.</strong><br />Kigali, see you on the grid.</p>
      <button type="button" aria-label="Dismiss Easter egg" onClick={() => setVisible(false)}>×</button>
    </div>
  )
}
