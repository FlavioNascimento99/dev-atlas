export type StackHeapParams = {
  /** Whether `main` calls `free(q)`; without it the block is leaked. */
  release: boolean
}

export type FunctionName = 'main' | 'make'

/** A pointer variable: the address of a heap block, or null while it has not been assigned. */
export type Variable = {
  name: string
  value: number | null
}

export type Frame = {
  fn: FunctionName
  variables: Variable[]
}

export type Block = {
  address: number
  /** Null until the program writes through a pointer. */
  value: number | null
  status: 'allocated' | 'freed'
}

/** `stack[0]` is the oldest frame; the last one belongs to the function that is running. */
export type Memory = {
  stack: Frame[]
  heap: Block[]
}

export type Operation =
  | { kind: 'call'; fn: FunctionName; locals: string[] }
  | { kind: 'malloc'; into: string }
  | { kind: 'store'; through: string; value: number }
  | { kind: 'free'; pointer: string }
  /** Pops the running frame; `value` is the local returned and `into` the caller's variable that receives it. */
  | { kind: 'return'; value?: string; into?: string }

export type StackHeapStepId =
  | 'enterMain'
  | 'callMake'
  | 'allocate'
  | 'write'
  | 'returnMake'
  | 'free'
  | 'returnMain'
  | 'returnMainLeak'

export type StackHeapStep = {
  id: StackHeapStepId
  /** Index of the program line that was just executed. */
  line: number
  memory: Memory
}
