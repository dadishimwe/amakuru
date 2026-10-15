"use client"

import dynamic from "next/dynamic"

export const Rb22StageLoader = dynamic(
  () => import("@/components/technology/rb22-stage").then((mod) => mod.Rb22Stage),
  {
    ssr: false,
    loading: () => <div className="rb22-loading">Bringing the car into the garage…</div>,
  },
)
