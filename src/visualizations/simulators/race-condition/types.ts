export type Operation = 'acquire' | 'read' | 'add' | 'write' | 'release'

export type RaceParams = {
  mutex: boolean
  /** Increments each of the two threads performs on the shared counter. */
  increments: number
}

export type ThreadState = {
  /** Index of the next operation in the program. */
  pc: number
  register: number | null
  /** Counter value this thread last read, to detect writes that overwrite unseen updates. */
  readValue: number | null
}

export type RaceEvent = {
  thread: number
  operation: Operation
  /** The thread could not take the mutex and waited instead of executing. */
  blocked: boolean
  /** A write that overwrote an update the thread never saw. */
  lostUpdate: boolean
}

export type RaceState = {
  step: number
  counter: number
  program: Operation[]
  threads: ThreadState[]
  lockOwner: number | null
  /** Thread the scheduler offers the next step to; threads alternate on every step. */
  turn: number
  lostUpdates: number
  last: RaceEvent | null
}
