import type { SimulationModel } from '../../types'
import type { CapEvent, CapMode, CapParams, CapReplica, CapRequest, CapState } from './types'

export const INITIAL_VALUE = 1
const REPLICA_COUNT = 3
const MAJORITY = Math.floor(REPLICA_COUNT / 2) + 1
/** The partition splits the replicas into a majority side (N1, N2) and a minority side (N3). */
const SIDES = [[0, 1], [2]]

/** Client A talks to N1 and client B to N3, each alternating a write and a read. */
export const REQUEST_CYCLE: CapRequest[] = [
  { client: 0, node: 0, kind: 'write' },
  { client: 1, node: 2, kind: 'read' },
  { client: 1, node: 2, kind: 'write' },
  { client: 0, node: 0, kind: 'read' },
]

/** The lab opens with the link already cut, so the first requests show the CAP decision. */
export function createCap(): CapState {
  return {
    clock: 0,
    partitioned: true,
    cutAt: 0,
    replicas: Array.from({ length: REPLICA_COUNT }, () => ({ value: INITIAL_VALUE, writtenAt: 0 })),
    requests: 0,
    nextValue: INITIAL_VALUE + 1,
    last: null,
    lastByClient: [null, null],
  }
}

/** Replicas that stay together with the given one when the link is cut. */
export function sideOf(node: number): number[] {
  return SIDES.find((side) => side.includes(node)) ?? []
}

/** Replicas the given one can exchange messages with, itself included. */
export function reachable(state: CapState, node: number): number[] {
  return state.partitioned ? sideOf(node) : state.replicas.map((_, index) => index)
}

export function hasQuorum(state: CapState, node: number): boolean {
  return reachable(state, node).length >= MAJORITY
}

function latest(replicas: CapReplica[]): CapReplica {
  return replicas.reduce((winner, replica) => (replica.writtenAt > winner.writtenAt ? replica : winner))
}

function record(state: CapState, client: number, event: CapEvent): CapState {
  return { ...state, last: event, lastByClient: state.lastByClient.map((previous, index) => (index === client ? event : previous)) }
}

/**
 * One client request. A node that cannot reach a majority either refuses it (consistency first) or serves it from
 * local data (availability first): a tentative write the other side never sees, or a read that may be stale.
 */
export function request(state: CapState, { client, node, kind }: CapRequest, mode: CapMode): CapState {
  const clock = state.clock + 1
  const group = reachable(state, node)
  const quorum = hasQuorum(state, node)
  const next = { ...state, clock, requests: state.requests + 1 }

  if (kind === 'write') {
    const value = state.nextValue
    const attempted = { ...next, nextValue: value + 1 }
    if (!quorum && mode === 'consistency') return record(attempted, client, { outcome: 'writeRejected', client, node, value })
    const replicas = state.replicas.map((replica, index) => (group.includes(index) ? { value, writtenAt: clock } : replica))
    const outcome = !state.partitioned ? 'writeReplicated' : quorum ? 'writeCommitted' : 'writeTentative'
    return record({ ...attempted, replicas }, client, { outcome, client, node, value })
  }

  if (!quorum && mode === 'consistency') return record(next, client, { outcome: 'readRejected', client, node })
  const replica = state.replicas[node] ?? latest(state.replicas)
  const outcome = replica.writtenAt < latest(state.replicas).writtenAt ? 'readStale' : 'readFresh'
  return record(next, client, { outcome, client, node, value: replica.value })
}

export function cutLink(state: CapState): CapState {
  if (state.partitioned) return state
  const clock = state.clock + 1
  return { ...state, clock, partitioned: true, cutAt: clock, last: { outcome: 'cut' } }
}

/**
 * Recovery: every replica adopts the latest write (last write wins). If the other side also accepted a write during
 * the partition, that write is discarded, which is the price of having stayed available.
 */
export function healLink(state: CapState): CapState {
  if (!state.partitioned) return state
  const winner = latest(state.replicas)
  const node = state.replicas.indexOf(winner)
  const behind = state.replicas.filter((replica) => replica.value !== winner.value)
  const conflicting = behind.find((replica) => replica.writtenAt > state.cutAt)
  const last: CapEvent = conflicting
    ? { outcome: 'healReconciled', node, value: winner.value, dropped: conflicting.value }
    : { outcome: behind.length > 0 ? 'healCaughtUp' : 'healInSync', node, value: winner.value }
  return { ...state, clock: state.clock + 1, partitioned: false, replicas: state.replicas.map(() => ({ ...winner })), last }
}

export const capModel: SimulationModel<CapParams, CapState> = {
  create: createCap,
  advance: (state, { mode }) => {
    const next = REQUEST_CYCLE[state.requests % REQUEST_CYCLE.length]
    return next ? request(state, next, mode) : state
  },
}
