export type Strategy = 'round-robin' | 'least-connections' | 'random'

export type BalancerParams = {
  servers: number
  /** Requests arriving per tick. */
  rate: number
  strategy: Strategy
}

export type Server = {
  /** Remaining ticks of each request the server is currently handling. */
  active: number[]
  handled: number
}

export type Assignment = {
  id: number
  server: number
}

export type BalancerState = {
  tick: number
  seed: number
  servers: Server[]
  /** Next server in the round-robin rotation. */
  cursor: number
  nextRequestId: number
  /** Requests routed during the last tick. */
  assignments: Assignment[]
}
