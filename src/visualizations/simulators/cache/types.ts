export type CacheParams = {
  /** Entries the cache holds before evicting. */
  capacity: number
  /** Distinct keys the application reads. */
  keys: number
}

export type CacheRead = {
  key: number
  hit: boolean
  /** Least recently used key removed to make room, if any. */
  evicted: number | null
}

export type CacheState = {
  tick: number
  seed: number
  /** Cached keys ordered from most to least recently used. */
  entries: number[]
  hits: number
  misses: number
  last: CacheRead | null
}
