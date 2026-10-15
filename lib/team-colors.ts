/** Editorial tints for profile pages. These echo each team, not an official livery. */
const TEAM_ACCENTS: Record<string, string> = {
  alpine: "#2173B8",
  aston_martin: "#006F62",
  audi: "#BB0A30",
  cadillac: "#C4A35A",
  ferrari: "#E10600",
  haas: "#B90E0A",
  mclaren: "#FF8000",
  mercedes: "#00A19C",
  rb: "#6C8CFF",
  red_bull: "#1E41FF",
  williams: "#00A0DE",
}

export function teamAccent(constructorId?: string): string {
  if (!constructorId) return "#c9f45a"
  return TEAM_ACCENTS[constructorId] || "#c9f45a"
}
