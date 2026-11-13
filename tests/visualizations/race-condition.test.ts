import { describe, expect, it } from 'vitest'
import { advanceRace, createRace, isRaceFinished } from '@/visualizations/simulators/race-condition/simulation'
import type { RaceParams, RaceState } from '@/visualizations/simulators/race-condition/types'

function run(params: RaceParams): RaceState[] {
  const states = [createRace(params)]
  while (!isRaceFinished(states.at(-1)!)) states.push(advanceRace(states.at(-1)!))
  return states
}

describe('race condition', () => {
  it('loses an update without a mutex when both threads read before either writes', () => {
    const states = run({ mutex: false, increments: 1 })
    const events = states.flatMap((state) => (state.last ? [`${state.last.thread}:${state.last.operation}`] : []))
    expect(events).toEqual(['0:read', '1:read', '0:add', '1:add', '0:write', '1:write'])
    const final = states.at(-1)!
    expect(final.counter).toBe(1)
    expect(final.lostUpdates).toBe(1)
    expect(final.last?.lostUpdate).toBe(true)
  })

  it('keeps the counter correct with a mutex serializing the critical section', () => {
    for (const increments of [1, 2, 3]) {
      const final = run({ mutex: true, increments }).at(-1)!
      expect(final.counter).toBe(2 * increments)
      expect(final.lostUpdates).toBe(0)
      expect(final.lockOwner).toBeNull()
    }
  })

  it('blocks the second thread while the first one holds the mutex', () => {
    const states = run({ mutex: true, increments: 1 })
    expect(states[2]?.last).toMatchObject({ thread: 1, operation: 'acquire', blocked: true })
    expect(states[2]?.threads[1]?.pc).toBe(0)
  })

  it('does not change once both threads finished', () => {
    const final = run({ mutex: false, increments: 2 }).at(-1)!
    expect(advanceRace(final)).toBe(final)
  })
})
