import type { SimulationModel } from '../../types'
import type { Schedule, TimelineParams, TimelineState } from './types'

/** Units of work of each task, so tasks finish at different moments. */
const TASK_WORK = [3, 2, 4, 3, 2, 3]

/** Round-robin with a one-unit time slice: each core runs the next ready task, which then rejoins the queue. */
export function buildSchedule(work: number[], cores: number): Schedule {
  const remaining = [...work]
  const slots: (number | null)[][] = Array.from({ length: cores }, () => [])
  let ready = work.map((_, task) => task).filter((task) => (remaining[task] ?? 0) > 0)
  let time = 0

  while (ready.length > 0) {
    const running = ready.slice(0, cores)
    slots.forEach((row, core) => row.push(running[core] ?? null))
    for (const task of running) remaining[task] = (remaining[task] ?? 0) - 1
    ready = [...ready.slice(cores), ...running.filter((task) => (remaining[task] ?? 0) > 0)]
    time += 1
  }

  return { slots, makespan: time }
}

export function createTimeline({ tasks, cores }: TimelineParams): TimelineState {
  const work = TASK_WORK.slice(0, tasks)
  return { time: 0, work, concurrent: buildSchedule(work, 1), parallel: buildSchedule(work, cores) }
}

/** Tasks running at a given time unit across every core of a schedule. */
export function runningAt(schedule: Schedule, time: number): number[] {
  return schedule.slots.flatMap((row) => {
    const task = row[time]
    return task === null || task === undefined ? [] : [task]
  })
}

export const timelineModel: SimulationModel<TimelineParams, TimelineState> = {
  create: createTimeline,
  advance: (state) => (state.time >= state.concurrent.makespan ? state : { ...state, time: state.time + 1 }),
  isFinished: (state) => state.time >= state.concurrent.makespan,
}
