import { describe, expect, it } from 'vitest'
import { cacheModel, createCache, hitRatio, readKey } from '@/visualizations/simulators/cache/simulation'
import type { CacheState } from '@/visualizations/simulators/cache/types'

function readAll(keys: number[], capacity: number): CacheState {
  return keys.reduce((state, key) => readKey(state, key, capacity), createCache())
}

describe('cache-aside with LRU eviction', () => {
  it('misses on the first read and hits on the next one', () => {
    const state = readAll([1, 1], 2)
    expect(state.misses).toBe(1)
    expect(state.hits).toBe(1)
    expect(state.last).toEqual({ key: 1, hit: true, evicted: null })
  })

  it('evicts the least recently used key when full', () => {
    const state = readAll([0, 1, 0, 2], 2)
    expect(state.last).toEqual({ key: 2, hit: false, evicted: 1 })
    expect(state.entries).toEqual([2, 0])
  })

  it('never holds more entries than its capacity', () => {
    expect(readAll([0, 1, 2, 3, 4, 5], 3).entries).toEqual([5, 4, 3])
  })

  it('computes the hit ratio', () => {
    expect(hitRatio(readAll([0, 0, 0, 1], 2))).toBe(0.5)
    expect(hitRatio(createCache())).toBe(0)
  })

  it('reaches a higher hit ratio with a larger cache for the same reads', () => {
    const run = (capacity: number) => {
      const params = { capacity, keys: 10 }
      let state = cacheModel.create(params)
      for (let i = 0; i < 200; i++) state = cacheModel.advance(state, params)
      return hitRatio(state)
    }
    expect(run(6)).toBeGreaterThan(run(2))
  })
})
