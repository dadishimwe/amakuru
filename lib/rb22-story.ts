export const RB22_MODEL = "/models/2026_redbull_rb22_Tyler_Dave.glb"

export const RB22_CREDIT = {
  title: "2026 Redbull RB22",
  author: "Dave",
  authorUrl: "https://sketchfab.com/Tyler_Dave",
  modelUrl: "https://sketchfab.com/3d-models/2026-redbull-rb22-0a3d24a58e0549d591a5a48c22eec383",
  license: "CC BY 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
}

export const RB22_VIEWS = [
  {
    id: "side",
    kicker: "01  ·  SIDE",
    title: "Read the car in profile.",
    body: "From the side, the RB22 is a 2026 Red Bull: a compact cockpit, a wing at each end, and a wheelbase that the rules now cap at 3,400 mm. This file is Dave’s model, not a factory drawing, so treat the shape as a guided look rather than a measured blueprint.",
  },
  {
    id: "front",
    kicker: "02  ·  FRONT",
    title: "The nose meets the air first.",
    body: "The front wing is part of the 2026 active-aero system. It can run a corner setting for grip, or a straighter setting for less drag. You can see the flaps here. The parts that move them stay hidden inside the nose.",
  },
  {
    id: "rear",
    kicker: "03  ·  REAR",
    title: "The tail is the other half of the wing.",
    body: "The rear wing is no longer a single DRS flap. It works with the front wing: more angle in a corner, less drag on a straight when the rules allow. The power unit sits under this bodywork. The hybrid page explains that system.",
  },
  {
    id: "top",
    kicker: "04  ·  TOP",
    title: "From above, it is a narrow dart.",
    body: "The plan view shows the cockpit, the halo and how little width the rules allow: 1,900 mm at most. What this angle hides is the floor. A large share of the grip is made underneath, which is why the car-design schematic labels that surface separately.",
  },
] as const

export type Rb22ViewId = (typeof RB22_VIEWS)[number]["id"]
