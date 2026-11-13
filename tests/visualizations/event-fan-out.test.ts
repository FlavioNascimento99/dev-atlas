import { describe, expect, it } from 'vitest'
import { buildFanOut, EDA_CONSUMERS } from '@/visualizations/animations/event-fan-out/script'
import type { EdaConsumer, EdaStep } from '@/visualizations/animations/event-fan-out/types'

const healthy = buildFanOut({ consumerDown: false })
const degraded = buildFanOut({ consumerDown: true })

function finishedAt(steps: EdaStep[], consumer: EdaConsumer): number {
  return steps.findIndex((step) => step.consumers[consumer].status === 'done')
}

describe('event fan-out through a broker', () => {
  it('keeps one copy per subscriber once the broker stores the event', () => {
    for (const steps of [healthy, degraded]) expect(steps[1]).toMatchObject({ id: 'stored', retained: [...EDA_CONSUMERS] })
  })

  it('releases the producer as soon as the broker has the event, whatever the consumers do', () => {
    for (const steps of [healthy, degraded]) {
      expect(steps.map((step) => step.accepted)).toEqual(steps.map((_, index) => index > 0))
      expect(steps.flatMap((step) => step.moving).filter((hop) => hop === 'publish')).toHaveLength(1)
    }
  })

  it('delivers to every consumer at once and lets each finish at its own pace', () => {
    expect(healthy[2]).toMatchObject({ id: 'deliver', retained: [], moving: [...EDA_CONSUMERS] })
    const order = EDA_CONSUMERS.map((consumer) => finishedAt(healthy, consumer))
    expect(order).toEqual([...order].sort((a, b) => a - b))
    expect(new Set(order).size).toBe(EDA_CONSUMERS.length)
  })

  it('does not slow the other consumers down when one is offline', () => {
    for (const consumer of ['inventory', 'billing'] as const) {
      expect(finishedAt(degraded, consumer)).toBe(finishedAt(healthy, consumer))
    }
  })

  it('retains the copy of the offline consumer until it recovers, then delivers it', () => {
    const recover = degraded.findIndex((step) => step.id === 'recover')
    for (const step of degraded.slice(1, recover + 1)) expect(step.retained).toContain('notification')
    expect(degraded[recover + 1]).toMatchObject({ id: 'deliverRetained', retained: [], moving: ['notification'] })
    expect(recover).toBeGreaterThan(finishedAt(degraded, 'billing'))
    expect(degraded.at(-1)?.id).toBe('notificationDone')
  })

  it('delivers each copy exactly once and ends with every consumer done', () => {
    for (const steps of [healthy, degraded]) {
      const delivered = steps.flatMap((step) => step.moving).filter((hop) => hop !== 'publish')
      expect([...delivered].sort()).toEqual([...EDA_CONSUMERS].sort())
      expect(EDA_CONSUMERS.every((consumer) => steps.at(-1)?.consumers[consumer].status === 'done')).toBe(true)
    }
  })

  it('never hands the event to a consumer that is offline', () => {
    for (const step of degraded) {
      if (step.consumers.notification.status === 'offline') expect(step.moving).not.toContain('notification')
    }
  })
})
