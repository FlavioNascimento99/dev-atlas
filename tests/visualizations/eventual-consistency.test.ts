import { describe, expect, it } from 'vitest'
import {
  ackTick,
  CONVERGENCE_TICK,
  inconsistencyWindow,
  LAST_TICK,
  quorumOverlaps,
  REPLICA_COUNT,
  replicationModel,
  updatedReplicas,
  worstCaseRead,
} from '@/visualizations/simulators/eventual-consistency/simulation'

const SIZES = Array.from({ length: REPLICA_COUNT }, (_, index) => index + 1)
const CONFIGURATIONS = SIZES.flatMap((w) => SIZES.map((r) => ({ w, r })))
const TICKS = Array.from({ length: LAST_TICK + 1 }, (_, tick) => tick)

/** Every set of `size` replicas a read could be routed to. */
function readSets(size: number): number[][] {
  const subsets = Array.from({ length: 2 ** REPLICA_COUNT }, (_, mask) => SIZES.map((n) => n - 1).filter((index) => mask & (1 << index)))
  return subsets.filter((subset) => subset.length === size)
}

function isFresh(tick: number, replicas: number[]): boolean {
  const updated = updatedReplicas(tick)
  return replicas.some((index) => updated[index])
}

describe('eventual consistency with N = 3', () => {
  it('acknowledges the write only when W replicas have stored it', () => {
    for (const w of SIZES) {
      const copies = (tick: number) => updatedReplicas(tick).filter(Boolean).length
      expect(copies(ackTick(w))).toBeGreaterThanOrEqual(w)
      expect(copies(ackTick(w) - 1)).toBeLessThan(w)
    }
  })

  it('never returns the old value after the acknowledgement when W + R > N, whatever replicas are read', () => {
    for (const params of CONFIGURATIONS.filter(quorumOverlaps)) {
      for (const tick of TICKS.filter((tick) => tick >= ackTick(params.w))) {
        for (const replicas of readSets(params.r)) expect(isFresh(tick, replicas)).toBe(true)
      }
    }
  })

  it('can return the old value after the acknowledgement when W + R <= N', () => {
    for (const params of CONFIGURATIONS.filter((params) => !quorumOverlaps(params))) {
      expect(worstCaseRead(ackTick(params.w), params.r).fresh).toBe(false)
    }
  })

  it('has an inconsistency window exactly when the quorums do not overlap', () => {
    for (const params of CONFIGURATIONS) expect(inconsistencyWindow(params) === null).toBe(quorumOverlaps(params))
  })

  it('marks as the window exactly the acknowledged ticks at which some read set is stale', () => {
    for (const params of CONFIGURATIONS) {
      const window = inconsistencyWindow(params)
      const staleTicks = TICKS.filter(
        (tick) => tick >= ackTick(params.w) && readSets(params.r).some((replicas) => !isFresh(tick, replicas)),
      )
      expect(staleTicks).toEqual(window ? TICKS.filter((tick) => tick >= window.from && tick <= window.to) : [])
    }
  })

  it('routes the worst-case read to the replicas that are furthest behind', () => {
    for (const tick of TICKS) {
      for (const r of SIZES) {
        const worst = worstCaseRead(tick, r)
        expect(worst.replicas).toHaveLength(r)
        expect(worst.fresh).toBe(readSets(r).every((replicas) => isFresh(tick, replicas)))
      }
    }
  })

  it('shows the article scenario with W = 1 and R = 1: stale reads from t1 until C converges', () => {
    expect(inconsistencyWindow({ w: 1, r: 1 })).toEqual({ from: 1, to: CONVERGENCE_TICK - 1 })
    expect(worstCaseRead(3, 1)).toEqual({ replicas: [2], fresh: false })
  })

  it('converges: once every replica has the write, every read is fresh', () => {
    expect(updatedReplicas(CONVERGENCE_TICK).every(Boolean)).toBe(true)
    expect(updatedReplicas(CONVERGENCE_TICK - 1).every(Boolean)).toBe(false)
    for (const r of SIZES) expect(worstCaseRead(CONVERGENCE_TICK, r).fresh).toBe(true)
  })

  it('advances one tick at a time and stops at the last one', () => {
    const params = { w: 1, r: 1 }
    let state = replicationModel.create(params)
    for (let step = 0; step < LAST_TICK + 3; step++) state = replicationModel.advance(state, params)
    expect(state.tick).toBe(LAST_TICK)
    expect(replicationModel.isFinished?.(state)).toBe(true)
  })
})
