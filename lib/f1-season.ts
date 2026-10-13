const JOLPICA_BASE = "https://api.jolpi.ca/ergast/f1"
export const JOLPICA_REFRESH_SECONDS = 6 * 60 * 60

export type F1Race = {
  season?: string
  round?: string
  raceName?: string
  date?: string
  time?: string
  url?: string
  Circuit?: {
    circuitName?: string
    Location?: {
      locality?: string
      country?: string
    }
  }
  Results?: Array<{
    position?: string
    points?: string
    status?: string
    Driver?: {
      givenName?: string
      familyName?: string
    }
    Constructor?: {
      name?: string
    }
    Time?: {
      time?: string
    }
  }>
}

export type DriverStanding = {
  position?: string
  points?: string
  wins?: string
  Driver?: {
    givenName?: string
    familyName?: string
    code?: string
  }
  Constructors?: Array<{
    name?: string
  }>
}

export type ConstructorStanding = {
  position?: string
  points?: string
  wins?: string
  Constructor?: {
    name?: string
  }
}

type JolpicaPayload = {
  MRData?: {
    RaceTable?: {
      season?: string
      Races?: F1Race[]
    }
    StandingsTable?: {
      StandingsLists?: Array<{
        DriverStandings?: DriverStanding[]
        ConstructorStandings?: ConstructorStanding[]
      }>
    }
  }
}

export type F1SeasonData = {
  season: string
  races: F1Race[]
  driverStandings: DriverStanding[]
  constructorStandings: ConstructorStanding[]
  latestRace: F1Race | null
  updatedAt: string
}

async function getJolpica(path: string): Promise<JolpicaPayload | null> {
  try {
    const response = await fetch(`${JOLPICA_BASE}/${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: JOLPICA_REFRESH_SECONDS },
    })
    if (!response.ok) return null
    return (await response.json()) as JolpicaPayload
  } catch {
    return null
  }
}

export async function getF1SeasonData(): Promise<F1SeasonData> {
  const [schedule, drivers, constructors, latest] = await Promise.all([
    getJolpica("current.json?limit=100"),
    getJolpica("current/driverStandings.json?limit=22"),
    getJolpica("current/constructorStandings.json?limit=11"),
    getJolpica("current/last/results.json?limit=5"),
  ])

  const scheduleTable = schedule?.MRData?.RaceTable
  const driverRows = drivers?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? []
  const constructorRows =
    constructors?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? []
  const latestRace = latest?.MRData?.RaceTable?.Races?.[0] ?? null

  return {
    season: scheduleTable?.season ?? String(new Date().getUTCFullYear()),
    races: scheduleTable?.Races ?? [],
    driverStandings: driverRows,
    constructorStandings: constructorRows,
    latestRace,
    updatedAt: new Date().toISOString(),
  }
}

export function raceStartTimestamp(race: F1Race): number {
  if (!race.date) return Number.POSITIVE_INFINITY
  const start = race.time ? `${race.date}T${race.time}` : `${race.date}T23:59:59Z`
  const parsed = Date.parse(start)
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed
}

export function formatKigaliDateTime(race: F1Race): string {
  if (!race.date) return "Time to be confirmed"
  const start = race.time ? `${race.date}T${race.time}` : `${race.date}T12:00:00Z`
  const date = new Date(start)
  if (Number.isNaN(date.getTime())) return race.date

  return new Intl.DateTimeFormat("en-RW", {
    timeZone: "Africa/Kigali",
    dateStyle: "medium",
    ...(race.time ? { timeStyle: "short" as const } : {}),
  }).format(date)
}

export function formatUpdateTime(value: string): string {
  return new Intl.DateTimeFormat("en-RW", {
    timeZone: "Africa/Kigali",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}
