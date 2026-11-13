import type { SimulationModel } from '../../types'
import type { QuorumParams, ReplicationState, TickRange, WorstCaseRead } from './types'

/**
 * Tick at which each replica (A, B, C) stores the write: A receives it from the client, B gets it in the background,
 * and C, which missed the update, only when its hint is replayed.
 */
export const ARRIVAL_TICKS = [1, 2, 4]
/** Replica C missed the forwarded update; from `tick` on, A keeps a hint to deliver to it later. */
export const HINT = { replica: 2, tick: 2 }
export const REPLICA_COUNT = ARRIVAL_TICKS.length
export const LAST_TICK = 5

/** Which replicas already hold the write. */
export function updatedReplicas(tick: number): boolean[] {
  return ARRIVAL_TICKS.map((arrival) => tick >= arrival)
}

/** First tick at which at least `count` replicas hold the write. */
function tickWithCopies(count: number): number {
  return [...ARRIVAL_TICKS].sort((a, b) => a - b)[count - 1] ?? LAST_TICK
}

/** The write is acknowledged to the client once W replicas have stored it. */
export function ackTick(w: number): number {
  return tickWithCopies(w)
}

/** From this tick on, any R replicas include at least one that holds the write. */
export function guaranteedFreshTick(r: number): number {
  return tickWithCopies(REPLICA_COUNT - r + 1)
}

export const CONVERGENCE_TICK = tickWithCopies(REPLICA_COUNT)

/** With W + R > N every read set shares a replica with every write set. */
export function quorumOverlaps({ w, r }: QuorumParams): boolean {
  return w + r > REPLICA_COUNT
}

/** Ticks at which the write is already acknowledged and a read can still return the old value. */
export function inconsistencyWindow({ w, r }: QuorumParams): TickRange | null {
  const from = ackTick(w)
  const end = guaranteedFreshTick(r)
  return end > from ? { from, to: end - 1 } : null
}

/** The read an unlucky client gets: it is routed to the R replicas that are furthest behind. */
export function worstCaseRead(tick: number, r: number): WorstCaseRead {
  const updated = updatedReplicas(tick)
  const replicas = updated
    .map((_, index) => index)
    .sort((a, b) => Number(updated[a]) - Number(updated[b]) || b - a)
    .slice(0, r)
  return { replicas, fresh: replicas.some((index) => updated[index]) }
}

export const replicationModel: SimulationModel<QuorumParams, ReplicationState> = {
  create: () => ({ tick: 0 }),
  advance: (state) => ({ tick: Math.min(state.tick + 1, LAST_TICK) }),
  isFinished: (state) => state.tick >= LAST_TICK,
}
