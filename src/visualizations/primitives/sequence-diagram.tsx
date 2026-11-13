import { motion } from 'motion/react'
import { useId } from 'react'
import { cn } from '@/lib/utils'
import type { SequenceStep } from '../types'
import { LabSvg } from './lab-svg'

const WIDTH = 320
const ACTOR = { height: 22, maxWidth: 92, gap: 4 }
const TOP = ACTOR.height + 10
const ROW = { message: 28, note: 24 }
const NOTE_HEIGHT = 16
const ARROW = 7
// ponytail: text width is estimated from the character count; measure with getBBox if labels stop being short.
const CHAR_WIDTH = 5.9

type SequenceDiagramProps<Actor extends string, Label extends string> = {
  title: string
  description: string
  /** Lifelines, left to right. */
  actors: readonly Actor[]
  actorLabels: Record<Actor, string>
  labels: Record<Label, string>
  steps: SequenceStep<Actor, Label>[]
  /** Number of steps already revealed; the events of the last one are highlighted. */
  current: number
}

/** Centers a label of the given width on `x` without letting it leave the canvas. */
function clampCenter(x: number, width: number) {
  return Math.min(Math.max(x, width / 2 + 2), WIDTH - width / 2 - 2)
}

/** Every row is laid out up front so the canvas keeps its height while the steps are revealed. */
function layoutRows<Actor extends string, Label extends string>(steps: SequenceStep<Actor, Label>[]) {
  let height = TOP
  const rows = steps.flatMap((step, stepIndex) =>
    step.events.map((event, eventIndex) => {
      const row = { event, stepIndex, key: `${stepIndex}-${eventIndex}`, y: height }
      height += ROW[event.kind]
      return row
    }),
  )
  return { rows, height: height + 4 }
}

/**
 * Sequence diagram for scripted labs: actors as lifelines and the messages of each revealed step drawn as labeled
 * arrows, top to bottom. Labels stay short; the full explanation of a step belongs to the lab's explanation panel.
 */
export function SequenceDiagram<Actor extends string, Label extends string>({
  title,
  description,
  actors,
  actorLabels,
  labels,
  steps,
  current,
}: SequenceDiagramProps<Actor, Label>) {
  const markerId = useId()
  const column = WIDTH / actors.length
  const actorWidth = Math.min(column - ACTOR.gap, ACTOR.maxWidth)
  const centerOf = (actor: Actor) => (actors.indexOf(actor) + 0.5) * column

  const { rows, height } = layoutRows(steps)

  const active = new Set(
    steps[current - 1]?.events.flatMap((event) =>
      event.kind === 'message' ? [event.from, event.to] : [event.at],
    ),
  )

  return (
    <div className="mx-auto max-w-md">
      <LabSvg width={WIDTH} height={height} title={title} description={description}>
        <defs>
          {(['fill-primary', 'fill-muted-foreground'] as const).map((fill, index) => (
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

        {actors.map((actor) => {
          const x = centerOf(actor)
          const label = actorLabels[actor]
          const fits = label.length * CHAR_WIDTH <= actorWidth - 6
          return (
            <g key={actor}>
              <line x1={x} y1={ACTOR.height} x2={x} y2={height} className="stroke-border" strokeDasharray="3 3" />
              <rect
                x={x - actorWidth / 2}
                y={1}
                width={actorWidth}
                height={ACTOR.height - 2}
                rx={5}
                strokeWidth={active.has(actor) ? 2 : 1}
                className={cn('fill-surface', active.has(actor) ? 'stroke-primary' : 'stroke-border')}
              />
              <text
                x={x}
                y={ACTOR.height / 2 + 4}
                textAnchor="middle"
                textLength={fits ? undefined : actorWidth - 6}
                lengthAdjust="spacingAndGlyphs"
                className="fill-foreground text-[10.5px] font-semibold"
              >
                {label}
              </text>
            </g>
          )
        })}

        {rows.map(({ event, stepIndex, key, y }) => {
          if (stepIndex >= current) return null
          const highlighted = stepIndex === current - 1
          const label = labels[event.label]
          const labelWidth = label.length * CHAR_WIDTH

          if (event.kind === 'note') {
            const x = clampCenter(centerOf(event.at), labelWidth + 12)
            return (
              <motion.g key={key} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect
                  x={x - labelWidth / 2 - 6}
                  y={y + 4}
                  width={labelWidth + 12}
                  height={NOTE_HEIGHT}
                  rx={NOTE_HEIGHT / 2}
                  className={highlighted ? 'fill-background stroke-highlight' : 'fill-background stroke-border'}
                />
                <text
                  x={x}
                  y={y + 15.5}
                  textAnchor="middle"
                  className={cn('text-[10.5px]', highlighted ? 'fill-foreground font-medium' : 'fill-muted-foreground')}
                >
                  {label}
                </text>
              </motion.g>
            )
          }

          const from = centerOf(event.from)
          const to = centerOf(event.to)
          const end = event.lost ? from + (to - from) * 0.55 : to
          const lineY = y + 20
          return (
            <motion.g key={key} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text
                x={clampCenter((from + to) / 2, labelWidth)}
                y={y + 14}
                textAnchor="middle"
                strokeWidth={3}
                strokeLinejoin="round"
                paintOrder="stroke"
                className={cn('stroke-background', highlighted ? 'fill-foreground font-semibold' : 'fill-muted-foreground')}
              >
                {label}
              </text>
              <motion.line
                x1={from}
                y1={lineY}
                y2={lineY}
                initial={{ x2: from }}
                animate={{ x2: end }}
                strokeWidth={highlighted ? 2 : 1.5}
                strokeDasharray={event.reply ? '5 3' : undefined}
                markerEnd={event.lost ? undefined : `url(#${markerId}-${highlighted ? 0 : 1})`}
                className={event.lost ? 'stroke-danger' : highlighted ? 'stroke-primary' : 'stroke-muted-foreground'}
              />
              {event.lost && (
                <path
                  d={`M${end - 4} ${lineY - 4} l8 8 m0 -8 l-8 8`}
                  strokeWidth={2}
                  strokeLinecap="round"
                  className="fill-none stroke-danger"
                />
              )}
            </motion.g>
          )
        })}
      </LabSvg>
    </div>
  )
}
