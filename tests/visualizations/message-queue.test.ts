import { describe, expect, it } from 'vitest'
import { advanceQueue, createQueue, QUEUE_CAPACITY, queueTrend } from '@/visualizations/simulators/message-queue/simulation'
import type { QueueParams, QueueState } from '@/visualizations/simulators/message-queue/types'

function runTicks(params: QueueParams, ticks: number): QueueState[] {
  const states = [createQueue(params)]
  for (let i = 0; i < ticks; i++) states.push(advanceQueue(states.at(-1)!, params))
  return states
}

describe('message queue', () => {
  it('grows while production exceeds consumption capacity, then rejects messages', () => {
    const params: QueueParams = { productionRate: 3, consumers: 1, processingTime: 2 }
    const states = runTicks(params, 10)
    const lengths = states.map((state) => state.queue.length)
    const untilFull = lengths.slice(0, lengths.indexOf(QUEUE_CAPACITY) + 1)
    expect(untilFull.length).toBeGreaterThan(2)
    untilFull.slice(1).forEach((length, index) => expect(length).toBeGreaterThan(untilFull[index] ?? 0))
    const final = states.at(-1)!
    expect(final.queue).toHaveLength(QUEUE_CAPACITY)
    expect(final.rejected).toBeGreaterThan(0)
    expect(queueTrend(final, params)).toBe('full')
  })

  it('stays short when consumers keep up', () => {
    const params: QueueParams = { productionRate: 1, consumers: 3, processingTime: 2 }
    const states = runTicks(params, 30)
    expect(Math.max(...states.map((state) => state.queue.length))).toBeLessThanOrEqual(1)
    expect(states.at(-1)!.rejected).toBe(0)
    expect(queueTrend(states.at(-1)!, params)).toBe('draining')
  })

  it('consumes messages in FIFO order', () => {
    const params: QueueParams = { productionRate: 2, consumers: 1, processingTime: 1 }
    const taken = runTicks(params, 4).map((state) => state.consumers[0]?.message)
    expect(taken.slice(1)).toEqual([0, 1, 2, 3])
  })

  it('accounts for every produced message', () => {
    const params: QueueParams = { productionRate: 4, consumers: 2, processingTime: 3 }
    const final = runTicks(params, 25).at(-1)!
    const inFlight = final.consumers.filter((consumer) => consumer.message !== null).length
    expect(final.consumed + final.rejected + final.queue.length + inFlight).toBe(final.nextMessage)
  })
})
