import { describe, expect, it } from 'vitest'
import {
  capModel,
  createCap,
  cutLink,
  healLink,
  INITIAL_VALUE,
  request,
  REQUEST_CYCLE,
} from '@/visualizations/simulators/cap-theorem/simulation'
import type { CapMode, CapRequest, CapState } from '@/visualizations/simulators/cap-theorem/types'

const writeN1: CapRequest = { client: 0, node: 0, kind: 'write' }
const readN1: CapRequest = { client: 0, node: 0, kind: 'read' }
const writeN3: CapRequest = { client: 1, node: 2, kind: 'write' }
const readN3: CapRequest = { client: 1, node: 2, kind: 'read' }

function run(mode: CapMode, requests: CapRequest[], state = createCap()): CapState {
  return requests.reduce((current, next) => request(current, next, mode), state)
}

const values = (state: CapState) => state.replicas.map((replica) => replica.value)

describe('CAP: one partition, two designs', () => {
  it('accepts a write on the majority side in both designs, without reaching the minority', () => {
    for (const mode of ['consistency', 'availability'] as const) {
      const state = run(mode, [writeN1])
      expect(state.last).toMatchObject({ outcome: 'writeCommitted', value: 2 })
      expect(values(state)).toEqual([2, 2, INITIAL_VALUE])
    }
  })

  it('consistency first: the minority side refuses writes and reads, and its value never changes', () => {
    const state = run('consistency', [writeN1, readN3, writeN3])
    expect(state.lastByClient[1]?.outcome).toBe('writeRejected')
    expect(run('consistency', [writeN1, readN3]).last?.outcome).toBe('readRejected')
    expect(values(state)).toEqual([2, 2, INITIAL_VALUE])
  })

  it('availability first: the minority side answers with a stale value and accepts a write the others never see', () => {
    const stale = run('availability', [writeN1, readN3])
    expect(stale.last).toMatchObject({ outcome: 'readStale', value: INITIAL_VALUE })
    const diverged = run('availability', [writeN3], stale)
    expect(diverged.last).toMatchObject({ outcome: 'writeTentative', value: 3 })
    expect(values(diverged)).toEqual([2, 2, 3])
  })

  it('consistency first: healing only lets the minority catch up, nothing is dropped', () => {
    const healed = healLink(run('consistency', [writeN1, readN3, writeN3]))
    expect(healed.last).toEqual({ outcome: 'healCaughtUp', node: 0, value: 2 })
    expect(values(healed)).toEqual([2, 2, 2])
  })

  it('availability first: healing keeps the last write and drops the conflicting one', () => {
    const healed = healLink(run('availability', [writeN1, readN3, writeN3]))
    expect(healed.last).toEqual({ outcome: 'healReconciled', node: 2, value: 3, dropped: 2 })
    expect(values(healed)).toEqual([3, 3, 3])
  })

  it('has nothing to repair when no write happened during the partition', () => {
    expect(healLink(run('availability', [readN3])).last?.outcome).toBe('healInSync')
  })

  it('behaves the same in both designs while the network is healthy', () => {
    const requests = [writeN1, readN3, writeN3, readN1]
    const [consistent, available] = (['consistency', 'availability'] as const).map((mode) => run(mode, requests, healLink(createCap())))
    expect(consistent).toEqual(available)
    expect(consistent?.last).toMatchObject({ outcome: 'readFresh', value: 3 })
    expect(values(consistent ?? createCap())).toEqual([3, 3, 3])
  })

  it('consistency first never serves a stale read, however the link flaps', () => {
    const params = { mode: 'consistency' as const }
    let state = capModel.create(params)
    for (let step = 0; step < 60; step++) {
      if (step % 7 === 3) state = state.partitioned ? healLink(state) : cutLink(state)
      state = capModel.advance(state, params)
      expect(state.last?.outcome).not.toBe('readStale')
      expect(state.last?.outcome).not.toBe('writeTentative')
    }
  })

  it('cycles the requests of both clients and starts partitioned', () => {
    const params = { mode: 'availability' as const }
    let state = capModel.create(params)
    expect(state.partitioned).toBe(true)
    const seen = REQUEST_CYCLE.map(() => {
      state = capModel.advance(state, params)
      return [state.last?.client, state.last?.node]
    })
    expect(seen).toEqual(REQUEST_CYCLE.map(({ client, node }) => [client, node]))
  })

  it('ignores a cut on a cut link and a heal on a healthy one', () => {
    const cut = createCap()
    expect(cutLink(cut)).toBe(cut)
    const healthy = healLink(cut)
    expect(healLink(healthy)).toBe(healthy)
  })
})
