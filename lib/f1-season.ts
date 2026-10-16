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

export type ImageCredit = {
  fileName: string
  sourceUrl: string
  artist: string
  license: string
  licenseUrl: string
  modification?: string
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

export type F1LapTiming = { driverId?: string; position?: string; time?: string }
export type F1Lap = { number?: string; Timings?: F1LapTiming[] }
export type RaceLapData = { laps: F1Lap[]; totalRecords: number; loadedRecords: number; complete: boolean }

export type F1Race = {
  season?: string
  round?: string
  raceName?: string
  date?: string
  time?: string
  url?: string
  image?: string
  imageCredit?: ImageCredit | null
  Circuit?: {
    circuitId?: string
    circuitName?: string
    url?: string
    Location?: { locality?: string; country?: string }
  }
  Qualifying?: SessionStamp
  Sprint?: SessionStamp
  Results?: F1Result[]
  SprintResults?: F1Result[]
  Laps?: F1Lap[]
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
  driverImageCredit?: ImageCredit | null
  teamImage: string
}

export type ClassifiedRace = {
  round: string
  name: string
  place: string
  circuit: string
  circuitId: string
  circuitImage: string
  imageCredit?: ImageCredit | null
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
  imageCredit?: ImageCredit | null
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
  drivers: Array<{ id: string; name: string; code: string; number: string; image: string; imageCredit?: ImageCredit | null }>
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
  progression: ChampionshipProgression
  latestRace: F1Race | null
  updatedAt: string
  unavailable: boolean
}

export type ChampionshipRound = {
  round: string
  label: string
  name: string
  driverPoints: Record<string, number>
  constructorPoints: Record<string, number>
}

export type ChampionshipProgression = {
  rounds: ChampionshipRound[]
  drivers: Array<{ id: string; name: string; code: string; teamId: string; team: string }>
  constructors: Array<{ id: string; name: string }>
}

async function getSeasonRacePages(path: string): Promise<F1Race[]> {
  const races: F1Race[] = []
  let offset = 0
  let limit = 100
  let total = 0
  do {
    const page = await getJolpica(`${path}?limit=${limit}&offset=${offset}`)
    if (!page) break
    races.push(...(page.MRData?.RaceTable?.Races ?? []))
    total = Number(page.MRData?.total ?? 0)
    limit = Number(page.MRData?.limit ?? limit) || limit
    offset += limit
  } while (offset < total)
  return races
}

async function getAllSeasonResults(): Promise<F1Race[]> {
  const [grandPrixRows, sprintRows] = await Promise.all([
    getSeasonRacePages("current/results.json"),
    getSeasonRacePages("current/sprint.json"),
  ])
  const byRound = new Map<string, F1Race>()
  for (const race of grandPrixRows) {
    const key = race.round || race.raceName || ""
    const existing = byRound.get(key)
    byRound.set(key, {
      ...existing,
      ...race,
      Results: [...(existing?.Results ?? []), ...(race.Results ?? [])],
      SprintResults: existing?.SprintResults ?? [],
    })
  }
  for (const race of sprintRows) {
    const key = race.round || race.raceName || ""
    const existing = byRound.get(key)
    byRound.set(key, {
      ...existing,
      ...race,
      Results: existing?.Results ?? [],
      SprintResults: [...(existing?.SprintResults ?? []), ...(race.Results ?? [])],
    })
  }
  return Array.from(byRound.values())
    .map((race) => ({
      ...race,
      Results: [...(race.Results ?? [])].sort((a, b) => Number(a.position) - Number(b.position)),
      SprintResults: [...(race.SprintResults ?? [])].sort((a, b) => Number(a.position) - Number(b.position)),
    }))
    .sort((a, b) => Number(a.round) - Number(b.round))
}

export async function getJolpica(path: string): Promise<JolpicaPayload | null> {
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

export async function getRaceLapData(season: string, round: string): Promise<RaceLapData> {
  if (!/^\d{4}$/.test(season) || !/^\d+$/.test(round)) {
    return { laps: [], totalRecords: 0, loadedRecords: 0, complete: false }
  }
  const path = `${season}/${round}/laps.json`
  const first = await getJolpica(`${path}?limit=100&offset=0`)
  if (!first) return { laps: [], totalRecords: 0, loadedRecords: 0, complete: false }

  const totalRecords = Number(first.MRData?.total ?? 0)
  let limit = Number(first.MRData?.limit ?? 100) || 100
  let offset = limit
  const pages = [first]
  let loadedRecords = (first.MRData?.RaceTable?.Races ?? [])
    .flatMap((race) => race.Laps ?? [])
    .reduce((sum, lap) => sum + (lap.Timings?.length ?? 0), 0)
  while (offset < totalRecords) {
    const page = await getJolpica(`${path}?limit=${limit}&offset=${offset}`)
    if (!page) break
    pages.push(page)
    const rows = (page.MRData?.RaceTable?.Races ?? []).flatMap((race) => race.Laps ?? [])
    loadedRecords += rows.reduce((sum, lap) => sum + (lap.Timings?.length ?? 0), 0)
    limit = Number(page.MRData?.limit ?? limit) || limit
    offset += limit
  }

  const byLap = new Map<string, Map<string, F1LapTiming>>()
  for (const page of pages) {
    for (const race of page.MRData?.RaceTable?.Races ?? []) {
      for (const lap of race.Laps ?? []) {
        if (!lap.number) continue
        const timings = byLap.get(lap.number) ?? new Map<string, F1LapTiming>()
        for (const timing of lap.Timings ?? []) {
          if (timing.driverId) timings.set(timing.driverId, timing)
        }
        byLap.set(lap.number, timings)
      }
    }
  }
  const laps = Array.from(byLap.entries())
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([number, timings]) => ({
      number,
      Timings: Array.from(timings.values()).sort((a, b) => Number(a.position) - Number(b.position)),
    }))
  return { laps, totalRecords, loadedRecords, complete: totalRecords > 0 && loadedRecords >= totalRecords }
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
    team: teamDisplayName(result.Constructor?.constructorId, result.Constructor?.name) || "Team",
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

const TEAM_DISPLAY_NAMES: Record<string, string> = {
  alpine: "Alpine",
  aston_martin: "Aston Martin",
  audi: "Audi",
  cadillac: "Cadillac",
  ferrari: "Ferrari",
  haas: "Haas F1 Team",
  mclaren: "McLaren",
  mercedes: "Mercedes",
  rb: "Racing Bulls",
  red_bull: "Red Bull Racing",
  williams: "Williams",
}

export function teamDisplayName(id?: string, fallback?: string): string {
  return (id && TEAM_DISPLAY_NAMES[id]) || fallback || ""
}

type WikiImageAsset = { url: string; fileName: string; credit: ImageCredit }

const CURATED_DRIVER_ASSETS: Record<string, WikiImageAsset> = {
  hamilton: {
    url: "/images/drivers/lewis-hamilton.webp",
    fileName: "Lewis Hamilton 2016 Malaysia 2.jpg",
    credit: {
      fileName: "Lewis Hamilton 2016 Malaysia 2.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Lewis_Hamilton_2016_Malaysia_2.jpg",
      artist: "Morio",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      modification: "Converted to WebP for responsive delivery; original photograph from 2016.",
    },
  },
}

function commonsFileName(rawUrl: string): string {
  try {
    const path = new URL(rawUrl).pathname
    const marker = "/wikipedia/commons/"
    const index = path.indexOf(marker)
    if (index < 0) return ""
    const parts = path.slice(index + marker.length).split("/").filter(Boolean)
    const encoded = parts[0] === "thumb" ? parts[3] : parts.at(-1)
    return encoded ? decodeURIComponent(encoded).replace(/_/g, " ") : ""
  } catch {
    return ""
  }
}

function plainText(value?: string): string {
  return (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => {
      try { return String.fromCodePoint(parseInt(code, 16)) } catch { return "" }
    })
    .replace(/&#(\d+);/g, (_, code: string) => {
      try { return String.fromCodePoint(Number(code)) } catch { return "" }
    })
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function reusableImageLicense(label: string): boolean {
  return /^(cc0\b|public domain\b|pd\b|gfdl\b)/i.test(label) || /^cc by(?:-sa)?\s+(?:\d|international)/i.test(label)
}

async function commonsCredits(fileNames: string[]): Promise<Map<string, ImageCredit>> {
  const unique = Array.from(new Set(fileNames.filter(Boolean)))
  const credits = new Map<string, ImageCredit>()
  for (let offset = 0; offset < unique.length; offset += 50) {
    const chunk = unique.slice(offset, offset + 50)
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      prop: "imageinfo",
      iiprop: "url|extmetadata",
      titles: chunk.map((name) => `File:${name.replace(/ /g, "_")}`).join("|"),
    })
    try {
      const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
        headers: {
          Accept: "application/json",
          "User-Agent": "AmakuruMotorsport/1.0 (https://www.amakuru.rw; image attribution lookup)",
        },
        next: { revalidate: JOLPICA_REFRESH_SECONDS },
      })
      if (!response.ok) continue
      const body = await response.json() as {
        query?: { pages?: Record<string, { title?: string; imageinfo?: Array<{ descriptionurl?: string; extmetadata?: Record<string, { value?: string }> }> }> }
      }
      for (const page of Object.values(body.query?.pages ?? {})) {
        const info = page.imageinfo?.[0]
        const metadata = info?.extmetadata ?? {}
        const license = plainText(metadata.LicenseShortName?.value)
        const sourceUrl = info?.descriptionurl || ""
        if (!sourceUrl || !reusableImageLicense(license)) continue
        const artist = plainText(metadata.Artist?.value || metadata.Attribution?.value || metadata.Credit?.value)
        const noAttribution = /^(cc0\b|public domain\b|pd\b)/i.test(license)
        if (!artist && !noAttribution) continue
        const fileName = (page.title || "").replace(/^File:/i, "")
        credits.set(wikiKey(fileName), {
          fileName,
          sourceUrl,
          artist: artist || "Public-domain image",
          license,
          licenseUrl: plainText(metadata.LicenseUrl?.value),
        })
      }
    } catch {
      continue
    }
  }
  return credits
}

function wikiImage(original: string, thumb: string): string {
  const raw = thumb || original
  if (!raw) return ""
  const path = raw.split("?")[0]
  // Wikimedia only renders listed widths. 640 is rejected; 960 is accepted.
  return /\/\d+px-/.test(path) ? path.replace(/\/\d+px-/, "/960px-") : path
}

async function wikiThumbnails(titles: string[]): Promise<Map<string, WikiImageAsset>> {
  const unique = new Map<string, string>()
  for (const title of titles) {
    const key = wikiKey(title)
    if (key && !unique.has(key)) unique.set(key, title)
  }
  const images = new Map<string, { url: string; fileName: string }>()
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
        const fileName = commonsFileName(source)
        if (source && fileName) images.set(key, { url: source, fileName })
      } catch {
        continue
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, () => worker()))
  const verifiedCredits = await commonsCredits(Array.from(images.values(), (image) => image.fileName))
  const verified = new Map<string, WikiImageAsset>()
  for (const [key, image] of images) {
    const credit = verifiedCredits.get(wikiKey(image.fileName))
    if (credit) verified.set(key, { ...image, credit })
  }
  return verified
}

function buildChampionshipProgression(
  races: F1Race[],
  drivers: GridDriver[],
  constructors: GridTeam[],
): ChampionshipProgression {
  const driverMeta = new Map(drivers.map((driver) => [driver.id, {
    id: driver.id,
    name: driver.name,
    code: driver.code,
    teamId: driver.teamId,
    team: driver.team,
  }]))
  const constructorMeta = new Map(constructors.map((team) => [team.id, { id: team.id, name: team.name }]))
  const driverTotals = new Map(drivers.map((driver) => [driver.id, 0]))
  const constructorTotals = new Map(constructors.map((team) => [team.id, 0]))
  const rounds: ChampionshipRound[] = []

  for (const race of races) {
    for (const result of [...(race.SprintResults ?? []), ...(race.Results ?? [])]) {
      const points = Number(result.points ?? 0)
      if (!Number.isFinite(points)) continue
      const driverId = result.Driver?.driverId
      const constructorId = result.Constructor?.constructorId
      if (driverId) {
        driverTotals.set(driverId, (driverTotals.get(driverId) ?? 0) + points)
        if (!driverMeta.has(driverId)) {
          driverMeta.set(driverId, {
            id: driverId,
            name: personName(result.Driver) || driverId,
            code: result.Driver?.code || "",
            teamId: constructorId || "",
            team: teamDisplayName(constructorId, result.Constructor?.name),
          })
        }
      }
      if (constructorId) {
        constructorTotals.set(constructorId, (constructorTotals.get(constructorId) ?? 0) + points)
        if (!constructorMeta.has(constructorId)) {
          constructorMeta.set(constructorId, {
            id: constructorId,
            name: teamDisplayName(constructorId, result.Constructor?.name) || constructorId,
          })
        }
      }
    }
    const round = race.round || String(rounds.length + 1)
    rounds.push({
      round,
      label: `R${round.padStart(2, "0")}`,
      name: race.raceName || "Grand Prix",
      driverPoints: Object.fromEntries(driverTotals),
      constructorPoints: Object.fromEntries(constructorTotals),
    })
  }

  return {
    rounds,
    drivers: Array.from(driverMeta.values()).sort((a, b) => (driverTotals.get(b.id) ?? 0) - (driverTotals.get(a.id) ?? 0)),
    constructors: Array.from(constructorMeta.values()).sort((a, b) => (constructorTotals.get(b.id) ?? 0) - (constructorTotals.get(a.id) ?? 0)),
  }
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
    circuitId: race.Circuit?.circuitId || "",
    circuitImage: "",
    imageCredit: null,
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
      team: teamDisplayName(team?.constructorId, team?.name),
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
        name: teamDisplayName(team.constructorId, team.name || standing?.Constructor?.name) || "Team",
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
    ...scheduleRaces.map((race) => race.Circuit?.url || ""),
    ...completedRaces.map((race) => race.Circuit?.url || ""),
  ].map(wikiTitle))
  const assetFor = (url?: string) => {
    const title = wikiTitle(url)
    return title ? thumbs.get(wikiKey(title)) : undefined
  }
  const picturedDrivers = gridDrivers.map((driver) => {
    const asset = assetFor(driver.wikipedia)
    const curated = CURATED_DRIVER_ASSETS[driver.id]
    return { ...driver, image: asset?.url || curated?.url || "", imageCredit: asset?.credit ?? curated?.credit ?? null }
  })
  const driverById = new Map(picturedDrivers.map((driver) => [driver.id, driver]))
  const picturedTeams = gridTeams.map((team) => ({
    ...team,
    image: "",
    drivers: team.drivers.map((driver) => {
      const source = driverById.get(driver.id)
      return { ...driver, image: source?.image || "", imageCredit: source?.imageCredit ?? null }
    }),
  }))
  const picturedRaces = classifiedRaces.map((race) => {
    const source = completedRaces.find((item) => item.round === race.round)
    const asset = assetFor(source?.Circuit?.url)
    return {
      ...race,
      circuitImage: asset?.url || "",
      imageCredit: asset?.credit ?? null,
      results: race.results.map((result) => ({
        ...result,
        driverImage: driverById.get(result.driverId)?.image || "",
        driverImageCredit: driverById.get(result.driverId)?.imageCredit ?? null,
        teamImage: "",
      })),
    }
  })

  const picturedSchedule = scheduleRaces.map((race) => {
    const asset = assetFor(race.Circuit?.url)
    return { ...race, image: asset?.url || "", imageCredit: asset?.credit ?? null }
  })
  const latestRound = completedRaces.at(-1)?.round

  return {
    season: schedule?.MRData?.RaceTable?.season ?? String(new Date().getUTCFullYear()),
    races: picturedSchedule,
    classifiedRaces: picturedRaces,
    driverStandings: driverRows,
    constructorStandings: constructorRows,
    gridDrivers: picturedDrivers,
    gridTeams: picturedTeams,
    progression: buildChampionshipProgression(completedRaces, picturedDrivers, picturedTeams),
    latestRace: picturedSchedule.find((race) => race.round === latestRound) ?? null,
    updatedAt: new Date().toISOString(),
    unavailable: schedule == null,
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
