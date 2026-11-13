export type TimelineParams = {
  tasks: number
  /** Cores available to the parallel timeline; the concurrent one always has a single core. */
  cores: number
}

/** `slots[core][time]` holds the index of the task running there, or null when the core is idle. */
export type Schedule = {
  slots: (number | null)[][]
  makespan: number
}

export type TimelineState = {
  /** Number of time units already executed. */
  time: number
  work: number[]
  concurrent: Schedule
  parallel: Schedule
}
