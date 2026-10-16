"use client"

import { useEffect, useId, useRef, useState } from "react"
import { RB22_CREDIT } from "@/lib/rb22-story"

type Rb22PlayProps = {
  /** Optional class on the trigger control. */
  className?: string
  label?: string
}

export function Rb22Play({ className = "", label = "Open free viewer" }: Rb22PlayProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      if (!dialog.open) dialog.showModal()
      return
    }
    if (dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  function requestClose() {
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        className={`rb22-play-trigger${className ? ` ${className}` : ""}`}
        onClick={() => setOpen(true)}
      >
        {label}
      </button>
      <dialog
        ref={dialogRef}
        className="rb22-play-dialog"
        aria-labelledby={titleId}
        onClose={requestClose}
        onClick={(event) => {
          if (event.target === dialogRef.current) requestClose()
        }}
      >
        <div className="rb22-play-panel" onClick={(event) => event.stopPropagation()}>
          <header className="rb22-play-bar">
            <div>
              <p className="label label-acid">SKETCHFAB · FREE VIEWER</p>
              <h2 id={titleId}>{RB22_CREDIT.title}</h2>
            </div>
            <button type="button" className="rb22-play-close" onClick={requestClose} autoFocus>
              Close
            </button>
          </header>
          <div className="rb22-play-frame">
            {open ? (
              <iframe
                title={`${RB22_CREDIT.title} by ${RB22_CREDIT.author} on Sketchfab`}
                src={RB22_CREDIT.embedUrl}
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
                loading="lazy"
              />
            ) : null}
          </div>
          <p className="rb22-play-credit">
            Model by{" "}
            <a href={RB22_CREDIT.authorUrl} target="_blank" rel="noreferrer">
              {RB22_CREDIT.author}
            </a>
            , licensed{" "}
            <a href={RB22_CREDIT.licenseUrl} target="_blank" rel="noreferrer">
              {RB22_CREDIT.license}
            </a>
            . Drag to orbit, scroll to zoom.
          </p>
        </div>
      </dialog>
    </>
  )
}
