'use client'

import { motion } from 'motion/react'
import { format } from '@/lib/i18n/dictionary'
import type { Locale } from '@/lib/i18n/types'
import { useLocale } from '@/lib/i18n/use-locale'
import { cn } from '@/lib/utils'
import { LabLegend } from '../../primitives/lab-legend'
import { LabSvg } from '../../primitives/lab-svg'
import { RangeParameter } from '../../primitives/range-parameter'
import { useSimulation } from '../../use-simulation'
import { VisualLab } from '../../visual-lab'
import { indexModel, indexReads, KEYS, ROWS, TREE } from './simulation'
import { texts } from './texts'
import type { BTreeNode, IndexState } from './types'

const WIDTH = 360
const NODE_HEIGHT = 22
const TREE_TOP = 20
const LEVEL_GAP = 40
const LEAF_CELL = 19
const BRANCH_KEY = 22
const TABLE = { titleY: 146, y: 153, height: 24, pitch: WIDTH / ROWS.length, cell: WIDTH / ROWS.length - 2 }
const CURSOR_Y = TABLE.y + TABLE.height + 3
const COUNTER = { top: 194, height: 22, pitch: 26 }
const HEIGHT = COUNTER.top + COUNTER.pitch + COUNTER.height + 2

type PlacedNode = {
  node: BTreeNode
  /** Horizontal center. */
  x: number
  y: number
  width: number
  children: PlacedNode[]
}

/** Leaves are spread over the full width in key order and every branch node is centered over its children. */
function layoutTree(root: BTreeNode): PlacedNode[] {
  const leafCount = countLeaves(root)
  const placed: PlacedNode[] = []
  let leaves = 0
  const place = (node: BTreeNode, depth: number): PlacedNode => {
    const children = node.children.map((child) => place(child, depth + 1))
    const first = children[0]
    const last = children.at(-1)
    const item: PlacedNode = {
      node,
      x: first && last ? (first.x + last.x) / 2 : (leaves++ + 0.5) * (WIDTH / leafCount),
      y: TREE_TOP + depth * LEVEL_GAP,
      width: first ? node.keys.length * BRANCH_KEY + 14 : node.keys.length * LEAF_CELL,
      children,
    }
    placed.push(item)
    return item
  }
  place(root, 0)
  return placed
}

function countLeaves(node: BTreeNode): number {
  return node.children.length === 0 ? 1 : node.children.reduce((count, child) => count + countLeaves(child), 0)
}

const NODES = layoutTree(TREE)
const LEAVES = NODES.filter((placed) => placed.children.length === 0)
/** Leaf nodes are chained in a list; the line shows through the gaps between them. */
const LEAF_CHAIN_Y = (LEAVES[0]?.y ?? 0) + NODE_HEIGHT / 2
const tableX = (slot: number) => slot * TABLE.pitch + 1

function describe(state: IndexState, key: number, t: (typeof texts)[Locale], finished: boolean) {
  const { tick, search } = state
  if (tick === 0) return [t.start]
  const reads = indexReads(search)
  const row = ROWS[tick - 1] ?? 0
  const scan = format(row === key ? t.scanMatch : t.scanRow, { n: tick, total: ROWS.length, id: row })
  if (finished) return [scan, format(t.finished, { total: ROWS.length, reads })]

  const node = search.path[tick - 1]
  let index = format(t.indexDone, { reads })
  if (node && tick < search.path.length) {
    index = format(tick === 1 ? t.indexRoot : t.indexBranch, { key, keys: node.keys.join(', ') })
  } else if (node) {
    index = format(search.slot === null ? t.indexLeafMiss : t.indexLeaf, { key })
  } else if (search.slot !== null && tick === reads) {
    index = format(t.indexFetch, { slot: search.slot + 1, reads })
  }
  return [index, scan]
}

/** Type C lab: one equality lookup answered by a real B-tree descent and by a sequential scan, read by read. */
export function DatabaseIndexVisualizer() {
  const t = texts[useLocale()]
  const { params, state, setParams, playback } = useSimulation(indexModel, { key: 14 })
  const { tick, search } = state
  const nodesRead = Math.min(tick, search.path.length)
  const visited = new Set(search.path.slice(0, nodesRead).map((node) => node.id))
  const currentNode = tick <= search.path.length ? search.path[tick - 1] : undefined
  const leafRead = search.slot !== null && nodesRead === search.path.length
  const fetched = search.slot !== null && tick > search.path.length
  const leaf = NODES.find((placed) => placed.node.id === search.path.at(-1)?.id)
  const entryX = leaf ? leaf.x - leaf.width / 2 + (leaf.node.keys.indexOf(params.key) + 0.5) * LEAF_CELL : 0

  return (
    <VisualLab
      title={t.title}
      description={t.description}
      fidelity="conceptual"
      playback={playback}
      explanation={describe(state, params.key, t, playback.finished).map((sentence) => (
        <p key={sentence}>{sentence}</p>
      ))}
      parameters={
        <RangeParameter
          label={t.keyParam}
          value={params.key}
          min={KEYS[0] ?? 1}
          max={KEYS.at(-1) ?? 1}
          onChange={(key) => setParams({ key })}
        />
      }
    >
      <LabSvg width={WIDTH} height={HEIGHT} title={t.svgTitle} description={t.svgDescription}>
        <text x={1} y={12} className="fill-muted-foreground font-semibold">
          {t.treeTitle}
        </text>
        <text x={WIDTH - 1} y={12} textAnchor="end" className="fill-foreground font-mono font-semibold">
          {format(t.query, { key: params.key })}
        </text>

        <line
          x1={LEAVES[0]?.x}
          x2={LEAVES.at(-1)?.x}
          y1={LEAF_CHAIN_Y}
          y2={LEAF_CHAIN_Y}
          className="stroke-muted-foreground"
        />
        {NODES.flatMap((parent) =>
          parent.children.map((child) => {
            const onPath = visited.has(parent.node.id) && visited.has(child.node.id)
            return (
              <line
                key={child.node.id}
                x1={parent.x}
                y1={parent.y + NODE_HEIGHT}
                x2={child.x}
                y2={child.y}
                strokeWidth={onPath ? 2 : 1}
                className={onPath ? 'stroke-brand' : 'stroke-border'}
              />
            )
          }),
        )}

        {NODES.map(({ node, x, y, width }) => {
          const read = visited.has(node.id)
          const isLeaf = node.children.length === 0
          return (
            <g key={node.id}>
              <rect
                x={x - width / 2}
                y={y}
                width={width}
                height={NODE_HEIGHT}
                rx={4}
                strokeWidth={currentNode?.id === node.id ? 2.5 : read ? 1.5 : 1}
                className={read ? 'fill-brand/20 stroke-brand' : 'fill-surface stroke-border'}
              />
              {isLeaf ? (
                node.keys.map((key, cell) => {
                  const cellX = x - width / 2 + cell * LEAF_CELL
                  const match = read && leafRead && key === params.key
                  return (
                    <g key={key}>
                      {match && (
                        <rect
                          x={cellX + 1.5}
                          y={y + 2}
                          width={LEAF_CELL - 3}
                          height={NODE_HEIGHT - 4}
                          rx={3}
                          strokeWidth={2}
                          className="fill-success/20 stroke-success"
                        />
                      )}
                      <text
                        x={cellX + LEAF_CELL / 2}
                        y={y + 15}
                        textAnchor="middle"
                        className={cn('fill-foreground font-mono', match && 'font-bold')}
                      >
                        {key}
                      </text>
                    </g>
                  )
                })
              ) : (
                <text x={x} y={y + 15} textAnchor="middle" className="fill-foreground font-mono">
                  {node.keys.join(' · ')}
                </text>
              )}
            </g>
          )
        })}

        {fetched && leaf && search.slot !== null && (
          <motion.line
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            x1={entryX}
            y1={leaf.y + NODE_HEIGHT}
            x2={tableX(search.slot) + TABLE.cell / 2}
            y2={TABLE.y}
            strokeWidth={2}
            strokeDasharray="4 3"
            className="stroke-success"
          />
        )}

        <text
          x={1}
          y={TABLE.titleY}
          strokeWidth={4}
          strokeLinejoin="round"
          paintOrder="stroke"
          className="fill-muted-foreground stroke-background font-semibold"
        >
          {t.tableTitle}
        </text>
        {ROWS.map((key, slot) => {
          const scanned = slot < tick
          const match = key === params.key && (scanned || fetched)
          return (
            <g key={slot}>
              <rect
                x={tableX(slot)}
                y={TABLE.y}
                width={TABLE.cell}
                height={TABLE.height}
                rx={3}
                strokeWidth={match || slot === tick - 1 ? 2 : 1}
                className={
                  match
                    ? 'fill-success/20 stroke-success'
                    : scanned
                      ? 'fill-highlight/20 stroke-highlight'
                      : 'fill-surface stroke-border'
                }
              />
              <text
                x={tableX(slot) + TABLE.cell / 2}
                y={TABLE.y + 16}
                textAnchor="middle"
                className={cn('fill-foreground font-mono', match && 'font-bold')}
              >
                {key}
              </text>
            </g>
          )
        })}
        {tick > 0 && (
          <motion.path
            d="M-5 6 L0 0 L5 6 z"
            initial={false}
            animate={{ x: tableX(tick - 1) + TABLE.cell / 2, y: CURSOR_Y }}
            className="fill-highlight"
          />
        )}

        {[
          {
            label: t.indexScan,
            value: format(t.indexCount, { nodes: nodesRead, rows: fetched ? 1 : 0, total: nodesRead + (fetched ? 1 : 0) }),
            tone: 'fill-brand/20 stroke-brand',
          },
          {
            label: t.seqScan,
            value: format(t.seqCount, { read: tick, total: ROWS.length }),
            tone: 'fill-highlight/20 stroke-highlight',
          },
        ].map((counter, row) => {
          const y = COUNTER.top + row * COUNTER.pitch
          return (
            <g key={counter.label}>
              <rect x={1} y={y} width={WIDTH - 2} height={COUNTER.height} rx={4} className={counter.tone} />
              <text x={9} y={y + 15} className="fill-foreground font-semibold">
                {counter.label}
              </text>
              <text x={WIDTH - 9} y={y + 15} textAnchor="end" className="fill-foreground font-mono">
                {counter.value}
              </text>
            </g>
          )
        })}
      </LabSvg>
      <LabLegend
        items={[
          { label: t.legend.index, swatch: 'border-brand bg-brand/20' },
          { label: t.legend.scan, swatch: 'border-highlight bg-highlight/20' },
          { label: t.legend.match, swatch: 'border-success bg-success/20' },
        ]}
      />
    </VisualLab>
  )
}
