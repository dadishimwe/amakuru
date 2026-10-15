const SECTIONS = [
  { href: "/season", label: "Schedule" },
  { href: "/season/results", label: "Results" },
  { href: "/season/standings", label: "Standings" },
  { href: "/season/drivers", label: "Drivers" },
  { href: "/season/teams", label: "Teams" },
  { href: "/circuits", label: "Circuits" },
]

export function SeasonSubnav({ current = "" }: { current?: string }) {
  return (
    <nav className="season-subnav" aria-label="Championship sections">
      {SECTIONS.map((section) => (
        <a key={section.href} href={section.href} aria-current={current === section.href ? "page" : undefined}>
          {section.label}
        </a>
      ))}
    </nav>
  )
}
