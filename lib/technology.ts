export type TechFact = { value: string; label: string }
export type TechSource = { label: string; href: string }
export type TechTopic = {
  slug: string
  label: string
  title: string
  dek: string
  description: string
  diagram: string
  diagramAlt: string
  facts: TechFact[]
  sources: TechSource[]
  explanation: string
  details: Array<{ heading: string; text: string }>
}

export const TECH_TOPICS: TechTopic[] = [
  {
    slug: "car-design",
    label: "CHASSIS + AERO",
    title: "A smaller, smarter car.",
    dek: "The 2026 rules reshape the car around less mass, a tighter footprint and moveable aerodynamic wings.",
    description: "A concise guide to the 2026 Formula 1 car dimensions, active aerodynamics and chassis changes.",
    diagram: "/illustrations/f1-2026-car.svg",
    diagramAlt: "Original Amakuru schematic of an unbranded open-wheel race car with front and rear active-aero wings, floor and wheelbase callouts.",
    facts: [
      { value: "−30 kg", label: "targeted car weight reduction" },
      { value: "3,400 mm", label: "maximum wheelbase" },
      { value: "1,900 mm", label: "maximum car width" },
    ],
    sources: [
      { label: "Formula 1: 2026 regulations overview", href: "https://www.formula1.com/en/latest/article/fia-unveils-formula-1-regulations-for-2026-and-beyond-featuring-more-agile.75qJiYOHXgeJqsVQtDr2UB" },
      { label: "FIA: 2026 Formula 1 regulations", href: "https://www.fia.com/regulation/category/110" },
    ],
    explanation: "The 2026 chassis is planned to be lighter and more compact. Active front and rear wings can change their aerodynamic setting on designated straights, replacing the old DRS-only approach with a system designed around both low drag and cornering grip.",
    details: [
      { heading: "Two aero modes", text: "The moveable wings can switch between a higher-downforce corner setting and a lower-drag straight setting, when the conditions and rules permit." },
      { heading: "What the dimensions mean", text: "A shorter wheelbase and narrower body reduce the car’s overall footprint. The weight target is a rules goal, not a promise that every car will weigh exactly that amount." },
    ],
  },
  {
    slug: "power-unit",
    label: "ENERGY + PROPULSION",
    title: "The hybrid, simplified.",
    dek: "The 1.6-litre turbo V6 remains. The electrical side becomes more powerful, and the MGU-H is removed.",
    description: "A short, source-linked explanation of the 2026 Formula 1 hybrid power unit and its main energy components.",
    diagram: "/illustrations/f1-2026-power-unit.svg",
    diagramAlt: "Original conceptual block diagram showing a turbo V6, MGU-K, energy store and control electronics connected as a hybrid power unit.",
    facts: [
      { value: "1.6 L", label: "turbocharged V6 retained" },
      { value: "350 kW", label: "maximum MGU-K output" },
      { value: "~50%", label: "target electrical power share" },
    ],
    sources: [
      { label: "Formula 1: 2026 power units explained", href: "https://www.formula1.com/en/latest/article/2026-regulations-explained-all-you-need-to-know-about-f1s-new-power-units.14jfv7a36905uDJDdNyfQd" },
      { label: "FIA: 2026 Formula 1 regulations", href: "https://www.fia.com/regulation/category/110" },
    ],
    explanation: "The power unit keeps the 1.6-litre turbocharged V6 but removes the Motor Generator Unit–Heat (MGU-H). The Motor Generator Unit–Kinetic (MGU-K) gains a much larger role, harvesting and returning energy through the car’s electrical system.",
    details: [
      { heading: "Energy store", text: "The battery stores recovered electrical energy. The control electronics manage how it is collected and deployed; the diagram is a functional overview, not a physical packaging plan." },
      { heading: "Not just a bigger battery", text: "The MGU-K can deliver up to 350 kW. The rules also change how drivers use electrical power over a lap, including the overtaking modes that replace DRS." },
    ],
  },
  {
    slug: "tyres",
    label: "COMPOUNDS + GRIP",
    title: "Five slicks. Two wet-weather options.",
    dek: "A tyre is a performance choice: compound, temperature, wear and weather all shape the grip available to the driver.",
    description: "Understand the 2026 Formula 1 slick compounds, wet-weather tyres, and revised tyre dimensions.",
    diagram: "/illustrations/f1-2026-tyre.svg",
    diagramAlt: "Original unbranded tyre explainer illustration showing a slick tyre, 18-inch rim and the soft, medium, hard, intermediate and wet colour coding.",
    facts: [
      { value: "18 in", label: "wheel rim diameter" },
      { value: "C1–C5", label: "slick compound range" },
      { value: "3", label: "slick compounds selected per event" },
    ],
    sources: [
      { label: "Formula 1: beginner’s guide to tyres", href: "https://www.formula1.com/en/latest/article/the-beginners-guide-to-formula-1-tyres.61SvF0Kfg29UR2SPhakDqd" },
      { label: "Pirelli: 2026 F1 tyres", href: "https://press.pirelli.com/pirelli-reveals-2026-f1-tyres-a-fresh-logo-design-and-new-compounds/" },
    ],
    explanation: "Pirelli’s 2026 range spans five slick compounds, from the hardest C1 to the softest C5. At each event, three are selected and named hard, medium and soft; intermediates and full wets are built for rain.",
    details: [
      { heading: "Colour at a glance", text: "The selected hard, medium and soft slicks use white, yellow and red sidewall markings. Intermediate tyres are green; full wet tyres are blue." },
      { heading: "The shape changed too", text: "The 18-inch rims remain. The front tyre is 25 mm narrower and the rear is 30 mm narrower than the previous specification." },
    ],
  },
]

export function getTechTopic(slug: string) {
  return TECH_TOPICS.find((topic) => topic.slug === slug)
}
