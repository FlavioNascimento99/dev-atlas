'use client'

import { motion } from 'motion/react'
import { format } from '@/lib/i18n/dictionary'
import { useLocale } from '@/lib/i18n/use-locale'
import { cn } from '@/lib/utils'
import { LabLegend } from '../../primitives/lab-legend'
import { LabSvg } from '../../primitives/lab-svg'
import { RangeParameter } from '../../primitives/range-parameter'
import { useSimulation } from '../../use-simulation'
import { VisualLab } from '../../visual-lab'
import {
  ackTick,
  ARRIVAL_TICKS,
  CONVERGENCE_TICK,
  HINT,
  inconsistencyWindow,
  LAST_TICK,
  quorumOverlaps,
  REPLICA_COUNT,
  replicationModel,
  updatedReplicas,
  worstCaseRead,
} from './simulation'
import { texts } from './texts'

type PropagationLabel = keyof (typeof texts)['en']['propagation']

const WIDTH = 360
const HEIGHT = 220
const OLD_VALUE = 5
const NEW_VALUE = 4
const WRITE_TICK = ARRIVAL_TICKS[0] ?? 1
const NAMES = ['A', 'B', 'C']
const WRITER = { x: 0, y: 2, width: 96, height: 52 }
const REPLICA = { x: 124, width: 106, height: 40 }
const REPLICA_Y = [8, 60, 112]
const READER = { x: 250, y: 50, width: 110, height: 60 }
const READER_PORT = { x: READER.x, y: READER.y + READER.height / 2 }
/** Replica A forwards the update along a bus drawn to the left of the replicas: one lane per receiver. */
const LANES = [null, { x: 112, y: 36 }, { x: 104, y: 42 }]
const LABEL_X = 98
const CELL = { width: 56, height: 22, y: 176 }
const MARK_Y = CELL.y - 6
const FOOTER_Y = HEIGHT - 6

const centerY = (replica: number) => (REPLICA_Y[replica] ?? 0) + REPLICA.height / 2
const tickX = (tick: number) => 30 + tick * 60

/** Corners of the path the update takes from A to the given replica. */
function lanePoints(replica: number) {
  const lane = LANES[replica]
  if (!lane) return null
  const y = centerY(replica)
  return [
    { x: REPLICA.x, y: lane.y },
    { x: lane.x, y: lane.y },
    { x: lane.x, y },
    { x: REPLICA.x, y },
  ]
}

function propagation(tick: number, replica: number): PropagationLabel | null {
  if (tick < WRITE_TICK) return null
  const hinted = replica === HINT.replica
  if (tick >= (ARRIVAL_TICKS[replica] ?? 0)) return hinted ? 'hintReplayed' : 'delivered'
  return hinted && tick >= HINT.tick ? 'hintPending' : 'inFlight'
}

/** Type C lab: a write spreading through three replicas, and how W and R decide whether a read can miss it. */
export function EventualConsistencySimulator() {
  const locale = useLocale()
  const t = texts[locale]
  const { params, state, setParams, playback } = useSimulation(replicationModel, { w: 1, r: 1 })
  const { tick } = state
  const { w, r } = params
  const updated = updatedReplicas(tick)
  const have = updated.filter(Boolean).length
  const written = tick >= WRITE_TICK
  const acked = tick >= ackTick(w)
  const read = worstCaseRead(tick, r)
  const staleWindow = inconsistencyWindow(params)
  const readTone = !acked ? 'stroke-border' : read.fresh ? 'stroke-success' : 'stroke-warning'
  const readLabel = !written
    ? format(t.readFresh, { value: OLD_VALUE })
    : !acked
      ? t.readPending
      : format(read.fresh ? t.readFresh : t.readStale, { value: read.fresh ? NEW_VALUE : OLD_VALUE })
  const names = new Intl.ListFormat(locale, { type: 'conjunction' }).format(read.replicas.map((index) => NAMES[index] ?? '').sort())
  const readExplanation = !written
    ? null
    : !acked
      ? format(t.pending, { have, w })
      : format(read.fresh ? t.fresh : t.stale, { w, r, names })

  return (
    <VisualLab
      title={t.title}
      description={t.description}
      fidelity="conceptual"
      playback={playback}
      explanation={
        <>
          <p>{t.ticks[tick]}</p>
          {readExplanation && <p className="mt-1">{readExplanation}</p>}
          <p className="mt-1 font-mono text-muted-foreground">
            {format(quorumOverlaps(params) ? t.overlap : t.noOverlap, { sum: w + r })}
          </p>
        </>
      }
      parameters={
        <div className="grid gap-4 sm:grid-cols-2">
          <RangeParameter label={t.w} value={w} min={1} max={REPLICA_COUNT} onChange={(value) => setParams({ ...params, w: value })} />
          <RangeParameter label={t.r} value={r} min={1} max={REPLICA_COUNT} onChange={(value) => setParams({ ...params, r: value })} />
        </div>
      }
    >
      <LabSvg width={WIDTH} height={HEIGHT} title={t.svgTitle} description={t.svgDescription}>
        <line
          x1={WRITER.width}
          y1={centerY(0)}
          x2={REPLICA.x}
          y2={centerY(0)}
          strokeWidth={1.5}
          className={written ? 'stroke-brand' : 'stroke-border'}
        />
        <rect
          x={WRITER.x + 1}
          y={WRITER.y}
          width={WRITER.width - 2}
          height={WRITER.height}
          rx={6}
          strokeWidth={written ? 2 : 1}
          className={cn('fill-surface', acked ? 'stroke-success' : written ? 'stroke-brand' : 'stroke-border')}
        />
        <text x={WRITER.width / 2} y={WRITER.y + 16} textAnchor="middle" className="fill-foreground font-semibold">
          {t.writer}
        </text>
        <text x={WRITER.width / 2} y={WRITER.y + 31} textAnchor="middle" className="fill-foreground font-mono">
          stock={NEW_VALUE}
        </text>
        {written && (
          <text x={WRITER.width / 2} y={WRITER.y + 45} textAnchor="middle" className="fill-foreground">
            {acked ? format(t.acked, { w }) : format(t.acksPending, { have, w })}
          </text>
        )}

        {updated.map((holdsWrite, index) => {
          const y = REPLICA_Y[index] ?? 0
          const points = lanePoints(index)
          const status = propagation(tick, index)
          const arriving = tick === ARRIVAL_TICKS[index]
          return (
            <g key={index}>
              {points && (
                <path
                  d={`M${points.map((point) => `${point.x} ${point.y}`).join(' L')}`}
                  strokeWidth={1.5}
                  strokeDasharray={holdsWrite ? undefined : '4 3'}
                  className={cn('fill-none', holdsWrite ? 'stroke-brand' : written ? 'stroke-muted-foreground' : 'stroke-border')}
                />
              )}
              {points && status && (
                <text x={LABEL_X} y={y + REPLICA.height / 2 + 4} textAnchor="end" className={holdsWrite ? 'fill-foreground' : 'fill-muted-foreground'}>
                  {t.propagation[status]}
                </text>
              )}
              {acked && read.replicas.includes(index) && (
                <line
                  x1={REPLICA.x + REPLICA.width}
                  y1={y + REPLICA.height / 2}
                  x2={READER_PORT.x}
                  y2={READER_PORT.y}
                  strokeWidth={2}
                  className={holdsWrite ? 'stroke-success' : 'stroke-warning'}
                />
              )}
              <rect
                x={REPLICA.x}
                y={y}
                width={REPLICA.width}
                height={REPLICA.height}
                rx={6}
                strokeWidth={arriving ? 2 : 1}
                className={cn('fill-background', arriving ? 'stroke-brand' : 'stroke-muted-foreground')}
              />
              <text x={REPLICA.x + 14} y={y + 25} textAnchor="middle" className="fill-foreground text-[12px] font-semibold">
                {NAMES[index]}
              </text>
              <motion.g key={String(holdsWrite)} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect
                  x={REPLICA.x + 28}
                  y={y + 8}
                  width={70}
                  height={24}
                  rx={5}
                  className={holdsWrite ? 'fill-brand/20 stroke-brand' : 'fill-surface stroke-muted-foreground'}
                />
                <text x={REPLICA.x + 63} y={y + 24} textAnchor="middle" className="fill-foreground font-mono text-[12px] font-bold">
                  stock={holdsWrite ? NEW_VALUE : OLD_VALUE}
                </text>
              </motion.g>
              {points && arriving && (
                <motion.circle
                  key={tick}
                  r={5}
                  initial={{ cx: points[0]?.x, cy: points[0]?.y, opacity: 1 }}
                  animate={{ cx: points.map((point) => point.x), cy: points.map((point) => point.y), opacity: [1, 1, 1, 0] }}
                  className="fill-brand"
                />
              )}
            </g>
          )
        })}
        {tick === WRITE_TICK && (
          <motion.circle
            r={5}
            cy={centerY(0)}
            initial={{ cx: WRITER.width, opacity: 1 }}
            animate={{ cx: REPLICA.x, opacity: [1, 1, 0] }}
            className="fill-brand"
          />
        )}

        <rect
          x={READER.x}
          y={READER.y}
          width={READER.width - 1}
          height={READER.height}
          rx={6}
          strokeWidth={acked ? 2 : 1}
          className={cn('fill-surface', readTone)}
        />
        <text x={READER.x + READER.width / 2} y={READER.y + 17} textAnchor="middle" className="fill-foreground font-semibold">
          {t.reader}
        </text>
        <text x={READER.x + READER.width / 2} y={READER.y + 33} textAnchor="middle" className="fill-muted-foreground">
          {format(t.worstCase, { r })}
        </text>
        <text x={READER.x + READER.width / 2} y={READER.y + 49} textAnchor="middle" className="fill-foreground">
          {readLabel}
        </text>

        <text x={tickX(ackTick(w))} y={MARK_Y} textAnchor="middle" className={acked ? 'fill-foreground font-semibold' : 'fill-muted-foreground'}>
          {format(t.ackMark, { w })}
        </text>
        {Array.from({ length: LAST_TICK + 1 }, (_, cell) => {
          const stale = staleWindow !== null && cell >= staleWindow.from && cell <= staleWindow.to
          return (
            <g key={cell}>
              <rect
                x={tickX(cell) - CELL.width / 2}
                y={CELL.y}
                width={CELL.width}
                height={CELL.height}
                rx={4}
                className={
                  stale
                    ? 'fill-warning/20 stroke-warning'
                    : cell >= CONVERGENCE_TICK
                      ? 'fill-success/20 stroke-success'
                      : 'fill-surface stroke-border'
                }
              />
              <text x={tickX(cell)} y={CELL.y + 15} textAnchor="middle" className="fill-foreground font-mono">
                t{cell}
              </text>
            </g>
          )
        })}
        <motion.rect
          initial={false}
          animate={{ x: tickX(tick) - CELL.width / 2 - 2 }}
          y={CELL.y - 2}
          width={CELL.width + 4}
          height={CELL.height + 4}
          rx={6}
          strokeWidth={2.5}
          className="fill-none stroke-primary"
        />
        <text x={2} y={FOOTER_Y} className="fill-foreground">
          {staleWindow
            ? format(t.windowLabel, {
                range: staleWindow.from === staleWindow.to ? `t${staleWindow.from}` : `t${staleWindow.from}–t${staleWindow.to}`,
              })
            : t.noWindow}
        </text>
        <text
          x={tickX(CONVERGENCE_TICK)}
          y={FOOTER_Y}
          textAnchor="middle"
          className={tick >= CONVERGENCE_TICK ? 'fill-foreground font-semibold' : 'fill-muted-foreground'}
        >
          {t.converged}
        </text>
      </LabSvg>
      <LabLegend
        items={[
          { label: t.legend.old, swatch: 'border-muted-foreground bg-surface' },
          { label: t.legend.fresh, swatch: 'border-brand bg-brand/20' },
          { label: t.legend.window, swatch: 'border-warning bg-warning/20' },
          { label: t.legend.converged, swatch: 'border-success bg-success/20' },
        ]}
      />
    </VisualLab>
  )
}
