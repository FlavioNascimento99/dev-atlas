import type { SimulationModel } from '../../types'
import type { ObserverId, ObserverState } from './types'

export const OBSERVERS = ['chart', 'totals', 'autosave'] as const satisfies readonly ObserverId[]

const INITIAL_VALUE = 41

export function createSubject(): ObserverState {
  return {
    value: INITIAL_VALUE,
    listeners: [...OBSERVERS],
    seen: { chart: INITIAL_VALUE, totals: INITIAL_VALUE, autosave: INITIAL_VALUE },
    phase: 'idle',
    queue: [],
    current: null,
  }
}

/** Subscribing appends to the list and unsubscribing removes from it; a notification already running keeps its copy. */
export function setSubscribed(state: ObserverState, id: ObserverId, subscribed: boolean): ObserverState {
  if (state.listeners.includes(id) === subscribed) return state
  return { ...state, listeners: subscribed ? [...state.listeners, id] : state.listeners.filter((listener) => listener !== id) }
}

/** An observer is stale when the subject changed after it unsubscribed, so no notification will ever reach it. */
export function isStale(state: ObserverState, id: ObserverId): boolean {
  return state.seen[id] !== state.value && !state.listeners.includes(id) && !state.queue.includes(id)
}

/**
 * One step of a synchronous change: the subject stores a new value and copies its list, then calls one observer per
 * step in subscription order, and only returns to the caller once the copy is exhausted.
 */
export function advanceSubject(state: ObserverState): ObserverState {
  if (state.phase === 'idle' || state.phase === 'returned') {
    return { ...state, value: state.value + 1, phase: 'changed', queue: [...state.listeners], current: null }
  }
  const [next, ...queue] = state.queue
  if (next === undefined) return { ...state, phase: 'returned', current: null }
  return { ...state, phase: 'notifying', queue, current: next, seen: { ...state.seen, [next]: state.value } }
}

export const observerModel: SimulationModel<null, ObserverState> = {
  create: createSubject,
  advance: advanceSubject,
}
