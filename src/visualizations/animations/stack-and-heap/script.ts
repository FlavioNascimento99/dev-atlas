import { scriptedModel } from '../../scripted'
import type { Block, Frame, Memory, Operation, StackHeapParams, StackHeapStep, StackHeapStepId, Variable } from './types'

const HEAP_BASE = 0x5000
const BLOCK_SIZE = 0x10

export const EMPTY_MEMORY: Memory = { stack: [], heap: [] }

function runningFrame(memory: Memory): Frame {
  const frame = memory.stack.at(-1)
  if (!frame) throw new Error('no function is running')
  return frame
}

function read(frame: Frame, name: string): number | null {
  const variable = frame.variables.find((candidate) => candidate.name === name)
  if (!variable) throw new Error(`${name} is not a local of ${frame.fn}`)
  return variable.value
}

function assign(frame: Frame, name: string, value: number | null): Frame {
  read(frame, name)
  return { ...frame, variables: frame.variables.map((variable) => (variable.name === name ? { ...variable, value } : variable)) }
}

/** Replaces the running frame, the only one a function can write its locals to. */
function withRunningFrame(memory: Memory, frame: Frame): Memory {
  return { ...memory, stack: [...memory.stack.slice(0, -1), frame] }
}

/** Follows a pointer of the running frame; only a block that is still allocated may be used. */
function dereference(memory: Memory, pointer: string): Block {
  const address = read(runningFrame(memory), pointer)
  const block = memory.heap.find((candidate) => candidate.address === address)
  if (!block) throw new Error(`${pointer} does not point to a heap block`)
  if (block.status === 'freed') throw new Error(`${pointer} points to a block that was already freed`)
  return block
}

function updateBlock(memory: Memory, address: number, change: Partial<Block>): Memory {
  return { ...memory, heap: memory.heap.map((block) => (block.address === address ? { ...block, ...change } : block)) }
}

/** Runs one operation: calls push a frame, returns pop it, and only `free` releases a heap block. */
export function execute(memory: Memory, operation: Operation): Memory {
  switch (operation.kind) {
    case 'call': {
      const variables = operation.locals.map((name): Variable => ({ name, value: null }))
      return { ...memory, stack: [...memory.stack, { fn: operation.fn, variables }] }
    }
    case 'malloc': {
      const address = HEAP_BASE + memory.heap.length * BLOCK_SIZE
      const frame = assign(runningFrame(memory), operation.into, address)
      return { ...withRunningFrame(memory, frame), heap: [...memory.heap, { address, value: null, status: 'allocated' }] }
    }
    case 'store':
      return updateBlock(memory, dereference(memory, operation.through).address, { value: operation.value })
    case 'free':
      return updateBlock(memory, dereference(memory, operation.pointer).address, { status: 'freed' })
    case 'return': {
      const returned = operation.value === undefined ? null : read(runningFrame(memory), operation.value)
      const popped = { ...memory, stack: memory.stack.slice(0, -1) }
      if (operation.into === undefined) return popped
      return withRunningFrame(popped, assign(runningFrame(popped), operation.into, returned))
    }
  }
}

/** Allocated blocks whose address is held by no variable on the stack: nothing can free them anymore. */
export function leakedBlocks(memory: Memory): Block[] {
  const held = new Set(memory.stack.flatMap((frame) => frame.variables.map((variable) => variable.value)))
  return memory.heap.filter((block) => block.status === 'allocated' && !held.has(block.address))
}

/** A pointer that still holds the address of a block that was freed. */
export function isDangling(memory: Memory, variable: Variable): boolean {
  return memory.heap.some((block) => block.address === variable.value && block.status === 'freed')
}

const FREE_LINE = 8

/** The C program of the article; without `release` the call to `free` is commented out. */
export function programLines({ release }: StackHeapParams): string[] {
  return [
    'int *make(void) {',
    '    int *p = malloc(sizeof(int));',
    '    *p = 42;',
    '    return p;',
    '}',
    '',
    'int main(void) {',
    '    int *q = make();',
    release ? '    free(q);' : '    // free(q);',
    '    return 0;',
    '}',
  ]
}

type Statement = { id: StackHeapStepId; line: number; operation: Operation }

/** Executes the program statement by statement and records the memory after each one. */
export function buildRun({ release }: StackHeapParams): StackHeapStep[] {
  const statements: Statement[] = [
    { id: 'enterMain', line: 6, operation: { kind: 'call', fn: 'main', locals: ['q'] } },
    { id: 'callMake', line: 7, operation: { kind: 'call', fn: 'make', locals: ['p'] } },
    { id: 'allocate', line: 1, operation: { kind: 'malloc', into: 'p' } },
    { id: 'write', line: 2, operation: { kind: 'store', through: 'p', value: 42 } },
    { id: 'returnMake', line: 3, operation: { kind: 'return', value: 'p', into: 'q' } },
    ...(release ? [{ id: 'free', line: FREE_LINE, operation: { kind: 'free', pointer: 'q' } } satisfies Statement] : []),
    { id: 'returnMain', line: 9, operation: { kind: 'return' } },
  ]
  let memory = EMPTY_MEMORY
  return statements.map(({ id, line, operation }) => {
    memory = execute(memory, operation)
    const leaked = id === 'returnMain' && leakedBlocks(memory).length > 0
    return { id: leaked ? 'returnMainLeak' : id, line, memory }
  })
}

export const stackHeapModel = scriptedModel(buildRun)
