import { describe, expect, it } from 'vitest'
import { buildSchedule, createTimeline, runningAt, timelineModel } from '@/visualizations/animations/concurrency-timeline/schedule'

describe('concurrency timeline', () => {
  it('interleaves tasks on a single core, one task per time unit', () => {
    const schedule = buildSchedule([2, 2], 1)
    expect(schedule.slots).toEqual([[0, 1, 0, 1]])
    expect(schedule.makespan).toBe(4)
  })

  it('runs tasks simultaneously when there are enough cores', () => {
    const schedule = buildSchedule([2, 3], 2)
    expect(schedule.slots).toEqual([
      [0, 0, 1],
      [1, 1, null],
    ])
    expect(runningAt(schedule, 0)).toEqual([0, 1])
  })

  it('executes the same total work on any number of cores', () => {
    const work = [3, 2, 4, 3]
    for (const cores of [1, 2, 4]) {
      const executed = buildSchedule(work, cores).slots.flat().filter((task) => task !== null)
      expect(executed).toHaveLength(12)
    }
  })

  it('finishes sooner with more cores, bounded by the longest task', () => {
    const state = createTimeline({ tasks: 4, cores: 4 })
    expect(state.concurrent.makespan).toBe(12)
    expect(state.parallel.makespan).toBe(4)
  })

  it('stops advancing at the end of the concurrent timeline', () => {
    let state = createTimeline({ tasks: 2, cores: 2 })
    for (let i = 0; i < 20; i++) state = timelineModel.advance(state, { tasks: 2, cores: 2 })
    expect(state.time).toBe(5)
    expect(timelineModel.isFinished?.(state)).toBe(true)
  })
})
