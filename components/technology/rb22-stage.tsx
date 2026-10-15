"use client"

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { Component, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import * as THREE from "three"
import { RB22_MODEL, RB22_VIEWS, type Rb22ViewId } from "@/lib/rb22-story"

const POSES: Record<Rb22ViewId, [number, number, number]> = {
  side: [1, 0.22, 0.06],
  front: [0.1, 0.28, 1],
  rear: [-0.06, 0.32, -1],
  top: [0.04, 1, 0.12],
}

/** Soft Red Bull blues — side → front → rear → top as you scroll. */
const BG_STOPS: Record<Rb22ViewId, string> = {
  side: "#1a2f6b",
  front: "#1e3a7a",
  rear: "#121f4d",
  top: "#243a72",
}

type FitState = {
  radius: number
  floorY: number
  spanX: number
  spanZ: number
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

function makeRadialTexture(inner: string, mid: string, outer: string) {
  const size = 256
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, inner)
  gradient.addColorStop(0.45, mid)
  gradient.addColorStop(1, outer)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

function Car({ fit, onReady }: { fit: MutableRefObject<FitState>; onReady: () => void }) {
  const gltf = useLoader(GLTFLoader, RB22_MODEL)
  const group = useRef<THREE.Group>(null)

  useLayoutEffect(() => {
    const holder = group.current
    if (!holder) return
    holder.position.set(0, 0, 0)
    holder.updateWorldMatrix(true, true)
    const box = new THREE.Box3().setFromObject(holder)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    holder.position.copy(center).multiplyScalar(-1)
    fit.current = {
      radius: box.getBoundingSphere(new THREE.Sphere()).radius,
      floorY: box.min.y - center.y - 0.01,
      spanX: size.x,
      spanZ: size.z,
    }
    onReady()
  }, [fit, gltf.scene, onReady])

  return (
    <group ref={group}>
      <primitive object={gltf.scene} />
    </group>
  )
}

function Ground({ fit }: { fit: MutableRefObject<FitState> }) {
  const floorTex = useMemo(() => makeRadialTexture("rgba(10,16,40,0.55)", "rgba(10,16,40,0.22)", "rgba(10,16,40,0)"), [])
  const shadowTex = useMemo(() => makeRadialTexture("rgba(0,0,0,0.5)", "rgba(0,0,0,0.18)", "rgba(0,0,0,0)"), [])
  const floor = useRef<THREE.Mesh>(null)
  const shadow = useRef<THREE.Mesh>(null)

  useFrame(() => {
    const { radius, floorY, spanX, spanZ } = fit.current
    const floorSize = Math.max(radius * 2.4, 4)
    if (floor.current) {
      floor.current.position.y = floorY
      floor.current.scale.set(floorSize, floorSize, 1)
    }
    if (shadow.current) {
      shadow.current.position.y = floorY + 0.004
      // Soft oval under the chassis — longer along the car.
      shadow.current.scale.set(Math.max(spanX * 1.15, radius * 0.55), Math.max(spanZ * 0.95, radius * 1.1), 1)
    }
  })

  if (!floorTex || !shadowTex) return null

  return (
    <group>
      <mesh ref={floor} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-2}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={floorTex} transparent depthWrite={false} />
      </mesh>
      <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
      </mesh>
    </group>
  )
}

function Atmosphere({ progress }: { progress: MutableRefObject<number> }) {
  const { scene, gl } = useThree()
  const from = useMemo(() => new THREE.Color(), [])
  const to = useMemo(() => new THREE.Color(), [])
  const mixed = useMemo(() => new THREE.Color(BG_STOPS.side), [])

  useFrame(() => {
    const scaled = progress.current * (RB22_VIEWS.length - 1)
    const index = Math.min(RB22_VIEWS.length - 2, Math.floor(scaled))
    const blend = scaled - index
    const smooth = blend * blend * (3 - 2 * blend)
    from.set(BG_STOPS[RB22_VIEWS[index].id])
    to.set(BG_STOPS[RB22_VIEWS[index + 1].id])
    mixed.lerpColors(from, to, smooth)
    scene.background = mixed
    const parent = gl.domElement.parentElement
    if (parent) parent.style.background = `#${mixed.getHexString()}`
  })

  return null
}

function Rig({
  progress,
  fit,
  bias,
  pad,
}: {
  progress: MutableRefObject<number>
  fit: MutableRefObject<FitState>
  bias: MutableRefObject<{ x: number; y: number }>
  pad: MutableRefObject<number>
}) {
  const { camera } = useThree()
  const from = useMemo(() => new THREE.Vector3(), [])
  const to = useMemo(() => new THREE.Vector3(), [])
  const direction = useMemo(() => new THREE.Vector3(), [])
  const target = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    const radius = fit.current.radius || 2.5
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
    const distance = (radius / Math.sin(Math.min(vertical, horizontal) / 2)) * pad.current
    camera.position.copy(direction.multiplyScalar(distance))
    target.set(-bias.current.x * radius, -bias.current.y * radius, 0)
    camera.lookAt(target)
  })

  return null
}

function StageCanvas({
  progress,
  bias,
  pad,
}: {
  progress: MutableRefObject<number>
  bias: MutableRefObject<{ x: number; y: number }>
  pad: MutableRefObject<number>
}) {
  const fit = useRef<FitState>({ radius: 2.5, floorY: -0.6, spanX: 1.9, spanZ: 5.4 })
  const [ready, setReady] = useState(false)
  const markReady = useMemo(() => () => setReady(true), [])

  return (
    <>
      {ready ? null : <p className="rb22-status">Bringing the car into the garage…</p>}
      <Canvas
        camera={{ position: [8, 2.2, 1], fov: 30, near: 0.05, far: 200 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={[BG_STOPS.side]} />
        <hemisphereLight args={["#e8eefc", "#0c1635", 1.2]} />
        <directionalLight position={[5, 8, 4]} intensity={2.5} />
        <directionalLight position={[-5, 3, -3]} intensity={0.75} color="#ffd24a" />
        <Atmosphere progress={progress} />
        <Ground fit={fit} />
        <Suspense fallback={null}>
          <Car fit={fit} onReady={markReady} />
          <Rig progress={progress} fit={fit} bias={bias} pad={pad} />
        </Suspense>
      </Canvas>
    </>
  )
}

export function Rb22Stage() {
  const storyRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const biasRef = useRef({ x: 0.18, y: 0.1 })
  const padRef = useRef(0.7)
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
    const wide = window.matchMedia("(min-width: 900px)")
    const applyFrame = () => {
      if (wide.matches) {
        biasRef.current = { x: 0.16, y: 0.1 }
        padRef.current = 0.68
      } else {
        biasRef.current = { x: 0, y: 0.06 }
        padRef.current = 0.92
      }
    }
    applyFrame()
    wide.addEventListener("change", applyFrame)
    return () => wide.removeEventListener("change", applyFrame)
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
            <StageCanvas progress={progressRef} bias={biasRef} pad={padRef} />
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
