"use client"

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { Component, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import * as THREE from "three"
import { RB22_MODEL, RB22_VIEWS, type Rb22ViewId } from "@/lib/rb22-story"

const POSES: Record<Rb22ViewId, [number, number, number]> = {
  side: [1, 0.16, 0.08],
  front: [0.12, 0.2, 1],
  rear: [-0.08, 0.26, -1],
  top: [0.02, 1, 0.34],
}

class StageError extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) {
      return <p className="rb22-status">The model could not be opened in this browser.</p>
    }
    return this.props.children
  }
}

function Car({ fit, onReady }: { fit: MutableRefObject<number>; onReady: () => void }) {
  const gltf = useLoader(GLTFLoader, RB22_MODEL)
  const group = useRef<THREE.Group>(null)

  useLayoutEffect(() => {
    const holder = group.current
    if (!holder) return
    holder.position.set(0, 0, 0)
    holder.updateWorldMatrix(true, true)
    const box = new THREE.Box3().setFromObject(holder)
    const center = box.getCenter(new THREE.Vector3())
    holder.position.copy(center).multiplyScalar(-1)
    fit.current = box.getBoundingSphere(new THREE.Sphere()).radius
    onReady()
  }, [fit, gltf.scene, onReady])

  return (
    <group ref={group}>
      <primitive object={gltf.scene} />
    </group>
  )
}

function Rig({
  progress,
  fit,
}: {
  progress: MutableRefObject<number>
  fit: MutableRefObject<number>
}) {
  const { camera } = useThree()
  const from = useMemo(() => new THREE.Vector3(), [])
  const to = useMemo(() => new THREE.Vector3(), [])
  const direction = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    const radius = fit.current || 2.5
    const scaled = progress.current * (RB22_VIEWS.length - 1)
    const index = Math.min(RB22_VIEWS.length - 2, Math.floor(scaled))
    const blend = scaled - index
    const start = POSES[RB22_VIEWS[index].id]
    const end = POSES[RB22_VIEWS[index + 1].id]
    from.set(start[0], start[1], start[2]).normalize()
    to.set(end[0], end[1], end[2]).normalize()
    const smooth = blend * blend * (3 - 2 * blend)
    direction.lerpVectors(from, to, smooth).normalize()
    const vertical = THREE.MathUtils.degToRad(camera.fov)
    const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * camera.aspect)
    const distance = (radius / Math.sin(Math.min(vertical, horizontal) / 2)) * 1.28
    camera.position.copy(direction.multiplyScalar(distance))
    camera.lookAt(0, 0, 0)
  })

  return null
}

function StageCanvas({ progress }: { progress: MutableRefObject<number> }) {
  const fit = useRef(2.5)
  const [ready, setReady] = useState(false)
  const markReady = useMemo(() => () => setReady(true), [])

  return (
    <>
      {ready ? null : <p className="rb22-status">Bringing the car into the garage…</p>}
      <Canvas
        camera={{ position: [8, 2, 1], fov: 30, near: 0.05, far: 200 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#e7e6dc"]} />
        <hemisphereLight args={["#f7f6f1", "#c5c2b6", 1.35]} />
        <directionalLight position={[6, 8, 4]} intensity={2.6} />
        <directionalLight position={[-5, 3, -4]} intensity={0.9} />
        <Suspense fallback={null}>
          <Car fit={fit} onReady={markReady} />
          <Rig progress={progress} fit={fit} />
        </Suspense>
      </Canvas>
    </>
  )
}

export function Rb22Stage() {
  const storyRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const [progress, setProgress] = useState(0)
  const [pin, setPin] = useState<"before" | "fixed" | "after">("before")
  const [reduced, setReduced] = useState(false)
  const [chosen, setChosen] = useState(0)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setReduced(media.matches)
    apply()
    media.addEventListener("change", apply)
    return () => media.removeEventListener("change", apply)
  }, [])

  useEffect(() => {
    if (reduced) {
      progressRef.current = chosen / Math.max(1, RB22_VIEWS.length - 1)
      setProgress(progressRef.current)
      return
    }

    const update = () => {
      const story = storyRef.current
      if (!story) return
      const rect = story.getBoundingClientRect()
      const view = window.innerHeight
      const total = Math.max(story.offsetHeight - view, 1)
      const travelled = Math.min(Math.max(-rect.top, 0), total)
      progressRef.current = travelled / total
      setProgress(progressRef.current)
      if (rect.top > 0) setPin("before")
      else if (rect.bottom <= view) setPin("after")
      else setPin("fixed")
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [chosen, reduced])

  const active = reduced
    ? chosen
    : Math.min(RB22_VIEWS.length - 1, Math.round(progress * (RB22_VIEWS.length - 1)))
  const view = RB22_VIEWS[active]

  function show(index: number) {
    if (reduced) {
      setChosen(index)
      return
    }
    const story = storyRef.current
    if (!story) return
    const total = Math.max(story.offsetHeight - window.innerHeight, 0)
    const top = story.getBoundingClientRect().top + window.scrollY + (total * index) / (RB22_VIEWS.length - 1)
    window.scrollTo({ top, behavior: "smooth" })
  }

  return (
    <div className={`rb22-story${reduced ? " is-reduced" : ""}`} ref={storyRef}>
      <div className={`rb22-pin is-${reduced ? "before" : pin}`}>
        <div className="rb22-stage">
          <StageError>
            <StageCanvas progress={progressRef} />
          </StageError>
        </div>
        <div className="rb22-copy">
          <p className="rb22-progress" aria-hidden="true">
            <span style={{ transform: `scaleX(${reduced ? (chosen + 1) / RB22_VIEWS.length : Math.min(1, progress + 0.02)})` }} />
          </p>
          <p className="label label-acid">{view.kicker}</p>
          <h2 id="rb22-view-title">{view.title}</h2>
          <p>{view.body}</p>
          <div className="rb22-views" role="tablist" aria-label="Camera views">
            {RB22_VIEWS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === active}
                onClick={() => show(index)}
              >
                {item.id}
              </button>
            ))}
          </div>
          <p className="rb22-hint">{reduced ? "Choose a view. The car stays still until you do." : "Scroll to walk around the car, or pick a view."}</p>
        </div>
      </div>
    </div>
  )
}
