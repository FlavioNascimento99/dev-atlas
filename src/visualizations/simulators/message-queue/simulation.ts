import type { SimulationModel } from '../../types'
import type { QueueParams, QueueState, QueueTrend } from './types'

/** Bounded queue: once full, new messages are rejected and producers feel the backpressure. */
export const QUEUE_CAPACITY = 12
export const HISTORY_LENGTH = 24

export function createQueue({ consumers }: QueueParams): QueueState {
  return {
    tick: 0,
    queue: [],
    consumers: Array.from({ length: consumers }, () => ({ message: null, remaining: 0 })),
    nextMessage: 0,
    consumed: 0,
    rejected: 0,
    history: [0],
  }
}

/** Messages the consumers can finish per tick on average. */
export function consumptionCapacity({ consumers, processingTime }: QueueParams): number {
  return consumers / processingTime
}

export function queueTrend(state: QueueState, params: QueueParams): QueueTrend {
  if (state.queue.length >= QUEUE_CAPACITY) return 'full'
  const capacity = consumptionCapacity(params)
  if (params.productionRate > capacity) return 'growing'
  return params.productionRate === capacity ? 'balanced' : 'draining'
}

/** One tick: consumers progress, producers publish, then idle consumers take the oldest messages (FIFO). */
export function advanceQueue(state: QueueState, params: QueueParams): QueueState {
  let consumed = state.consumed
  const consumers = state.consumers.map((consumer) => {
    if (consumer.message === null) return consumer
    if (consumer.remaining > 1) return { ...consumer, remaining: consumer.remaining - 1 }
    consumed += 1
    return { message: null, remaining: 0 }
  })

  const queue = [...state.queue]
  let { nextMessage, rejected } = state
  for (let i = 0; i < params.productionRate; i++) {
    if (queue.length < QUEUE_CAPACITY) queue.push(nextMessage)
    else rejected += 1
    nextMessage += 1
  }

  const working = consumers.map((consumer) => {
    if (consumer.message !== null) return consumer
    const message = queue.shift()
    return message === undefined ? consumer : { message, remaining: params.processingTime }
  })

  return {
    tick: state.tick + 1,
    queue,
    consumers: working,
    nextMessage,
    consumed,
    rejected,
    history: [...state.history, queue.length].slice(-HISTORY_LENGTH),
  }
}

export const queueModel: SimulationModel<QueueParams, QueueState> = {
  create: createQueue,
  advance: advanceQueue,
}
