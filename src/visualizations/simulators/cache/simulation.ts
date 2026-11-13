import { DEFAULT_SEED } from '../../constants'
import { nextRandom } from '../../random'
import type { SimulationModel } from '../../types'
import type { CacheParams, CacheState } from './types'

export function createCache(seed = DEFAULT_SEED): CacheState {
  return { tick: 0, seed, entries: [], hits: 0, misses: 0, last: null }
}

/** Cache-aside read: a hit refreshes the key's recency; a miss loads it from the database and evicts the LRU entry if full. */
export function readKey(state: CacheState, key: number, capacity: number): CacheState {
  const hit = state.entries.includes(key)
  const entries = [key, ...state.entries.filter((entry) => entry !== key)]
  const evicted = entries.length > capacity ? (entries.pop() ?? null) : null
  return {
    ...state,
    tick: state.tick + 1,
    entries,
    hits: state.hits + (hit ? 1 : 0),
    misses: state.misses + (hit ? 0 : 1),
    last: { key, hit, evicted },
  }
}

/** Popular keys are read more often (the product of two uniforms skews toward low keys), as in real workloads. */
export function nextKey(seed: number, keys: number): { key: number; seed: number } {
  const first = nextRandom(seed)
  const second = nextRandom(first.seed)
  return { key: Math.floor(first.value * second.value * keys), seed: second.seed }
}

export function hitRatio(state: CacheState): number {
  const reads = state.hits + state.misses
  return reads === 0 ? 0 : state.hits / reads
}

export const cacheModel: SimulationModel<CacheParams, CacheState> = {
  create: () => createCache(),
  advance: (state, { capacity, keys }) => {
    const { key, seed } = nextKey(state.seed, keys)
    return readKey({ ...state, seed }, key, capacity)
  },
}
