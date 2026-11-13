import { describe, expect, it } from 'vitest'
import {
  buildTree,
  indexModel,
  indexReads,
  KEYS,
  lookup,
  ROWS,
  searchTree,
  shuffle,
  TREE,
} from '@/visualizations/simulators/database-index/simulation'
import type { BTreeNode } from '@/visualizations/simulators/database-index/types'

function leafDepths(node: BTreeNode, depth = 1): number[] {
  return node.children.length === 0 ? [depth] : node.children.flatMap((child) => leafDepths(child, depth + 1))
}

function leafKeys(node: BTreeNode): number[] {
  return node.children.length === 0 ? node.keys : node.children.flatMap(leafKeys)
}

describe('B-tree index lookup versus sequential scan', () => {
  it('builds a balanced tree: every leaf is at the same depth', () => {
    expect(new Set(leafDepths(TREE))).toEqual(new Set([3]))
    const large = buildTree(Array.from({ length: 1000 }, (_, index) => index * 2), 4, 5)
    expect(new Set(leafDepths(large)).size).toBe(1)
  })

  it('keeps the entries sorted along the leaf nodes', () => {
    expect(leafKeys(TREE)).toEqual(KEYS)
  })

  it('gives every branch node one separator key fewer than its children', () => {
    const check = (node: BTreeNode) => {
      if (node.children.length === 0) return
      expect(node.keys).toHaveLength(node.children.length - 1)
      node.children.forEach(check)
    }
    check(TREE)
  })

  it('finds every key by reading exactly one node per level, each a child of the previous one', () => {
    for (const key of KEYS) {
      const { path, found } = searchTree(TREE, key)
      expect(found).toBe(true)
      expect(path).toHaveLength(3)
      expect(path[0]).toBe(TREE)
      path.slice(1).forEach((node, index) => expect(path[index]?.children).toContain(node))
      expect(path.at(-1)?.keys).toContain(key)
    }
  })

  it('reaches a leaf and reports a miss for a key that is not indexed', () => {
    const search = lookup(TREE, ROWS, 99)
    expect(search.path).toHaveLength(3)
    expect(search.slot).toBeNull()
    expect(indexReads(search)).toBe(3)
  })

  it('points from the leaf entry to the position of the row in the table', () => {
    for (const key of KEYS) expect(ROWS[lookup(TREE, ROWS, key).slot ?? -1]).toBe(key)
  })

  it('stores the rows in an order unrelated to the key, without losing any', () => {
    expect(ROWS).not.toEqual(KEYS)
    expect([...ROWS].sort((a, b) => a - b)).toEqual(KEYS)
    expect(shuffle(KEYS, 1)).toEqual(shuffle(KEYS, 1))
  })

  it('needs depth + 1 reads through the index and every row in a sequential scan', () => {
    const params = { key: 7 }
    let state = indexModel.create(params)
    expect(indexReads(state.search)).toBe(4)
    let ticks = 0
    while (!indexModel.isFinished?.(state)) {
      state = indexModel.advance(state, params)
      ticks++
    }
    expect(ticks).toBe(ROWS.length)
    expect(indexModel.advance(state, params).tick).toBe(ROWS.length)
  })

  it('grows logarithmically: 100 times more keys add only a few levels', () => {
    const depth = (count: number) => leafDepths(buildTree(Array.from({ length: count }, (_, index) => index), 3, 3))[0]
    expect(depth(18)).toBe(3)
    expect(depth(1800)).toBe(7)
  })
})
