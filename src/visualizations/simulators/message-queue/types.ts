export type QueueParams = {
  /** Messages published per tick. */
  productionRate: number
  consumers: number
  /** Ticks a consumer needs to process one message. */
  processingTime: number
}

export type Consumer = {
  message: number | null
  remaining: number
}

export type QueueTrend = 'growing' | 'full' | 'balanced' | 'draining'

export type QueueState = {
  tick: number
  /** Message ids waiting, oldest first. */
  queue: number[]
  consumers: Consumer[]
  nextMessage: number
  consumed: number
  rejected: number
  /** Queue length after each tick, most recent last. */
  history: number[]
}
