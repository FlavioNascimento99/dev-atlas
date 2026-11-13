/** What a node does when it cannot reach a majority: refuse (consistency) or answer with local data (availability). */
export type CapMode = 'consistency' | 'availability'

export type CapParams = {
  mode: CapMode
}

export type CapReplica = {
  value: number
  /** Logical time of the write that produced the value; the latest one wins when replicas merge. */
  writtenAt: number
}

export type CapRequest = {
  /** Index of the client that sends it. */
  client: number
  /** Index of the replica that receives it. */
  node: number
  kind: 'write' | 'read'
}

export type CapOutcome =
  | 'cut'
  /** Healthy network: the write reached every replica. */
  | 'writeReplicated'
  /** Partitioned: the write reached a majority. */
  | 'writeCommitted'
  /** Partitioned, availability first: the minority side kept the write locally. */
  | 'writeTentative'
  | 'writeRejected'
  | 'readFresh'
  | 'readStale'
  | 'readRejected'
  /** The link returned and no replica had missed anything. */
  | 'healInSync'
  /** The link returned and the lagging side copied the newer value; nothing was lost. */
  | 'healCaughtUp'
  /** The link returned with a write on each side: the latest was kept and the other one dropped. */
  | 'healReconciled'

export type CapEvent = {
  outcome: CapOutcome
  client?: number
  /** Replica that served the request, or the one whose value won when the partition healed. */
  node?: number
  value?: number
  /** Value of the write discarded by the reconciliation. */
  dropped?: number
}

export type CapState = {
  /** Logical clock: one tick per request or link change. */
  clock: number
  partitioned: boolean
  /** Clock value when the link was last cut. */
  cutAt: number
  replicas: CapReplica[]
  /** Requests sent so far; selects the next one in the cycle. */
  requests: number
  nextValue: number
  last: CapEvent | null
  /** Result of the latest request of each client. */
  lastByClient: (CapEvent | null)[]
}
