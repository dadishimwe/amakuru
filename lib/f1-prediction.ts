/**
 * Formula One winner-probability foundation.
 *
 * This module deliberately has no bundled/default coefficients: callers must pass coefficients
 * estimated and calibrated using a leakage-safe historical evaluation. No public forecast is
 * emitted until that empirical fitting and validation work exists.
 */
export const WINNER_MODEL_VERSION = "pre-race-rank-logit-v1"

export type PreRaceEntrant = {
  driverId: string
  driverName: string
  /** Adjusted starting-grid position, known after qualifying and steward penalties. */
  gridPosition: number
  /** Standardized features computed from prior races only (never the target event). */
  driverFormZ: number
  constructorFormZ: number
  teammateRelativeFormZ: number
}

export type WinnerModelCoefficients = {
  intercept: number
  gridPenalty: number
  driverForm: number
  constructorForm: number
  teammateRelativeForm: number
  /** Positive temperature fitted on past validation seasons; controls probability sharpness. */
  temperature: number
}

export type WinnerProbability = {
  driverId: string
  driverName: string
  score: number
  probability: number
  modelVersion: typeof WINNER_MODEL_VERSION
  featureCutoff: "pre-race-after-adjusted-grid"
}

/**
 * Converts pre-race driver/team features into race-winner probabilities using a multinomial
 * logit (softmax over linear scores). All feature scales and coefficients must be fitted on
 * earlier seasons only. This is a scoring primitive, not a claim of validated accuracy.
 */
export function predictRaceWinnerProbabilities(
  entrants: PreRaceEntrant[],
  coefficients: WinnerModelCoefficients,
): WinnerProbability[] {
  if (entrants.length < 2) throw new Error("At least two entrants are required to produce a race distribution.")
  if (new Set(entrants.map((entrant) => entrant.driverId)).size !== entrants.length) {
    throw new Error("Each driver must appear only once in a race.")
  }
  if (!Number.isFinite(coefficients.temperature) || coefficients.temperature <= 0) {
    throw new Error("Temperature must be a finite positive value fitted on past validation data.")
  }
  for (const [name, value] of Object.entries(coefficients)) {
    if (!Number.isFinite(value)) throw new Error(`Coefficient ${name} must be finite.`)
  }

  const scored = entrants.map((entrant) => {
    if (!entrant.driverId.trim()) throw new Error("Every entrant needs a stable driver ID.")
    if (!Number.isInteger(entrant.gridPosition) || entrant.gridPosition < 1) {
      throw new Error(`Invalid adjusted grid position for ${entrant.driverName}.`)
    }
    for (const [name, value] of Object.entries({
      driverFormZ: entrant.driverFormZ,
      constructorFormZ: entrant.constructorFormZ,
      teammateRelativeFormZ: entrant.teammateRelativeFormZ,
    })) {
      if (!Number.isFinite(value)) throw new Error(`${name} must be finite for ${entrant.driverName}.`)
    }
    const score = coefficients.intercept
      - coefficients.gridPenalty * (entrant.gridPosition - 1)
      + coefficients.driverForm * entrant.driverFormZ
      + coefficients.constructorForm * entrant.constructorFormZ
      + coefficients.teammateRelativeForm * entrant.teammateRelativeFormZ
    return { entrant, score }
  })

  const maxScaledScore = Math.max(...scored.map(({ score }) => score / coefficients.temperature))
  const unnormalized = scored.map(({ score }) => Math.exp(score / coefficients.temperature - maxScaledScore))
  const normalizer = unnormalized.reduce((sum, value) => sum + value, 0)

  return scored
    .map(({ entrant, score }, index) => ({
      driverId: entrant.driverId,
      driverName: entrant.driverName,
      score,
      probability: unnormalized[index] / normalizer,
      modelVersion: WINNER_MODEL_VERSION as typeof WINNER_MODEL_VERSION,
      featureCutoff: "pre-race-after-adjusted-grid" as const,
    }))
    .sort((a, b) => b.probability - a.probability)
}
