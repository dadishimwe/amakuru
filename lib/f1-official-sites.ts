/** Official team sites, keyed by Jolpica constructorId. Outbound links use the team's own domain. */
export const OFFICIAL_TEAM_SITES: Record<string, { href: string; label: string }> = {
  alpine: { href: "https://www.alpinef1.com/", label: "Alpine F1" },
  aston_martin: { href: "https://www.astonmartinf1.com/", label: "Aston Martin Aramco" },
  audi: { href: "https://www.audi.com/en/sport/motorsport.html", label: "Audi Motorsport" },
  cadillac: { href: "https://www.cadillacf1team.com/", label: "Cadillac Formula 1 Team" },
  ferrari: { href: "https://www.ferrari.com/en-EN/formula1", label: "Scuderia Ferrari" },
  haas: { href: "https://www.haasf1team.com/", label: "Haas F1 Team" },
  mclaren: { href: "https://www.mclaren.com/racing/", label: "McLaren Racing" },
  mercedes: { href: "https://www.mercedesamgf1.com/", label: "Mercedes-AMG PETRONAS" },
  rb: { href: "https://www.racingbulls.com/", label: "Visa Cash App Racing Bulls" },
  red_bull: { href: "https://www.redbullracing.com/", label: "Oracle Red Bull Racing" },
  williams: { href: "https://www.williamsf1.com/", label: "Williams Racing" },
}

export function officialTeamSite(constructorId?: string) {
  if (!constructorId) return null
  return OFFICIAL_TEAM_SITES[constructorId] ?? null
}
