import { describe, expect, it } from 'vitest'
import { EMPTY_MEMORY, buildRun, execute, isDangling, leakedBlocks, programLines } from '@/visualizations/animations/stack-and-heap/script'
import type { Memory, Operation, StackHeapStep } from '@/visualizations/animations/stack-and-heap/types'

function run(operations: Operation[]): Memory {
  return operations.reduce(execute, EMPTY_MEMORY)
}

function stepOf(steps: StackHeapStep[], id: StackHeapStep['id']): StackHeapStep {
  const step = steps.find((candidate) => candidate.id === id)
  if (!step) throw new Error(`step ${id} is missing`)
  return step
}

const frames = (step: StackHeapStep) => step.memory.stack.map((frame) => frame.fn)

describe('stack and heap model', () => {
  it('pushes a frame on every call and pops it on every return, last in, first out', () => {
    const steps = buildRun({ release: true })
    expect(steps.map(frames)).toEqual([['main'], ['main', 'make'], ['main', 'make'], ['main', 'make'], ['main'], ['main'], []])
  })

  it('stores the address returned by malloc in a local of the running frame', () => {
    const { memory } = stepOf(buildRun({ release: true }), 'allocate')
    const [block] = memory.heap
    expect(block).toMatchObject({ value: null, status: 'allocated' })
    expect(memory.stack.at(-1)).toEqual({ fn: 'make', variables: [{ name: 'p', value: block?.address }] })
    expect(memory.stack[0]?.variables).toEqual([{ name: 'q', value: null }])
  })

  it('writes through the pointer into the heap block, not into the frame', () => {
    const before = stepOf(buildRun({ release: true }), 'allocate').memory
    const after = stepOf(buildRun({ release: true }), 'write').memory
    expect(after.heap[0]?.value).toBe(42)
    expect(after.stack).toEqual(before.stack)
  })

  it('keeps the heap block alive after the frame that allocated it is gone', () => {
    const { memory } = stepOf(buildRun({ release: true }), 'returnMake')
    const [block] = memory.heap
    expect(block).toMatchObject({ value: 42, status: 'allocated' })
    expect(memory.stack).toEqual([{ fn: 'main', variables: [{ name: 'q', value: block?.address }] }])
    expect(leakedBlocks(memory)).toEqual([])
  })

  it('leaves a dangling pointer after free and nothing leaked at the end', () => {
    const steps = buildRun({ release: true })
    const freed = stepOf(steps, 'free').memory
    expect(freed.heap[0]?.status).toBe('freed')
    expect(freed.stack[0]?.variables.map((variable) => isDangling(freed, variable))).toEqual([true])
    expect(steps.at(-1)?.id).toBe('returnMain')
    expect(leakedBlocks(steps.at(-1)?.memory ?? EMPTY_MEMORY)).toEqual([])
  })

  it('leaks the block when main returns without calling free', () => {
    const steps = buildRun({ release: false })
    expect(steps.map((step) => step.id)).not.toContain('free')
    const last = steps.at(-1)
    expect(last?.id).toBe('returnMainLeak')
    expect(last?.memory.stack).toEqual([])
    expect(last?.memory.heap[0]?.status).toBe('allocated')
    expect(leakedBlocks(last?.memory ?? EMPTY_MEMORY)).toEqual(last?.memory.heap)
  })

  it('rejects a use after free and a double free', () => {
    const freed = run([
      { kind: 'call', fn: 'main', locals: ['q'] },
      { kind: 'malloc', into: 'q' },
      { kind: 'free', pointer: 'q' },
    ])
    expect(() => execute(freed, { kind: 'store', through: 'q', value: 1 })).toThrow(/already freed/)
    expect(() => execute(freed, { kind: 'free', pointer: 'q' })).toThrow(/already freed/)
  })

  it('rejects writing through an unassigned pointer and touching a local of another frame', () => {
    const called = run([
      { kind: 'call', fn: 'main', locals: ['q'] },
      { kind: 'call', fn: 'make', locals: ['p'] },
    ])
    expect(() => execute(called, { kind: 'store', through: 'p', value: 1 })).toThrow(/does not point/)
    expect(() => execute(called, { kind: 'malloc', into: 'q' })).toThrow(/not a local of make/)
  })

  it('points every step at the statement it executed', () => {
    for (const release of [true, false]) {
      const lines = programLines({ release })
      const executed = buildRun({ release }).map((step) => [step.id, lines[step.line]?.trim()])
      expect(executed).toEqual([
        ['enterMain', 'int main(void) {'],
        ['callMake', 'int *q = make();'],
        ['allocate', 'int *p = malloc(sizeof(int));'],
        ['write', '*p = 42;'],
        ['returnMake', 'return p;'],
        ...(release ? [['free', 'free(q);']] : []),
        [release ? 'returnMain' : 'returnMainLeak', 'return 0;'],
      ])
    }
  })
})
