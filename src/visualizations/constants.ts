/** Playback speeds offered by every lab, as multipliers of the base tick. */
export const PLAYBACK_SPEEDS = [0.5, 1, 2] as const

/** Time between two simulation steps at 1x speed. */
export const BASE_TICK_MS = 1000

/** Default seed so every reader sees the same pseudo-random run. */
export const DEFAULT_SEED = 20261113

/** Token-based colors used to tell entities apart (tasks, servers, threads), in a fixed order. */
export const ENTITY_COLORS = [
  { fill: 'fill-brand/20', stroke: 'stroke-brand' },
  { fill: 'fill-highlight/20', stroke: 'stroke-highlight' },
  { fill: 'fill-warning/20', stroke: 'stroke-warning' },
  { fill: 'fill-info/20', stroke: 'stroke-info' },
  { fill: 'fill-success/20', stroke: 'stroke-success' },
  { fill: 'fill-danger/20', stroke: 'stroke-danger' },
] as const

export function entityColor(index: number) {
  return ENTITY_COLORS[index % ENTITY_COLORS.length] ?? ENTITY_COLORS[0]
}
