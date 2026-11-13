import { describe, expect, it } from 'vitest'
import {
  allocate,
  buildCollection,
  createHeap,
  mark,
  reachable,
  referenceCounts,
  releaseUnreferenced,
  setRoot,
  sweep,
  traceFromRoots,
} from '@/visualizations/animations/garbage-collection/script'
import type { GcStep, Heap } from '@/visualizations/animations/garbage-collection/types'

const ids = (heap: Heap) => heap.objects.map((object) => object.id)
const marked = (heap: Heap) => heap.objects.filter((object) => object.marked).map((object) => object.id)
const dropped = () => setRoot(createHeap(), 'y', null)

function stepOf(steps: GcStep[], id: GcStep['id']): GcStep {
  const step = steps.find((candidate) => candidate.id === id)
  if (!step) throw new Error(`step ${id} is missing`)
  return step
}

describe('reachability', () => {
  it('reaches every object while both roots are set, visiting the cycle only once', () => {
    expect(traceFromRoots(createHeap()).map((visit) => visit.object)).toEqual(['A', 'C', 'B', 'D'])
  })

  it('stops reaching the cycle once the only root that led to it is dropped', () => {
    expect([...reachable(dropped())]).toEqual(['A', 'B'])
  })

  it('records the root or object whose pointer led to each object', () => {
    expect(traceFromRoots(dropped())).toEqual([
      { object: 'A', from: 'x', fromRoot: true },
      { object: 'B', from: 'A', fromRoot: false },
    ])
  })
})

describe('mark-sweep cycle', () => {
  const steps = buildCollection({ strategy: 'tracing' })

  it('goes through the program, mark and sweep phases in order', () => {
    expect(steps.map((step) => [step.id, step.phase])).toEqual([
      ['dropReference', 'program'],
      ['collectStart', 'mark'],
      ['markFromRoot', 'mark'],
      ['markFromObject', 'mark'],
      ['sweep', 'sweep'],
      ['resume', 'program'],
    ])
  })

  it('keeps unreachable objects in memory until a collection runs', () => {
    expect(ids(stepOf(steps, 'dropReference').heap)).toEqual(['A', 'B', 'C', 'D'])
    expect(marked(stepOf(steps, 'collectStart').heap)).toEqual([])
  })

  it('marks one reachable object per step, starting from the roots', () => {
    expect(steps.filter((step) => step.visit).map((step) => marked(step.heap))).toEqual([['A'], ['A', 'B']])
  })

  it('has marked exactly the reachable objects when the sweep starts', () => {
    const beforeSweep = steps[steps.findIndex((step) => step.id === 'sweep') - 1]?.heap ?? createHeap()
    expect(marked(beforeSweep)).toEqual([...reachable(beforeSweep)])
  })

  it('sweeps the unmarked cycle and leaves the marked objects in their slots', () => {
    const { heap, freed } = stepOf(steps, 'sweep')
    expect(freed).toEqual(['C', 'D'])
    expect(heap.objects.map((object) => [object.id, object.slot])).toEqual([
      ['A', 0],
      ['B', 1],
    ])
  })

  it('never sweeps a marked object, whatever is marked', () => {
    expect(sweep(mark(createHeap(), 'D'))).toMatchObject({ freed: ['A', 'B', 'C'] })
  })

  it('reuses the reclaimed space for the next allocation and clears the marks', () => {
    const { heap } = stepOf(steps, 'resume')
    expect(heap.objects.find((object) => object.id === 'E')?.slot).toBe(2)
    expect(heap.roots).toContainEqual({ name: 'y', target: 'E' })
    expect(marked(heap)).toEqual([])
  })

  it('cannot allocate while every slot is in use', () => {
    expect(() => allocate(createHeap(), 'E', 'y')).toThrow(/full/)
  })
})

describe('reference counting', () => {
  it('counts pointers from roots and from other objects', () => {
    expect(Object.fromEntries(referenceCounts(createHeap()))).toEqual({ A: 1, B: 1, C: 2, D: 1 })
  })

  it('never frees a cycle: each object keeps the other at a count of one', () => {
    const { heap, freed } = releaseUnreferenced(dropped())
    expect(freed).toEqual([])
    expect(Object.fromEntries(referenceCounts(heap))).toEqual({ A: 1, B: 1, C: 1, D: 1 })
    expect(reachable(heap).has('C')).toBe(false)
    expect(reachable(heap).has('D')).toBe(false)
  })

  it('frees a chain immediately, one count reaching zero after the other', () => {
    const { heap, freed } = releaseUnreferenced(setRoot(createHeap(), 'x', null))
    expect(freed).toEqual(['A', 'B'])
    expect(ids(heap)).toEqual(['C', 'D'])
  })

  it('ends with the unreachable cycle still on the heap, where tracing reclaimed it', () => {
    const counting = buildCollection({ strategy: 'counting' })
    expect(counting.map((step) => step.id)).toEqual(['countDrop', 'countStuck'])
    expect(ids(counting.at(-1)?.heap ?? createHeap())).toEqual(['A', 'B', 'C', 'D'])
    expect(ids(stepOf(buildCollection({ strategy: 'tracing' }), 'sweep').heap)).toEqual(['A', 'B'])
  })
})
