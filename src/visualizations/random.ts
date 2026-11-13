/** One step of the mulberry32 generator: a pure, seedable source of pseudo-random numbers in [0, 1). */
export function nextRandom(seed: number): { value: number; seed: number } {
  const next = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(next ^ (next >>> 15), next | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return { value: ((t ^ (t >>> 14)) >>> 0) / 4294967296, seed: next }
}

/** Pseudo-random integer in [min, max]. */
export function nextInt(seed: number, min: number, max: number): { value: number; seed: number } {
  const random = nextRandom(seed)
  return { value: min + Math.floor(random.value * (max - min + 1)), seed: random.seed }
}
