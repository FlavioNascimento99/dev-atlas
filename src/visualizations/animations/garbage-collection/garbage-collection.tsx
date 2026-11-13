'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useId } from 'react'
import { format } from '@/lib/i18n/dictionary'
import { useLocale } from '@/lib/i18n/use-locale'
import { cn } from '@/lib/utils'
import { ChoiceParameter } from '../../primitives/choice-parameter'
import { LabSvg } from '../../primitives/lab-svg'
import { useSimulation } from '../../use-simulation'
import { VisualLab } from '../../visual-lab'
import { HEAP_SLOTS, createHeap, gcModel, reachable, referenceCounts } from './script'
import { texts } from './texts'
import type { GcParams, GcPhase, GcStrategy } from './types'

type Box = { x: number; y: number; halfWidth: number; halfHeight: number }

const INITIAL_PARAMS: GcParams = { strategy: 'tracing' }
const WIDTH = 340
const PHASES = ['program', 'mark', 'sweep'] as const satisfies readonly GcPhase[]
const CHIP = { width: 108, height: 20, gap: 8 }
const TITLES_Y = 44
const HEAP = { x: 100, y: 52, width: 239.5, height: 150 }
const ROOT = { x: 35, halfWidth: 30, halfHeight: 16 }
const OBJECT = { halfWidth: 32, halfHeight: 20 }
const ROW_Y = [92, 162]
const COLUMN_X = [160, 280]
const LEGEND_Y = HEAP.y + HEAP.height + 14
const HEIGHT = LEGEND_Y + 16
const ARROW = 7
const PAIR_SHIFT = 6
const MARKER_FILLS = ['fill-primary', 'fill-muted-foreground'] as const

const SWATCHES = {
  marked: 'fill-success/20 stroke-success',
  unmarked: 'fill-background stroke-muted-foreground',
  object: 'fill-background stroke-muted-foreground',
  unreachable: 'fill-danger/20 stroke-danger',
  free: 'fill-none stroke-border',
}
const LEGENDS = {
  tracing: ['marked', 'unmarked', 'free'],
  counting: ['object', 'unreachable', 'free'],
} as const satisfies Record<GcStrategy, readonly (keyof typeof SWATCHES)[]>

/** Slots fill the heap left to right, top to bottom. */
function slotBox(slot: number): Box {
  return { x: COLUMN_X[slot % 2] ?? 0, y: ROW_Y[Math.floor(slot / 2)] ?? 0, ...OBJECT }
}

/** Straight pointer between the borders of two boxes; one of a pair of opposite pointers is shifted sideways. */
function pointerLine(from: Box, to: Box, paired: boolean) {
  const length = Math.hypot(to.x - from.x, to.y - from.y)
  const ux = (to.x - from.x) / length
  const uy = (to.y - from.y) / length
  const border = (box: Box) => Math.min(box.halfWidth / Math.abs(ux), box.halfHeight / Math.abs(uy))
  const shift = paired ? PAIR_SHIFT : 0
  return {
    x1: from.x + ux * border(from) - uy * shift,
    y1: from.y + uy * border(from) + ux * shift,
    x2: to.x - ux * border(to) - uy * shift,
    y2: to.y - uy * border(to) + ux * shift,
  }
}

/** Type B lab: one mark-sweep cycle over the heap of the article, compared with reference counting on the same heap. */
export function GarbageCollection() {
  const locale = useLocale()
  const t = texts[locale]
  const markerId = useId()
  const { params, state, setParams, playback } = useSimulation(gcModel, INITIAL_PARAMS)
  const step = state.steps[state.index - 1]
  const heap = step?.heap ?? createHeap()
  const counting = params.strategy === 'counting'
  const counts = referenceCounts(heap)
  const live = reachable(heap)
  const focus = step?.visit?.object ?? step?.allocated

  const boxes = new Map<string, Box>([
    ...heap.roots.map((root, index): [string, Box] => [root.name, { ...ROOT, y: ROW_Y[index] ?? 0 }]),
    ...heap.objects.map((object): [string, Box] => [object.id, slotBox(object.slot)]),
  ])
  const pointers = [
    ...heap.roots.flatMap((root) => (root.target === null ? [] : [{ from: root.name, to: root.target, paired: false }])),
    ...heap.objects.flatMap((object) =>
      object.references.map((to) => ({
        from: object.id,
        to,
        paired: heap.objects.some((other) => other.id === to && other.references.includes(object.id)),
      })),
    ),
  ]
  const usedSlots = new Set(heap.objects.map((object) => object.slot))
  const freeSlots = Array.from({ length: HEAP_SLOTS }, (_, slot) => slot).filter((slot) => !usedSlots.has(slot))

  const explanation = step
    ? format(t.steps[step.id], {
        object: focus ?? '',
        from: step.visit?.from ?? '',
        freed: new Intl.ListFormat(locale).format(step.freed ?? []),
      })
    : t.start[params.strategy]

  return (
    <VisualLab
      title={t.title}
      description={t.description}
      fidelity="conceptual"
      playback={playback}
      explanation={explanation}
      parameters={
        <ChoiceParameter
          label={t.strategy}
          value={params.strategy}
          options={[
            { value: 'tracing', label: t.tracing },
            { value: 'counting', label: t.counting },
          ]}
          onChange={(strategy) => setParams({ strategy })}
        />
      }
    >
      <LabSvg width={WIDTH} height={HEIGHT} title={t.svgTitle} description={t.svgDescription}>
        <defs>
          {MARKER_FILLS.map((fill, index) => (
            <marker
              key={fill}
              id={`${markerId}-${index}`}
              viewBox={`0 0 ${ARROW} ${ARROW}`}
              refX={ARROW}
              refY={ARROW / 2}
              markerWidth={ARROW}
              markerHeight={ARROW}
              markerUnits="userSpaceOnUse"
              orient="auto"
            >
              <path d={`M0 0 L${ARROW} ${ARROW / 2} L0 ${ARROW} z`} className={fill} />
            </marker>
          ))}
        </defs>

        {counting ? (
          <text x={WIDTH / 2} y={14} textAnchor="middle" className="fill-muted-foreground">
            {t.noPhase}
          </text>
        ) : (
          PHASES.map((phase, index) => {
            const current = phase === (step?.phase ?? 'program')
            const x = index * (CHIP.width + CHIP.gap)
            return (
              <g key={phase}>
                <rect
                  x={x + 0.5}
                  y={0.5}
                  width={CHIP.width - 1}
                  height={CHIP.height}
                  rx={CHIP.height / 2}
                  className={current ? 'fill-primary stroke-primary' : 'fill-surface stroke-border'}
                />
                <text
                  x={x + CHIP.width / 2}
                  y={14}
                  textAnchor="middle"
                  className={cn('text-[10px]', current ? 'fill-primary-foreground font-semibold' : 'fill-muted-foreground')}
                >
                  {t.phases[phase]}
                </text>
              </g>
            )
          })
        )}

        <text x={ROOT.x} y={TITLES_Y} textAnchor="middle" className="fill-foreground font-semibold">
          {t.roots}
        </text>
        <text x={HEAP.x + HEAP.width / 2} y={TITLES_Y} textAnchor="middle" className="fill-foreground font-semibold">
          {t.heap}
        </text>
        <rect
          x={HEAP.x}
          y={HEAP.y}
          width={HEAP.width}
          height={HEAP.height}
          rx={6}
          strokeDasharray="4 3"
          className="fill-surface stroke-border"
        />

        {heap.roots.map((root) => {
          const box = boxes.get(root.name)
          if (!box) return null
          return (
            <g key={root.name}>
              <rect
                x={box.x - box.halfWidth}
                y={box.y - box.halfHeight}
                width={box.halfWidth * 2}
                height={box.halfHeight * 2}
                rx={4}
                strokeWidth={step?.visit?.from === root.name ? 2 : 1}
                className={cn('fill-background', step?.visit?.from === root.name ? 'stroke-primary' : 'stroke-border')}
              />
              <text
                x={box.x}
                y={box.y + 4}
                textAnchor="middle"
                className={cn('font-mono', root.target === null ? 'fill-muted-foreground text-[10px]' : 'fill-foreground font-semibold')}
              >
                {root.target === null ? format(t.nullRoot, { name: root.name }) : root.name}
              </text>
            </g>
          )
        })}

        {freeSlots.map((slot) => {
          const box = slotBox(slot)
          return (
            <motion.g key={slot} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect
                x={box.x - box.halfWidth}
                y={box.y - box.halfHeight}
                width={box.halfWidth * 2}
                height={box.halfHeight * 2}
                rx={6}
                strokeDasharray="4 3"
                className={SWATCHES.free}
              />
              <text x={box.x} y={box.y + 4} textAnchor="middle" className="fill-muted-foreground text-[10px]">
                {t.free}
              </text>
            </motion.g>
          )
        })}

        {pointers.map(({ from, to, paired }) => {
          const source = boxes.get(from)
          const target = boxes.get(to)
          if (!source || !target) return null
          const followed = step?.visit?.from === from && step.visit.object === to
          return (
            <motion.line
              key={`${from}-${to}`}
              {...pointerLine(source, target, paired)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              strokeWidth={followed ? 2.5 : 1.5}
              markerEnd={`url(#${markerId}-${followed ? 0 : 1})`}
              className={followed ? 'stroke-primary' : 'stroke-muted-foreground'}
            />
          )
        })}

        <AnimatePresence>
          {heap.objects.map((object) => {
            const box = slotBox(object.slot)
            const leaked = step?.id === 'countStuck' && !live.has(object.id)
            const swatch = object.marked ? SWATCHES.marked : leaked ? SWATCHES.unreachable : SWATCHES.object
            return (
              <motion.g key={object.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <rect
                  x={box.x - box.halfWidth}
                  y={box.y - box.halfHeight}
                  width={box.halfWidth * 2}
                  height={box.halfHeight * 2}
                  rx={6}
                  strokeWidth={object.id === focus ? 2.5 : 1.5}
                  className={cn('transition-[fill,stroke] duration-300', swatch)}
                />
                <text
                  x={box.x}
                  y={box.y + (counting ? -1 : 5)}
                  textAnchor="middle"
                  className="fill-foreground text-[14px] font-semibold"
                >
                  {object.id}
                </text>
                {counting && (
                  <text
                    x={box.x}
                    y={box.y + 13}
                    textAnchor="middle"
                    className={cn('font-mono text-[10px]', leaked ? 'fill-danger' : 'fill-muted-foreground')}
                  >
                    {format(t.count, { count: counts.get(object.id) ?? 0 })}
                  </text>
                )}
                {object.marked && (
                  <path
                    d={`M${box.x + 16} ${box.y - 9} l4 4 l7 -8`}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="fill-none stroke-success"
                  />
                )}
              </motion.g>
            )
          })}
        </AnimatePresence>

        {LEGENDS[params.strategy].map((item, index) => (
          <g key={item} transform={`translate(${index * 115} ${LEGEND_Y})`}>
            <rect
              x={0.5}
              y={1}
              width={16}
              height={12}
              rx={2}
              strokeDasharray={item === 'free' ? '3 2' : undefined}
              className={SWATCHES[item]}
            />
            <text x={22} y={11} className="fill-foreground">
              {t.legend[item]}
            </text>
          </g>
        ))}
      </LabSvg>
    </VisualLab>
  )
}
