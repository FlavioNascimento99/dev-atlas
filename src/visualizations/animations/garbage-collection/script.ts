import { scriptedModel } from '../../scripted'
import type { GcParams, GcStep, Heap, HeapObject, Visit } from './types'

export const HEAP_SLOTS = 4

/** The heap of the article: x → A → B, and C ↔ D, which the root y still reaches through C. */
export function createHeap(): Heap {
  return {
    roots: [
      { name: 'x', target: 'A' },
      { name: 'y', target: 'C' },
    ],
    objects: [
      { id: 'A', slot: 0, references: ['B'], marked: false },
      { id: 'B', slot: 1, references: [], marked: false },
      { id: 'C', slot: 2, references: ['D'], marked: false },
      { id: 'D', slot: 3, references: ['C'], marked: false },
    ],
  }
}

export function setRoot(heap: Heap, name: string, target: string | null): Heap {
  return { ...heap, roots: heap.roots.map((root) => (root.name === name ? { ...root, target } : root)) }
}

function mapObjects(heap: Heap, change: (object: HeapObject) => HeapObject): Heap {
  return { ...heap, objects: heap.objects.map(change) }
}

/**
 * Tracing: follows pointers transitively from the roots and lists every object reached, once, in the order a
 * breadth-first collector marks it. An object already visited is not visited again, so cycles terminate.
 */
export function traceFromRoots(heap: Heap): Visit[] {
  const byId = new Map(heap.objects.map((object) => [object.id, object]))
  const visits: Visit[] = []
  const seen = new Set<string>()
  const pending: Visit[] = heap.roots.flatMap((root) =>
    root.target === null ? [] : [{ object: root.target, from: root.name, fromRoot: true }],
  )
  for (let next = pending.shift(); next; next = pending.shift()) {
    const object = byId.get(next.object)
    if (!object || seen.has(object.id)) continue
    seen.add(object.id)
    visits.push(next)
    pending.push(...object.references.map((reference) => ({ object: reference, from: object.id, fromRoot: false })))
  }
  return visits
}

export function reachable(heap: Heap): Set<string> {
  return new Set(traceFromRoots(heap).map((visit) => visit.object))
}

export function mark(heap: Heap, id: string): Heap {
  return mapObjects(heap, (object) => (object.id === id ? { ...object, marked: true } : object))
}

/** Walks the whole heap and releases every object that was not marked; the marked ones stay where they are. */
export function sweep(heap: Heap): { heap: Heap; freed: string[] } {
  const freed = heap.objects.filter((object) => !object.marked).map((object) => object.id)
  return { heap: { ...heap, objects: heap.objects.filter((object) => object.marked) }, freed }
}

export function clearMarks(heap: Heap): Heap {
  return mapObjects(heap, (object) => ({ ...object, marked: false }))
}

/** Allocates a new object in the first free slot and stores its address in a root. */
export function allocate(heap: Heap, id: string, root: string): Heap {
  const used = new Set(heap.objects.map((object) => object.slot))
  const slot = Array.from({ length: HEAP_SLOTS }, (_, index) => index).find((index) => !used.has(index))
  if (slot === undefined) throw new Error('the heap is full')
  return setRoot({ ...heap, objects: [...heap.objects, { id, slot, references: [], marked: false }] }, root, id)
}

/** Reference counting: the number of pointers to each object, from roots and from any other object, live or not. */
export function referenceCounts(heap: Heap): Map<string, number> {
  const counts = new Map(heap.objects.map((object) => [object.id, 0]))
  const pointers = [...heap.roots.map((root) => root.target), ...heap.objects.flatMap((object) => object.references)]
  for (const target of pointers) {
    const count = target === null ? undefined : counts.get(target)
    if (target !== null && count !== undefined) counts.set(target, count + 1)
  }
  return counts
}

/**
 * Reference counting: frees every object whose count is zero, which removes its pointers and may bring other
 * counts to zero in turn. Objects in a cycle keep each other's count above zero and are never freed.
 */
export function releaseUnreferenced(heap: Heap): { heap: Heap; freed: string[] } {
  const freed: string[] = []
  let current = heap
  for (;;) {
    const counts = referenceCounts(current)
    const dead = current.objects.filter((object) => counts.get(object.id) === 0).map((object) => object.id)
    if (dead.length === 0) return { heap: current, freed }
    freed.push(...dead)
    current = { ...current, objects: current.objects.filter((object) => !dead.includes(object.id)) }
  }
}

/** The program drops its only reference to C; then one mark-sweep cycle runs, or the counts are updated. */
export function buildCollection({ strategy }: GcParams): GcStep[] {
  const dropped = setRoot(createHeap(), 'y', null)

  if (strategy === 'counting') {
    const released = releaseUnreferenced(dropped)
    return [
      { id: 'countDrop', phase: 'program', heap: dropped },
      { id: 'countStuck', phase: 'program', heap: released.heap, freed: released.freed },
    ]
  }

  const steps: GcStep[] = [
    { id: 'dropReference', phase: 'program', heap: dropped },
    { id: 'collectStart', phase: 'mark', heap: dropped },
  ]
  let heap = dropped
  for (const visit of traceFromRoots(dropped)) {
    heap = mark(heap, visit.object)
    steps.push({ id: visit.fromRoot ? 'markFromRoot' : 'markFromObject', phase: 'mark', heap, visit })
  }
  const swept = sweep(heap)
  steps.push({ id: 'sweep', phase: 'sweep', heap: swept.heap, freed: swept.freed })
  steps.push({ id: 'resume', phase: 'program', heap: allocate(clearMarks(swept.heap), 'E', 'y'), allocated: 'E' })
  return steps
}

export const gcModel = scriptedModel(buildCollection)
