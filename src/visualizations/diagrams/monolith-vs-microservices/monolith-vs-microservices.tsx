'use client'

import { useId } from 'react'
import { format } from '@/lib/i18n/dictionary'
import { useLocale } from '@/lib/i18n/use-locale'
import { LabLegend } from '../../primitives/lab-legend'
import { LabSvg } from '../../primitives/lab-svg'
import { VisualLab } from '../../visual-lab'
import { ARCHITECTURES, callKind } from './diagram'
import { texts } from './texts'
import type { ArchitectureId, CallKind, ComponentId } from './types'

const WIDTH = 300
const BOX_HEIGHT = 30
/** Same arrangement in both panels, so the eye compares packaging and not positions. */
const BOXES: Record<ComponentId, { x: number; y: number; width: number }> = {
  gateway: { x: 90, y: 2, width: 120 },
  orders: { x: 104, y: 50, width: 92 },
  payments: { x: 8, y: 130, width: 92 },
  inventory: { x: 104, y: 130, width: 92 },
  catalog: { x: 200, y: 130, width: 92 },
}
/** Without a gateway row the drawing moves up to the top of the canvas. */
const NO_GATEWAY_SHIFT = 34
const BOUNDARY_PADDING = 7
const DATABASE = { width: 56, height: 22, gap: 12, cap: 4 }
const LEGEND_GAP = 18
const ARROW = 7

const UNIT_STYLE = 'fill-brand/10 stroke-primary'
const CALL_KINDS = ['inProcess', 'network'] as const satisfies readonly CallKind[]
const CALL_STYLE: Record<CallKind, { stroke: string; fill: string; dash?: string }> = {
  inProcess: { stroke: 'stroke-muted-foreground', fill: 'fill-muted-foreground' },
  network: { stroke: 'stroke-info', fill: 'fill-info', dash: '5 3' },
}

function Cylinder({ x, y, label }: { x: number; y: number; label: string }) {
  const { width, height, cap } = DATABASE
  const arc = `a${width / 2} ${cap} 0 0`
  return (
    <g>
      <path
        d={`M${x} ${y + cap} ${arc} 1 ${width} 0 v${height - 2 * cap} ${arc} 1 ${-width} 0 z M${x} ${y + cap} ${arc} 0 ${width} 0`}
        className="fill-highlight/20 stroke-highlight"
      />
      <text x={x + width / 2} y={y + height / 2 + 5} textAnchor="middle" className="fill-foreground text-[10px] font-semibold">
        {label}
      </text>
    </g>
  )
}

function ArchitecturePanel({ id }: { id: ArchitectureId }) {
  const t = texts[useLocale()]
  const markerId = useId()
  const architecture = ARCHITECTURES[id]
  const components = architecture.deployUnits.flat()
  const shift = components.includes('gateway') ? 0 : NO_GATEWAY_SHIFT
  const box = (component: ComponentId) => ({ ...BOXES[component], y: BOXES[component].y - shift })
  const sharesUnit = (component: ComponentId) => architecture.deployUnits.some((unit) => unit.length > 1 && unit.includes(component))
  const kinds = CALL_KINDS.filter((kind) => architecture.calls.some((call) => callKind(architecture, call) === kind))

  const rowBottom = box('payments').y + BOX_HEIGHT
  const boundary = components.some(sharesUnit) ? { top: box('orders').y - 2 * BOUNDARY_PADDING, bottom: rowBottom + BOUNDARY_PADDING } : null
  const databases = architecture.databases.map(({ owners }) => {
    const owner = owners[0]
    if (owners.length > 1 || !owner) {
      const y = (boundary?.bottom ?? rowBottom) + DATABASE.gap + 6
      return { key: 'shared', x: (WIDTH - DATABASE.width) / 2, y, link: `M${WIDTH / 2} ${boundary?.bottom ?? rowBottom} V${y}` }
    }
    const { x, y, width } = box(owner)
    // The database of the service in the top row sits beside it, leaving the space below for the calls.
    if (owner === 'orders') {
      const middle = y + BOX_HEIGHT / 2
      return { key: owner, x: x + width + 30, y: middle - DATABASE.height / 2, link: `M${x + width} ${middle} h30` }
    }
    const center = x + width / 2
    return { key: owner, x: center - DATABASE.width / 2, y: y + BOX_HEIGHT + DATABASE.gap, link: `M${center} ${y + BOX_HEIGHT} v${DATABASE.gap}` }
  })
  const legendY = Math.max(...databases.map((database) => database.y + DATABASE.height)) + LEGEND_GAP

  return (
    <div>
      <p className="text-sm font-semibold">{t.architectures[id]}</p>
      <p className="mb-2 text-xs text-muted-foreground">
        {format(t.summary, { units: architecture.deployUnits.length, databases: architecture.databases.length })}
      </p>
      <LabSvg width={WIDTH} height={legendY + 10} title={t.svgTitles[id]} description={t.svgDescriptions[id]}>
        <defs>
          {kinds.map((kind) => (
            <marker
              key={kind}
              id={`${markerId}-${kind}`}
              viewBox={`0 0 ${ARROW} ${ARROW}`}
              refX={ARROW}
              refY={ARROW / 2}
              markerWidth={ARROW}
              markerHeight={ARROW}
              markerUnits="userSpaceOnUse"
              orient="auto"
            >
              <path d={`M0 0 L${ARROW} ${ARROW / 2} L0 ${ARROW} z`} className={CALL_STYLE[kind].fill} />
            </marker>
          ))}
        </defs>

        {boundary && (
          <rect x={1} y={boundary.top} width={WIDTH - 2} height={boundary.bottom - boundary.top} rx={8} strokeWidth={2} className={UNIT_STYLE} />
        )}

        {databases.map((database) => (
          <g key={database.key}>
            <path d={database.link} strokeWidth={1.5} className="fill-none stroke-highlight" />
            <Cylinder x={database.x} y={database.y} label={t.database} />
          </g>
        ))}

        {architecture.calls.map((call) => {
          const kind = callKind(architecture, call)
          const from = box(call.from)
          const to = box(call.to)
          return (
            <line
              key={`${call.from}-${call.to}`}
              x1={from.x + from.width / 2}
              y1={from.y + BOX_HEIGHT}
              x2={to.x + to.width / 2}
              y2={to.y}
              strokeWidth={1.5}
              strokeDasharray={CALL_STYLE[kind].dash}
              markerEnd={`url(#${markerId}-${kind})`}
              className={CALL_STYLE[kind].stroke}
            />
          )
        })}

        {components.map((component) => {
          const { x, y, width } = box(component)
          const inner = sharesUnit(component)
          return (
            <g key={component}>
              <rect
                x={x}
                y={y}
                width={width}
                height={BOX_HEIGHT}
                rx={5}
                strokeWidth={inner ? 1 : 2}
                className={inner ? 'fill-surface stroke-border' : UNIT_STYLE}
              />
              <text x={x + width / 2} y={y + BOX_HEIGHT / 2 + 4} textAnchor="middle" className="fill-foreground font-semibold">
                {t.components[component]}
              </text>
            </g>
          )
        })}

        {kinds.map((kind, index) => {
          const x = 8 + index * 140
          return (
            <g key={kind}>
              <line
                x1={x}
                y1={legendY}
                x2={x + 28}
                y2={legendY}
                strokeWidth={1.5}
                strokeDasharray={CALL_STYLE[kind].dash}
                markerEnd={`url(#${markerId}-${kind})`}
                className={CALL_STYLE[kind].stroke}
              />
              <text x={x + 36} y={legendY + 3.5} className="fill-muted-foreground text-[10px]">
                {t.calls[kind]}
              </text>
            </g>
          )
        })}
      </LabSvg>
    </div>
  )
}

/** Type A lab: the same capabilities as one deploy unit with one database, and as independently deployed services. */
export function MonolithVsMicroservices() {
  const t = texts[useLocale()]
  return (
    <VisualLab title={t.title} description={t.description} fidelity="conceptual" explanation={t.explanation}>
      <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
        <ArchitecturePanel id="monolith" />
        <ArchitecturePanel id="microservices" />
      </div>
      <LabLegend
        items={[
          { label: t.legend.unit, swatch: 'border-primary bg-brand/10' },
          { label: t.legend.module, swatch: 'border-border bg-surface' },
          { label: t.legend.database, swatch: 'border-highlight bg-highlight/20' },
        ]}
      />
    </VisualLab>
  )
}
