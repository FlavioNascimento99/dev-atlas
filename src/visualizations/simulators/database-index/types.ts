/** Leaf nodes hold index entries in `keys`; branch nodes hold separator keys, one fewer than their children. */
export type BTreeNode = {
  id: number
  keys: number[]
  children: BTreeNode[]
}

export type IndexParams = {
  /** Value searched for, as in `WHERE id = key`. */
  key: number
}

export type IndexSearch = {
  /** Nodes read from the root down to the leaf that could hold the key. */
  path: BTreeNode[]
  /** Position of the row in the table, as referenced by the leaf entry; null when the key is not indexed. */
  slot: number | null
}

export type IndexState = {
  /** Reads done so far by each strategy; both do one read per tick until they have nothing left to read. */
  tick: number
  search: IndexSearch
}
