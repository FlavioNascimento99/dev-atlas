'use client'

import { motion } from 'motion/react'
import { format } from '@/lib/i18n/dictionary'
import { useLocale } from '@/lib/i18n/use-locale'
import { cn } from '@/lib/utils'
import { LabSvg } from '../../primitives/lab-svg'
import { RangeParameter } from '../../primitives/range-parameter'
import { useSimulation } from '../../use-simulation'
import { VisualLab } from '../../visual-lab'
import { consumptionCapacity, HISTORY_LENGTH, QUEUE_CAPACITY, queueModel, queueTrend } from './simulation'
import { texts } from './texts'

const WIDTH = 360
const HEIGHT = 228
const PRODUCER = { x: 0, y: 34, width: 62, height: 40 }
const SLOT = { x: 70, y: 40, width: 16, height: 28, gap: 2 }
const CONSUMER = { x: 296, width: 64, row: 26, top: 22 }
const CHART = { x: 0, y: 160, width: WIDTH, height: 60 }

function slotX(index: number) {
  return SLOT.x + index * (SLOT.width + SLOT.gap)
}

/** Type C lab: a producer, a bounded queue and consumers, showing queue growth and backpressure. */
export function MessageQueueVisualizer() {
  const locale = useLocale()
  const t = texts[locale]
  const { params, state, setParams, playback } = useSimulation(queueModel, {
    productionRate: 2,
    consumers: 2,
    processingTime: 2,
  })

  const trend = queueTrend(state, params)
  const capacity = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(consumptionCapacity(params))
  const summary =
    state.tick === 0
      ? format(t.start, { rate: params.productionRate, capacity })
      : format(t.moment, { tick: state.tick, consumed: state.consumed, rejected: state.rejected, queued: state.queue.length })
  const chartPoints = state.history
    .map((length, index) => {
      const x = CHART.x + (index / (HISTORY_LENGTH - 1)) * CHART.width
      const y = CHART.y + CHART.height - (length / QUEUE_CAPACITY) * CHART.height
      return `${x},${y}`
    })
    .join(' ')
  const queueEnd = slotX(QUEUE_CAPACITY) - SLOT.gap

  return (
    <VisualLab
      title={t.title}
      description={t.description}
      fidelity="conceptual"
      playback={playback}
      explanation={
        <>
          <p>{summary}</p>
          <p className={cn('mt-1', trend === 'full' || trend === 'growing' ? 'text-danger' : 'text-muted-foreground')}>
            {t.trends[trend]}
          </p>
        </>
      }
      parameters={
        <div className="grid gap-4 sm:grid-cols-3">
          <RangeParameter
            label={t.productionRate}
            value={params.productionRate}
            min={1}
            max={4}
            onChange={(productionRate) => setParams({ ...params, productionRate })}
          />
          <RangeParameter
            label={t.consumers}
            value={params.consumers}
            min={1}
            max={4}
            onChange={(consumers) => setParams({ ...params, consumers })}
          />
          <RangeParameter
            label={t.processingTime}
            value={params.processingTime}
            min={1}
            max={5}
            onChange={(processingTime) => setParams({ ...params, processingTime })}
          />
        </div>
      }
    >
      <LabSvg width={WIDTH} height={HEIGHT} title={t.svgTitle} description={t.svgDescription}>
        <rect {...PRODUCER} rx={6} className="fill-surface stroke-primary" />
        <text x={PRODUCER.width / 2} y={PRODUCER.y + 18} textAnchor="middle" className="fill-foreground font-semibold">
          {t.producer}
        </text>
        <text x={PRODUCER.width / 2} y={PRODUCER.y + 32} textAnchor="middle" className="fill-muted-foreground text-[10.5px]">
          +{params.productionRate}
        </text>

        <text x={SLOT.x} y={SLOT.y - 8} className={cn(trend === 'full' ? 'fill-danger' : 'fill-foreground', 'font-semibold')}>
          {format(t.queue, { length: state.queue.length, capacity: QUEUE_CAPACITY })}
        </text>
        {Array.from({ length: QUEUE_CAPACITY }, (_, index) => (
          <rect
            key={index}
            x={slotX(index)}
            y={SLOT.y}
            width={SLOT.width}
            height={SLOT.height}
            rx={2}
            className="fill-surface stroke-border"
          />
        ))}
        {state.queue.map((message, index) => (
          <motion.rect
            key={message}
            y={SLOT.y + 2}
            width={SLOT.width - 4}
            height={SLOT.height - 4}
            rx={2}
            initial={{ x: PRODUCER.width - SLOT.width, opacity: 0 }}
            animate={{ x: slotX(index) + 2, opacity: 1 }}
            className="fill-brand/30 stroke-brand"
          />
        ))}
        <line x1={PRODUCER.width} y1={SLOT.y + 14} x2={SLOT.x - 2} y2={SLOT.y + 14} className="stroke-border" />
        <line x1={queueEnd} y1={SLOT.y + 14} x2={CONSUMER.x - 2} y2={SLOT.y + 14} className="stroke-border" />

        {state.consumers.map((consumer, index) => {
          const y = CONSUMER.top + index * CONSUMER.row
          const progress =
            consumer.message === null ? 0 : (params.processingTime - consumer.remaining + 1) / params.processingTime
          return (
            <g key={index}>
              <text x={CONSUMER.x} y={y + 9} className="fill-foreground text-[10.5px] font-semibold">
                {format(t.consumer, { n: index + 1 })}
                {consumer.message !== null && <tspan className="fill-muted-foreground font-normal"> #{consumer.message + 1}</tspan>}
              </text>
              <rect x={CONSUMER.x} y={y + 13} width={CONSUMER.width} height={7} rx={2} className="fill-surface" />
              <motion.rect
                x={CONSUMER.x}
                y={y + 13}
                height={7}
                rx={2}
                initial={false}
                animate={{ width: progress * CONSUMER.width }}
                className="fill-highlight"
              />
            </g>
          )
        })}

        <text x={CHART.x} y={CHART.y - 8} className="fill-muted-foreground text-[10.5px]">
          {t.history}
        </text>
        <rect {...CHART} className="fill-subtle stroke-border" />
        <polyline points={chartPoints} fill="none" strokeWidth={2} className="stroke-primary" />
      </LabSvg>
    </VisualLab>
  )
}
