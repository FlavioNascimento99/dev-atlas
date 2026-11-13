'use client'

import { motion } from 'motion/react'
import { format } from '@/lib/i18n/dictionary'
import { useLocale } from '@/lib/i18n/use-locale'
import { cn } from '@/lib/utils'
import { entityColor } from '../../constants'
import { ChoiceParameter } from '../../primitives/choice-parameter'
import { LabLegend } from '../../primitives/lab-legend'
import { LabSvg } from '../../primitives/lab-svg'
import { useSimulation } from '../../use-simulation'
import { VisualLab } from '../../visual-lab'
import { capModel, cutLink, hasQuorum, healLink, INITIAL_VALUE, reachable, sideOf } from './simulation'
import { texts } from './texts'
import type { CapEvent, CapOutcome } from './types'

type Tone = 'success' | 'warning' | 'danger'
type Point = { x: number; y: number }

const WIDTH = 360
const HEIGHT = 232
const STATUS_Y = HEIGHT - 8
const NODE = { width: 120, height: 46 }
const NODES: Point[] = [
  { x: 0, y: 64 },
  { x: 0, y: 146 },
  { x: 240, y: 105 },
]
const NODE_NAMES = ['N1', 'N2', 'N3']
const CLIENT = { width: 150, height: 40 }
/** Each client sits above the replica it talks to; `port` is the x of its request arrow. */
const CLIENTS = [
  { name: 'A', x: 0, node: 0, port: 60 },
  { name: 'B', x: WIDTH - CLIENT.width, node: 2, port: 300 },
]
const LINKS: { ends: [number, number]; points: [Point, Point] }[] = [
  { ends: [0, 1], points: [{ x: 60, y: 110 }, { x: 60, y: 146 }] },
  { ends: [0, 2], points: [{ x: 120, y: 87 }, { x: 240, y: 128 }] },
  { ends: [1, 2], points: [{ x: 120, y: 169 }, { x: 240, y: 128 }] },
]

const TONE: Record<Tone, { stroke: string; fill: string }> = {
  success: { stroke: 'stroke-success', fill: 'fill-success' },
  warning: { stroke: 'stroke-warning', fill: 'fill-warning' },
  danger: { stroke: 'stroke-danger', fill: 'fill-danger' },
}

const OUTCOME_TONE: Record<CapOutcome, Tone> = {
  cut: 'danger',
  writeReplicated: 'success',
  writeCommitted: 'success',
  writeTentative: 'warning',
  writeRejected: 'danger',
  readFresh: 'success',
  readStale: 'warning',
  readRejected: 'danger',
  healInSync: 'success',
  healCaughtUp: 'success',
  healReconciled: 'warning',
}

const NEUTRAL = { fill: 'fill-surface', stroke: 'stroke-muted-foreground' }

/** Replicas holding the same value share a color, so divergence shows as two colors side by side. */
function valueColor(value: number) {
  return value === INITIAL_VALUE ? NEUTRAL : entityColor(value - INITIAL_VALUE - 1)
}

/** Path of a message between two replicas, oriented from the sender. */
function travel(from: number, to: number): [Point, Point] | null {
  const link = LINKS.find(({ ends }) => ends.includes(from) && ends.includes(to))
  if (!link) return null
  const [start, end] = link.points
  return link.ends[0] === from ? [start, end] : [end, start]
}

/** Replica-to-replica messages caused by the last event: replication of an accepted write, or the repair after a heal. */
function messages(event: CapEvent, peers: number[]): [Point, Point][] {
  const { outcome, node } = event
  if (node === undefined) return []
  const receivers =
    outcome === 'writeReplicated' || outcome === 'writeCommitted'
      ? peers
      : outcome === 'healCaughtUp' || outcome === 'healReconciled'
        ? NODES.map((_, index) => index).filter((index) => !sideOf(node).includes(index))
        : []
  return receivers.flatMap((receiver) => {
    const path = receiver === node ? null : travel(node, receiver)
    return path ? [path] : []
  })
}

/** Type C lab: the same requests against a partitioned system that favors consistency or availability. */
export function CapPartitionSimulator() {
  const t = texts[useLocale()]
  const { params, state, setParams, update, playback } = useSimulation(capModel, { mode: 'consistency' })
  const { last } = state
  const values = (event: CapEvent) => ({
    client: CLIENTS[event.client ?? 0]?.name ?? '',
    node: NODE_NAMES[event.node ?? 0] ?? '',
    value: event.value ?? '',
    dropped: event.dropped ?? '',
  })
  const healed = last && last.client === undefined && !state.partitioned
  const status = state.partitioned ? t.labels.cut : healed ? format(t.labels[last.outcome], values(last)) : t.healthy
  const requester = last?.client === undefined ? undefined : CLIENTS[last.client]

  return (
    <VisualLab
      title={t.title}
      description={t.description}
      fidelity="conceptual"
      playback={playback}
      explanation={last ? format(t.steps[last.outcome], values(last)) : t.start}
      parameters={
        <div className="grid gap-4 sm:grid-cols-2">
          <ChoiceParameter
            label={t.mode}
            value={params.mode}
            options={[
              { value: 'consistency', label: t.consistency },
              { value: 'availability', label: t.availability },
            ]}
            onChange={(mode) => setParams({ mode })}
          />
          <ChoiceParameter
            label={t.link}
            value={state.partitioned ? 'cut' : 'connected'}
            options={[
              { value: 'cut', label: t.linkCut },
              { value: 'connected', label: t.linkConnected },
            ]}
            onChange={(link) => update(link === 'cut' ? cutLink : healLink)}
          />
        </div>
      }
    >
      <LabSvg width={WIDTH} height={HEIGHT} title={t.svgTitle} description={t.svgDescription}>
        {LINKS.map(({ ends, points: [start, end] }) => {
          const cut = !reachable(state, ends[0]).includes(ends[1])
          const middle = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 }
          return (
            <g key={ends.join('-')}>
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                strokeWidth={1.5}
                strokeDasharray={cut ? '3 4' : undefined}
                className={cut ? 'stroke-danger' : 'stroke-muted-foreground'}
              />
              {cut && (
                <path
                  d={`M${middle.x - 6} ${middle.y - 6} l12 12 m0 -12 l-12 12`}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  className="fill-none stroke-danger"
                />
              )}
            </g>
          )
        })}

        {CLIENTS.map((client, index) => {
          const result = state.lastByClient[index]
          const active = last?.client === index
          const node = NODES[client.node]
          return (
            <g key={client.name}>
              {node && <line x1={client.port} y1={CLIENT.height} x2={client.port} y2={node.y} className="stroke-border" strokeDasharray="4 3" />}
              <rect
                x={client.x + 1}
                y={1}
                width={CLIENT.width - 2}
                height={CLIENT.height - 2}
                rx={6}
                strokeWidth={active ? 2 : 1}
                className={cn('fill-surface', result ? TONE[OUTCOME_TONE[result.outcome]].stroke : 'stroke-border')}
              />
              <text x={client.x + CLIENT.width / 2} y={16} textAnchor="middle" className="fill-foreground font-semibold">
                {format(t.client, { name: client.name })}
              </text>
              <text
                x={client.x + CLIENT.width / 2}
                y={32}
                textAnchor="middle"
                className={result ? 'fill-foreground' : 'fill-muted-foreground'}
              >
                {result ? format(t.labels[result.outcome], values(result)) : t.idle}
              </text>
            </g>
          )
        })}

        {state.replicas.map((replica, index) => {
          const position = NODES[index]
          if (!position) return null
          const active = last?.node === index
          const refusing = params.mode === 'consistency' && !hasQuorum(state, index)
          const color = valueColor(replica.value)
          return (
            <g key={index}>
              <rect
                x={position.x + 1}
                y={position.y}
                width={NODE.width - 2}
                height={NODE.height}
                rx={6}
                strokeWidth={active ? 2 : 1}
                strokeDasharray={refusing ? '5 3' : undefined}
                className={cn(
                  'fill-background',
                  active && last ? TONE[OUTCOME_TONE[last.outcome]].stroke : refusing ? 'stroke-danger' : 'stroke-muted-foreground',
                )}
              />
              <text x={position.x + 12} y={position.y + 28} className="fill-foreground text-[12px] font-semibold">
                {NODE_NAMES[index]}
              </text>
              <motion.g key={replica.value} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={position.x + 42} y={position.y + 9} width={68} height={28} rx={5} className={`${color.fill} ${color.stroke}`} />
                <text
                  x={position.x + 76}
                  y={position.y + 28}
                  textAnchor="middle"
                  className="fill-foreground font-mono text-[13px] font-bold"
                >
                  x = {replica.value}
                </text>
              </motion.g>
            </g>
          )
        })}

        {state.partitioned && (
          <g className="fill-muted-foreground">
            <text x={60} y={208} textAnchor="middle">
              {t.majority}
            </text>
            <text x={300} y={167} textAnchor="middle">
              {params.mode === 'consistency' ? t.minorityRefusing : t.minority}
            </text>
          </g>
        )}
        <text x={WIDTH / 2} y={STATUS_Y} textAnchor="middle" className="fill-foreground font-semibold">
          {status}
        </text>

        {last && requester && NODES[requester.node] && (
          <motion.circle
            key={state.clock}
            r={5}
            cx={requester.port}
            initial={{ cy: CLIENT.height, opacity: 1 }}
            animate={{ cy: NODES[requester.node]?.y, opacity: [1, 1, 0] }}
            className={TONE[OUTCOME_TONE[last.outcome]].fill}
          />
        )}
        {last &&
          messages(last, reachable(state, last.node ?? 0)).map(([start, end], index) => (
            <motion.circle
              key={`${state.clock}-${index}`}
              r={5}
              initial={{ cx: start.x, cy: start.y, opacity: 1 }}
              animate={{ cx: end.x, cy: end.y, opacity: [1, 1, 0] }}
              className={TONE[OUTCOME_TONE[last.outcome]].fill}
            />
          ))}
      </LabSvg>
      <LabLegend
        items={[
          { label: t.legend.sameValue, swatch: 'border-brand bg-brand/20' },
          { label: t.legend.accepted, swatch: 'border-success bg-success/20' },
          { label: t.legend.local, swatch: 'border-warning bg-warning/20' },
          { label: t.legend.refused, swatch: 'border-danger bg-danger/20' },
        ]}
      />
    </VisualLab>
  )
}
