import { DEFAULT_SEED } from '../../constants'
import { nextInt } from '../../random'
import type { SimulationModel } from '../../types'
import type { BTreeNode, IndexParams, IndexSearch, IndexState } from './types'

function chunk<Item>(items: Item[], size: number): Item[][] {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size))
}

function smallestKey(node: BTreeNode): number {
  const first = node.children[0]
  return first ? smallestKey(first) : (node.keys[0] ?? 0)
}

/**
 * Bulk-loads a B-tree from sorted keys: leaves are filled left to right, then each level of branch nodes is built
 * over the one below until a single root remains, so every leaf ends at the same depth.
 */
export function buildTree(sortedKeys: number[], leafSize: number, fanout: number): BTreeNode {
  let id = 0
  let level: BTreeNode[] = chunk(sortedKeys, leafSize).map((keys) => ({ id: id++, keys, children: [] }))
  while (level.length > 1) {
    level = chunk(level, fanout).map((children) => ({ id: id++, keys: children.slice(1).map(smallestKey), children }))
  }
  return level[0] ?? { id, keys: [], children: [] }
}

/** Descends from the root: in each branch node, follows the child after the last separator that is not above the key. */
export function searchTree(root: BTreeNode, key: number): { path: BTreeNode[]; found: boolean } {
  const path = [root]
  let node = root
  while (node.children.length > 0) {
    const child = node.children[node.keys.filter((separator) => separator <= key).length]
    if (!child) break
    path.push(child)
    node = child
  }
  return { path, found: node.keys.includes(key) }
}

/** Fisher–Yates shuffle: rows sit in the table in insertion order, which has nothing to do with the key order. */
export function shuffle(items: number[], seed: number): number[] {
  const shuffled = [...items]
  let current = seed
  for (let index = shuffled.length - 1; index > 0; index--) {
    const random = nextInt(current, 0, index)
    current = random.seed
    const picked = shuffled[random.value] ?? 0
    shuffled[random.value] = shuffled[index] ?? 0
    shuffled[index] = picked
  }
  return shuffled
}

export const KEYS = Array.from({ length: 18 }, (_, index) => index + 1)
export const TREE = buildTree(KEYS, 3, 3)
/** Key of the row stored at each position of the table. */
export const ROWS = shuffle(KEYS, DEFAULT_SEED)

/** Index lookup: tree traversal, then the leaf entry gives the position of the row in the table. */
export function lookup(root: BTreeNode, rows: number[], key: number): IndexSearch {
  const { path, found } = searchTree(root, key)
  return { path, slot: found ? rows.indexOf(key) : null }
}

/** One read per node on the path plus one table access for the row the leaf entry points to. */
export function indexReads(search: IndexSearch): number {
  return search.path.length + (search.slot === null ? 0 : 1)
}

export const indexModel: SimulationModel<IndexParams, IndexState> = {
  create: ({ key }) => ({ tick: 0, search: lookup(TREE, ROWS, key) }),
  // The sequential scan cannot stop at the first match: nothing tells it that no later row matches too.
  advance: (state) => ({ ...state, tick: Math.min(state.tick + 1, ROWS.length) }),
  isFinished: (state) => state.tick >= ROWS.length,
}
