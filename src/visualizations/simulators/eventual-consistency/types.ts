export type QuorumParams = {
  /** Replicas that must store a write before it is acknowledged. */
  w: number
  /** Replicas a read asks; it keeps the newest version among the answers. */
  r: number
}

export type ReplicationState = {
  /** Time since the lab started; the write is sent at tick 1. */
  tick: number
}

export type WorstCaseRead = {
  /** The R replicas an unlucky reader is routed to: the ones that are furthest behind. */
  replicas: number[]
  /** At least one of them already holds the write, so the read returns the new value. */
  fresh: boolean
}

/** Inclusive range of ticks. */
export type TickRange = {
  from: number
  to: number
}
