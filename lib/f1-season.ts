import { officialTeamSite } from "@/lib/f1-official-sites"

const JOLPICA_BASE = "https://api.jolpi.ca/ergast/f1"
export const JOLPICA_REFRESH_SECONDS = 6 * 60 * 60

export type SessionStamp = { date?: string; time?: string }

export type F1Driver = {
  driverId?: string
  permanentNumber?: string
  code?: string
  url?: string
  givenName?: string
  familyName?: string
  dateOfBirth?: string
  nationality?: string
}

export type F1Constructor = {
  constructorId?: string
  url?: string
  name?: string
  nationality?: string
}

export type F1Result = {
  number?: string
  position?: string
  points?: string
  status?: string
  grid?: string
  laps?: string
  Driver?: F1Driver
  Constructor?: F1Constructor
  Time?: { time?: string }
}

export type F1Race = {
  season?: string
  round?: string
  raceName?: string
  date?: string
  time?: string
  url?: string
  image?: string
  Circuit?: {
    circuitId?: string
    circuitName?: string
    url?: string
    Location?: { locality?: string; country?: string }
  }
  Qualifying?: SessionStamp
  Sprint?: SessionStamp
  Results?: F1Result[]
}

export type DriverStanding = {
  position?: string
  points?: string
  wins?: string
  Driver?: F1Driver
  Constructors?: F1Constructor[]
}

export type ConstructorStanding = {
  position?: string
  points?: string
  wins?: string
  Constructor?: F1Constructor
}

export type ClassifiedResult = {
  position: string
  number: string
  driverId: string
  driver: string
  code: string
  teamId: string
  team: string
  grid: string
  laps: string
  time: string
  points: string
  status: string
  driverImage: string
  teamImage: string
}

export type ClassifiedRace = {
  round: string
  name: string
  place: string
  circuit: string
  circuitImage: string
  when: string
  results: ClassifiedResult[]
}

export type GridDriver = {
  id: string
  name: string
  code: string
  number: string
  nationality: string
  dateOfBirth: string
  wikipedia: string
  team: string
  teamId: string
  points: string
  position: string
  wins: string
  image: string
}

export type GridTeam = {
  id: string
  name: string
  nationality: string
  wikipedia: string
  officialUrl: string
  officialLabel: string
  points: string
  position: string
  wins: string
  image: string
  drivers: Array<{ id: string; name: string; code: string; number: string; image: string }>
}

type JolpicaPayload = {
  MRData?: {
    total?: string
    limit?: string
    RaceTable?: { season?: string; Races?: F1Race[] }
    StandingsTable?: {
      StandingsLists?: Array<{
        DriverStandings?: DriverStanding[]
        ConstructorStandings?: ConstructorStanding[]
      }>
    }
    DriverTable?: { Drivers?: F1Driver[] }
    ConstructorTable?: { Constructors?: F1Constructor[] }
  }
}

export type F1SeasonData = {
  season: string
  races: F1Race[]
  classifiedRaces: ClassifiedRace[]
  driverStandings: DriverStanding[]
  constructorStandings: ConstructorStanding[]
  gridDrivers: GridDriver[]
  gridTeams: GridTeam[]
  latestRace: F1Race | null
  updatedAt: string
}

async function getAllSeasonResults(): Promise<F1Race[]> {
  const first = await getJolpica("current/results.json?limit=100&offset=0")
  const total = Number(first?.MRData?.total ?? 0)
  const limit = Number(first?.MRData?.limit ?? 100) || 100
  const pages = [first]
  if (total > limit) {
    const rest = []
    for (let offset = limit; offset < total; offset += limit) {
      rest.push(getJolpica(`current/results.json?limit=${limit}&offset=${offset}`))
    }
    pages.push(...await Promise.all(rest))
  }

  const byRound = new Map<string, F1Race>()
  for (const page of pages) {
    for (const race of page?.MRData?.RaceTable?.Races ?? []) {
      const key = race.round || race.raceName || ""
      const existing = byRound.get(key)
      if (!existing) {
        byRound.set(key, { ...race, Results: [...(race.Results ?? [])] })
        continue
      }
      existing.Results = [...(existing.Results ?? []), ...(race.Results ?? [])]
    }
  }
  return Array.from(byRound.values())
    .map((race) => ({
      ...race,
      Results: [...(race.Results ?? [])].sort((a, b) => Number(a.position) - Number(b.position)),
    }))
    .sort((a, b) => Number(a.round) - Number(b.round))
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

export function personName(driver?: F1Driver): string {
  return [driver?.givenName, driver?.familyName].filter(Boolean).join(" ")
}

export function placeName(race: F1Race): string {
  const parts = [race.Circuit?.Location?.locality, race.Circuit?.Location?.country].filter(Boolean)
  return parts.join(", ") || race.Circuit?.circuitName || "Circuit details to follow"
}

function classifiedResult(result: F1Result, index: number): ClassifiedResult {
  return {
    position: result.position || String(index + 1),
    number: result.number || result.Driver?.permanentNumber || "—",
    driverId: result.Driver?.driverId || "",
    driver: personName(result.Driver) || "Driver",
    code: result.Driver?.code || "",
    teamId: result.Constructor?.constructorId || "",
    team: result.Constructor?.name || "Team",
    grid: result.grid || "—",
    laps: result.laps || "—",
    time: result.Time?.time || result.status || "—",
    points: result.points || "0",
    status: result.status || "",
    driverImage: "",
    teamImage: "",
  }
}

function wikiTitle(url?: string): string {
  if (!url) return ""
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean)
    const wikiIndex = parts.findIndex((part) => part === "wiki")
    const raw = wikiIndex >= 0 ? parts[wikiIndex + 1] : parts.at(-1)
    return raw ? decodeURIComponent(raw).replace(/_/g, " ") : ""
  } catch {
    return ""
  }
}

function wikiKey(title: string): string {
  return title.replace(/_/g, " ").trim().toLowerCase()
}

function wikiImage(original: string, thumb: string): string {
  const raw = thumb || original
  if (!raw) return ""
  const path = raw.split("?")[0]
  // Wikimedia only renders listed widths. 640 is rejected; 960 is accepted.
  return /\/\d+px-/.test(path) ? path.replace(/\/\d+px-/, "/960px-") : path
}

async function wikiThumbnails(titles: string[]): Promise<Map<string, string>> {
  const unique = new Map<string, string>()
  for (const title of titles) {
    const key = wikiKey(title)
    if (key && !unique.has(key)) unique.set(key, title)
  }
  const images = new Map<string, string>()
  const queue = [...unique.entries()]
  async function worker() {
    while (queue.length > 0) {
      const next = queue.shift()
      if (!next) return
      const [key, title] = next
      try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`, {
          headers: {
            Accept: "application/json",
            "User-Agent": "AmakuruMotorsport/1.0 (https://www.amakuru.rw)",
          },
          next: { revalidate: JOLPICA_REFRESH_SECONDS },
        })
        if (!response.ok) continue
        const body = (await response.json()) as { thumbnail?: { source?: string }; originalimage?: { source?: string } }
        const source = wikiImage(body.originalimage?.source || "", body.thumbnail?.source || "")
        if (source) images.set(key, source)
      } catch {
        continue
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, () => worker()))
  return images
}

export async function getF1SeasonData(): Promise<F1SeasonData> {
  const [schedule, driverCatalog, constructorCatalog, drivers, constructors, resultRaces] = await Promise.all([
    getJolpica("current.json?limit=100"),
    getJolpica("current/drivers.json?limit=100"),
    getJolpica("current/constructors.json?limit=30"),
    getJolpica("current/driverStandings.json?limit=40"),
    getJolpica("current/constructorStandings.json?limit=20"),
    getAllSeasonResults(),
  ])

  const scheduleRaces = schedule?.MRData?.RaceTable?.Races ?? []
  const driverRows = drivers?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? []
  const constructorRows = constructors?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? []
  const completedRaces = resultRaces.filter((race) => (race.Results?.length ?? 0) > 0)
  const catalog = new Map(
    (driverCatalog?.MRData?.DriverTable?.Drivers ?? [])
      .filter((driver) => driver.driverId)
      .map((driver) => [driver.driverId as string, driver]),
  )
  const teams = constructorCatalog?.MRData?.ConstructorTable?.Constructors ?? []

  const classifiedRaces: ClassifiedRace[] = completedRaces.map((race) => ({
    round: race.round || "",
    name: race.raceName || "Grand Prix",
    place: placeName(race),
    circuit: race.Circuit?.circuitName || "",
    circuitImage: "",
    when: formatKigaliDateTime(race),
    results: (race.Results ?? []).map(classifiedResult),
  }))

  const gridDrivers: GridDriver[] = driverRows.flatMap((row) => {
    const id = row.Driver?.driverId
    if (!id) return []
    const profile = catalog.get(id)
    const team = row.Constructors?.[0]
    return [{
      id,
      name: personName(row.Driver) || personName(profile) || "Driver",
      code: row.Driver?.code || profile?.code || "",
      number: row.Driver?.permanentNumber || profile?.permanentNumber || "",
      nationality: profile?.nationality || row.Driver?.nationality || "",
      dateOfBirth: profile?.dateOfBirth || row.Driver?.dateOfBirth || "",
      wikipedia: profile?.url || row.Driver?.url || "",
      team: team?.name || "",
      teamId: team?.constructorId || "",
      points: row.points || "0",
      position: row.position || "",
      wins: row.wins || "0",
      image: "",
    }]
  })

  const driversByTeam = new Map<string, GridTeam["drivers"]>()
  for (const driver of gridDrivers) {
    if (!driver.teamId) continue
    const list = driversByTeam.get(driver.teamId) ?? []
    list.push({ id: driver.id, name: driver.name, code: driver.code, number: driver.number, image: "" })
    driversByTeam.set(driver.teamId, list)
  }

  const standingByTeam = new Map(
    constructorRows
      .filter((row) => row.Constructor?.constructorId)
      .map((row) => [row.Constructor?.constructorId as string, row]),
  )

  const gridTeams: GridTeam[] = (constructorRows.length ? constructorRows.map((row) => row.Constructor) : teams)
    .filter((team): team is F1Constructor => Boolean(team?.constructorId))
    .map((team) => {
      const standing = standingByTeam.get(team.constructorId as string)
      const official = officialTeamSite(team.constructorId)
      return {
        id: team.constructorId as string,
        name: team.name || standing?.Constructor?.name || "Team",
        nationality: team.nationality || standing?.Constructor?.nationality || "",
        wikipedia: team.url || standing?.Constructor?.url || "",
        officialUrl: official?.href || "",
        officialLabel: official?.label || team.name || "Official website",
        points: standing?.points || "0",
        position: standing?.position || "",
        wins: standing?.wins || "0",
        image: "",
        drivers: driversByTeam.get(team.constructorId as string) ?? [],
      }
    })

  const thumbs = await wikiThumbnails([
    ...gridDrivers.map((driver) => driver.wikipedia),
    ...gridTeams.map((team) => team.wikipedia),
    ...scheduleRaces.map((race) => race.Circuit?.url || ""),
    ...completedRaces.map((race) => race.Circuit?.url || ""),
  ].map(wikiTitle))
  const thumbFor = (url?: string) => {
    const title = wikiTitle(url)
    return title ? thumbs.get(wikiKey(title)) || "" : ""
  }
  const picturedDrivers = gridDrivers.map((driver) => ({ ...driver, image: thumbFor(driver.wikipedia) }))
  const driverImageById = new Map(picturedDrivers.map((driver) => [driver.id, driver.image]))
  const picturedTeams = gridTeams.map((team) => ({
    ...team,
    image: thumbFor(team.wikipedia),
    drivers: team.drivers.map((driver) => ({ ...driver, image: driverImageById.get(driver.id) || "" })),
  }))
  const teamImageById = new Map(picturedTeams.map((team) => [team.id, team.image]))
  const picturedRaces = classifiedRaces.map((race) => {
    const source = completedRaces.find((item) => item.round === race.round)
    return {
      ...race,
      circuitImage: thumbFor(source?.Circuit?.url),
      results: race.results.map((result) => ({
        ...result,
        driverImage: driverImageById.get(result.driverId) || "",
        teamImage: teamImageById.get(result.teamId) || "",
      })),
    }
  })

  const picturedSchedule = scheduleRaces.map((race) => ({ ...race, image: thumbFor(race.Circuit?.url) }))
  const latestRound = completedRaces.at(-1)?.round

  return {
    season: schedule?.MRData?.RaceTable?.season ?? String(new Date().getUTCFullYear()),
    races: picturedSchedule,
    classifiedRaces: picturedRaces,
    driverStandings: driverRows,
    constructorStandings: constructorRows,
    gridDrivers: picturedDrivers,
    gridTeams: picturedTeams,
    latestRace: picturedSchedule.find((race) => race.round === latestRound) ?? null,
    updatedAt: new Date().toISOString(),
  }
}

export function raceStartTimestamp(race: F1Race): number {
  if (!race.date) return Number.POSITIVE_INFINITY
  const start = race.time ? `${race.date}T${race.time}` : `${race.date}T23:59:59Z`
  const parsed = Date.parse(start)
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed
}

export function formatKigaliDateTime(race: Pick<F1Race, "date" | "time">): string {
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

export function formatPoints(value?: string): string {
  const points = Number(value)
  return Number.isFinite(points) ? points.toLocaleString("en-RW", { maximumFractionDigits: 1 }) : "—"
}

export function driverResults(data: F1SeasonData, driverId: string) {
  return data.classifiedRaces.flatMap((race) => {
    const result = race.results.find((row) => row.driverId === driverId)
    return result ? [{ race, result }] : []
  })
}

export function teamResults(data: F1SeasonData, teamId: string) {
  return data.classifiedRaces.flatMap((race) => {
    const results = race.results.filter((row) => row.teamId === teamId)
    return results.length ? [{ race, results }] : []
  })
}
