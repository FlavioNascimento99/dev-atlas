export type GcStrategy = 'tracing' | 'counting'

export type GcParams = {
  strategy: GcStrategy
}

/** A local or global variable: the collector starts from these. */
export type Root = {
  name: string
  target: string | null
}

export type HeapObject = {
  id: string
  /** Position in the heap; objects never move, so a freed slot is reused by a later allocation. */
  slot: number
  /** Ids of the objects this one points to. */
  references: string[]
  marked: boolean
}

export type Heap = {
  roots: Root[]
  objects: HeapObject[]
}

/** One object reached during marking, and the root or object whose pointer led to it. */
export type Visit = {
  object: string
  from: string
  fromRoot: boolean
}

export type GcPhase = 'program' | 'mark' | 'sweep'

export type GcStepId =
  | 'dropReference'
  | 'collectStart'
  | 'markFromRoot'
  | 'markFromObject'
  | 'sweep'
  | 'resume'
  | 'countDrop'
  | 'countStuck'

export type GcStep = {
  id: GcStepId
  phase: GcPhase
  heap: Heap
  /** The object marked in this step and where the collector came from. */
  visit?: Visit
  /** Objects whose memory was released in this step. */
  freed?: string[]
  /** Object allocated in this step. */
  allocated?: string
}
