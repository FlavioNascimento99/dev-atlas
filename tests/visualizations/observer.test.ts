import { describe, expect, it } from 'vitest'
import { advanceSubject, createSubject, isStale, OBSERVERS, setSubscribed } from '@/visualizations/simulators/observer/simulation'
import type { ObserverId, ObserverState } from '@/visualizations/simulators/observer/types'

/** Runs one full change and returns the observers in the order they were called. */
function change(start: ObserverState): { state: ObserverState; called: ObserverId[] } {
  const called: ObserverId[] = []
  let state = advanceSubject(start)
  while (state.phase !== 'returned') {
    state = advanceSubject(state)
    if (state.current) called.push(state.current)
  }
  return { state, called }
}

describe('observer pattern', () => {
  it('notifies every subscribed observer in subscription order before returning to the caller', () => {
    const { state, called } = change(createSubject())
    expect(called).toEqual([...OBSERVERS])
    for (const id of OBSERVERS) expect(state.seen[id]).toBe(state.value)
  })

  it('calls one observer per step and returns only after the last one', () => {
    let state = advanceSubject(createSubject())
    expect(state.phase).toBe('changed')
    for (const id of OBSERVERS) {
      state = advanceSubject(state)
      expect([state.phase, state.current]).toEqual(['notifying', id])
    }
    expect(advanceSubject(state).phase).toBe('returned')
  })

  it('leaves an unsubscribed observer with the old value, visibly stale', () => {
    const start = setSubscribed(createSubject(), 'chart', false)
    expect(isStale(start, 'chart')).toBe(false)
    const { state, called } = change(start)
    expect(called).toEqual(['totals', 'autosave'])
    expect(state.seen.chart).toBe(start.value)
    expect(isStale(state, 'chart')).toBe(true)
    expect(isStale(state, 'totals')).toBe(false)
  })

  it('puts an observer that subscribes again at the end of the list', () => {
    const start = setSubscribed(setSubscribed(createSubject(), 'chart', false), 'chart', true)
    expect(change(start).called).toEqual(['totals', 'autosave', 'chart'])
  })

  it('iterates over a copy of the list: unsubscribing during a notification only affects the next change', () => {
    let state = setSubscribed(advanceSubject(createSubject()), 'autosave', false)
    while (state.phase !== 'returned') state = advanceSubject(state)
    expect(state.seen.autosave).toBe(state.value)
    expect(change(state).called).toEqual(['chart', 'totals'])
  })

  it('returns immediately when nobody is subscribed', () => {
    const empty = OBSERVERS.reduce((state, id) => setSubscribed(state, id, false), createSubject())
    const { state, called } = change(empty)
    expect(called).toEqual([])
    expect(OBSERVERS.every((id) => isStale(state, id))).toBe(true)
  })
})
