import type { SimulationModel } from '../../types'
import type { Operation, RaceEvent, RaceParams, RaceState, ThreadState } from './types'

export const THREAD_COUNT = 2

export function buildProgram({ mutex, increments }: RaceParams): Operation[] {
  const increment: Operation[] = mutex ? ['acquire', 'read', 'add', 'write', 'release'] : ['read', 'add', 'write']
  return Array.from({ length: increments }, () => increment).flat()
}

export function createRace(params: RaceParams): RaceState {
  return {
    step: 0,
    counter: 0,
    program: buildProgram(params),
    threads: Array.from({ length: THREAD_COUNT }, () => ({ pc: 0, register: null, readValue: null })),
    lockOwner: null,
    turn: 0,
    lostUpdates: 0,
    last: null,
  }
}

export function isRaceFinished(state: RaceState): boolean {
  return state.threads.every((thread) => thread.pc >= state.program.length)
}

/** Executes one operation of the thread whose turn it is (or the other one, if that thread already finished). */
export function advanceRace(state: RaceState): RaceState {
  if (isRaceFinished(state)) return state
  const offered = state.threads[state.turn]
  const id = offered && offered.pc < state.program.length ? state.turn : (state.turn + 1) % THREAD_COUNT
  const thread = state.threads[id]
  const operation = thread && state.program[thread.pc]
  if (!thread || !operation) return state

  const next = { ...state, step: state.step + 1, turn: (id + 1) % THREAD_COUNT }
  const event: RaceEvent = { thread: id, operation, blocked: false, lostUpdate: false }

  if (operation === 'acquire' && state.lockOwner !== null && state.lockOwner !== id) {
    return { ...next, last: { ...event, blocked: true } }
  }

  let updated: ThreadState = { ...thread, pc: thread.pc + 1 }
  switch (operation) {
    case 'acquire':
      next.lockOwner = id
      break
    case 'release':
      next.lockOwner = null
      break
    case 'read':
      updated = { ...updated, register: state.counter, readValue: state.counter }
      break
    case 'add':
      updated = { ...updated, register: (thread.register ?? 0) + 1 }
      break
    case 'write':
      event.lostUpdate = state.counter !== thread.readValue
      next.counter = thread.register ?? 0
      if (event.lostUpdate) next.lostUpdates = state.lostUpdates + 1
      break
  }

  return { ...next, threads: state.threads.map((current, index) => (index === id ? updated : current)), last: event }
}

export const raceModel: SimulationModel<RaceParams, RaceState> = {
  create: createRace,
  advance: advanceRace,
  isFinished: isRaceFinished,
}
