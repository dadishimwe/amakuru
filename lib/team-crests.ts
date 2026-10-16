/** Original Amakuru editorial crests — not official team logos. */
export const TEAM_CRESTS: Record<string, string> = {
  alpine: "/crests/alpine.svg",
  aston_martin: "/crests/aston_martin.svg",
  audi: "/crests/audi.svg",
  cadillac: "/crests/cadillac.svg",
  ferrari: "/crests/ferrari.svg",
  haas: "/crests/haas.svg",
  mclaren: "/crests/mclaren.svg",
  mercedes: "/crests/mercedes.svg",
  rb: "/crests/rb.svg",
  red_bull: "/crests/red_bull.svg",
  williams: "/crests/williams.svg",
}

export function teamCrest(constructorId?: string): string {
  if (!constructorId) return ""
  return TEAM_CRESTS[constructorId] || ""
}
