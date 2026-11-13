'use client'

import { useId } from 'react'
import { useLocale } from '@/lib/i18n/use-locale'
import { cn } from '@/lib/utils'
import { LabLegend } from '../../primitives/lab-legend'
import { LabSvg } from '../../primitives/lab-svg'
import { VisualLab } from '../../visual-lab'
import { FACTORY_EDGES, FACTORY_NODES } from './diagram'
import { texts } from './texts'
import type { FactoryEdgeKind, FactoryNodeId, FactoryNodeKind } from './types'

const WIDTH = 360
const HEIGHT = 326
const BOX_WIDTH = 132
const LEFT = 26
const RIGHT = WIDTH - LEFT - BOX_WIDTH
/** Vertical lanes outside the columns, for inheritance lines that must go around a sibling. */
const RAIL_OFFSET = 16
const ADJACENT_GAP = 40
const LEGEND = { x: LEFT, y: 284, row: 16, sample: 32 }
const ARROW = 8

/** Creators on the left, products on the right; abstractions above the classes that specialize them. */
const BOXES: Record<FactoryNodeId, { x: number; y: number; height: number }> = {
  client: { x: LEFT, y: 8, height: 26 },
  exporter: { x: LEFT, y: 66, height: 66 },
  writer: { x: RIGHT, y: 66, height: 66 },
  pdfExporter: { x: LEFT, y: 164, height: 40 },
  pdfWriter: { x: RIGHT, y: 164, height: 40 },
  htmlExporter: { x: LEFT, y: 222, height: 40 },
  htmlWriter: { x: RIGHT, y: 222, height: 40 },
}

const NODE_STYLE: Record<FactoryNodeKind, string> = {
  client: 'fill-surface stroke-muted-foreground',
  abstraction: 'fill-brand/20 stroke-brand',
  concrete: 'fill-surface stroke-border',
}

const EDGE_KINDS = ['uses', 'creates', 'inherits'] as const satisfies readonly FactoryEdgeKind[]

const EDGE_STYLE: Record<FactoryEdgeKind, { stroke: string; dash?: string }> = {
  uses: { stroke: 'stroke-brand' },
  creates: { stroke: 'stroke-warning', dash: '5 3' },
  inherits: { stroke: 'stroke-muted-foreground' },
}

/** Straight line between neighbors; around the outside of the column when a sibling sits in between. */
function route(from: FactoryNodeId, to: FactoryNodeId) {
  const a = BOXES[from]
  const b = BOXES[to]
  const middleA = a.y + a.height / 2
  const middleB = b.y + b.height / 2
  if (a.x !== b.x) {
    return a.x < b.x ? `M${a.x + BOX_WIDTH} ${middleA} H${b.x}` : `M${a.x} ${middleA} H${b.x + BOX_WIDTH}`
  }
  const center = a.x + BOX_WIDTH / 2
  if (a.y < b.y) return `M${center} ${a.y + a.height} V${b.y}`
  if (a.y - (b.y + b.height) <= ADJACENT_GAP) return `M${center} ${a.y} V${b.y + b.height}`
  const edge = a.x === LEFT ? a.x : a.x + BOX_WIDTH
  const rail = a.x === LEFT ? a.x - RAIL_OFFSET : a.x + BOX_WIDTH + RAIL_OFFSET
  return `M${edge} ${middleA} H${rail} V${middleB} H${edge}`
}

/** Type A lab: the classes of a Factory Method and the dependencies between them. */
export function FactoryMethodDiagram() {
  const t = texts[useLocale()]
  const markerId = useId()
  const marker = (kind: FactoryEdgeKind) => `url(#${markerId}-${kind})`

  return (
    <VisualLab title={t.title} description={t.description} fidelity="conceptual" explanation={t.explanation}>
      <LabSvg width={WIDTH} height={HEIGHT} title={t.svgTitle} description={t.svgDescription}>
        <defs>
          {EDGE_KINDS.map((kind) => (
            <marker
              key={kind}
              id={`${markerId}-${kind}`}
              viewBox={`0 0 ${ARROW + 2} ${ARROW + 2}`}
              refX={ARROW + 1}
              refY={ARROW / 2 + 1}
              markerWidth={ARROW + 2}
              markerHeight={ARROW + 2}
              markerUnits="userSpaceOnUse"
              orient="auto"
            >
              <path
                d={`M1 1 L${ARROW + 1} ${ARROW / 2 + 1} L1 ${ARROW + 1}${kind === 'inherits' ? ' z' : ''}`}
                strokeWidth={1.5}
                strokeLinejoin="round"
                className={cn(EDGE_STYLE[kind].stroke, kind === 'inherits' ? 'fill-background' : 'fill-none')}
              />
            </marker>
          ))}
        </defs>

        {FACTORY_EDGES.map((edge) => (
          <path
            key={`${edge.from}-${edge.to}`}
            d={route(edge.from, edge.to)}
            strokeWidth={1.5}
            strokeDasharray={EDGE_STYLE[edge.kind].dash}
            markerEnd={marker(edge.kind)}
            className={cn('fill-none', EDGE_STYLE[edge.kind].stroke)}
          />
        ))}

        {FACTORY_NODES.map((node) => {
          const box = BOXES[node.id]
          const center = box.x + BOX_WIDTH / 2
          const nameY = box.y + (node.stereotype ? 27 : 16)
          return (
            <g key={node.id}>
              <rect x={box.x} y={box.y} width={BOX_WIDTH} height={box.height} rx={4} className={NODE_STYLE[node.kind]} />
              {node.stereotype && (
                <text x={center} y={box.y + 13} textAnchor="middle" className="fill-muted-foreground text-[9.5px]">
                  {t.stereotypes[node.stereotype]}
                </text>
              )}
              <text x={center} y={nameY} textAnchor="middle" className="fill-foreground font-mono font-semibold">
                {node.name}
              </text>
              {node.members.length > 0 && (
                <line x1={box.x} y1={nameY + 6} x2={box.x + BOX_WIDTH} y2={nameY + 6} className={NODE_STYLE[node.kind]} />
              )}
              {node.members.map((member, index) => (
                <text key={member} x={center} y={nameY + 19 + index * 13} textAnchor="middle" className="fill-foreground font-mono text-[10px]">
                  {member}
                </text>
              ))}
            </g>
          )
        })}

        {EDGE_KINDS.map((kind, index) => {
          const y = LEGEND.y + index * LEGEND.row
          return (
            <g key={kind}>
              <path
                d={`M${LEGEND.x} ${y} H${LEGEND.x + LEGEND.sample}`}
                strokeWidth={1.5}
                strokeDasharray={EDGE_STYLE[kind].dash}
                markerEnd={marker(kind)}
                className={cn('fill-none', EDGE_STYLE[kind].stroke)}
              />
              <text x={LEGEND.x + LEGEND.sample + 8} y={y + 3.5} className="fill-muted-foreground text-[10px]">
                {t.edges[kind]}
              </text>
            </g>
          )
        })}
      </LabSvg>
      <LabLegend
        items={[
          { label: t.kinds.abstraction, swatch: 'border-brand bg-brand/20' },
          { label: t.kinds.concrete, swatch: 'border-border bg-surface' },
        ]}
      />
    </VisualLab>
  )
}
