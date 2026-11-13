'use client'

import { motion } from 'motion/react'
import { format } from '@/lib/i18n/dictionary'
import { useLocale } from '@/lib/i18n/use-locale'
import { cn } from '@/lib/utils'
import { ChoiceParameter } from '../../primitives/choice-parameter'
import { LabLegend } from '../../primitives/lab-legend'
import { LabSvg } from '../../primitives/lab-svg'
import { useSimulation } from '../../use-simulation'
import { VisualLab } from '../../visual-lab'
import { EDA_CONSUMERS, EDA_WORK, fanOutModel, initialConsumers } from './script'
import { texts } from './texts'
import type { ConsumerStatus } from './types'

const WIDTH = 360
const HEIGHT = 160
const PRODUCER = { x: 0, y: 55, width: 84, height: 50 }
const BROKER = { x: 112, y: 8, width: 120, height: 144 }
const SLOT = { x: 206, width: 20, height: 16 }
const CONSUMER = { x: 264, width: 96, height: 40, row: 50 }
const BAR = { x: CONSUMER.x + 8, width: CONSUMER.width - 16, height: 4 }
const TOKEN = { width: 14, height: 12 }
const PRODUCER_Y = PRODUCER.y + PRODUCER.height / 2
const BROKER_END = BROKER.x + BROKER.width

const CONSUMER_STYLE: Record<ConsumerStatus, { box: string; text: string }> = {
  idle: { box: 'stroke-border', text: 'fill-muted-foreground' },
  offline: { box: 'stroke-danger', text: 'fill-danger' },
  processing: { box: 'stroke-primary', text: 'fill-foreground' },
  done: { box: 'stroke-success', text: 'fill-success' },
}

/** Vertical center of a consumer and of the broker slot that holds its copy. */
function rowY(index: number) {
  return BROKER.y + 22 + index * CONSUMER.row
}

/** Type B lab: one event fanned out by a broker to independent consumers, one of which may be down. */
export function EventFanOut() {
  const t = texts[useLocale()]
  const { params, state, setParams, playback } = useSimulation(fanOutModel, { consumerDown: false })
  const step = state.steps[state.index - 1]
  const consumers = step?.consumers ?? initialConsumers(params)
  const retained = step?.retained ?? []
  const producerStatus = !step ? 'idle' : step.accepted ? 'accepted' : 'publishing'

  let explanation = params.consumerDown ? t.startDown : t.start
  if (step) {
    const othersFinishing = step.id === 'inventoryDone' || step.id === 'billingDone'
    explanation = othersFinishing && retained.length > 0 ? `${t.steps[step.id]} ${t.retainedNote}` : t.steps[step.id]
  }

  return (
    <VisualLab
      title={t.title}
      description={t.description}
      fidelity="conceptual"
      playback={playback}
      explanation={explanation}
      parameters={
        <ChoiceParameter
          label={t.notificationService}
          value={params.consumerDown ? 'offline' : 'online'}
          options={[
            { value: 'online', label: t.online },
            { value: 'offline', label: t.offline },
          ]}
          onChange={(choice) => setParams({ consumerDown: choice === 'offline' })}
        />
      }
    >
      <LabSvg width={WIDTH} height={HEIGHT} title={t.svgTitle} description={t.svgDescription}>
        <g className="fill-muted-foreground stroke-muted-foreground">
          <line x1={PRODUCER.width} y1={PRODUCER_Y} x2={BROKER.x - 6} y2={PRODUCER_Y} strokeWidth={1.5} />
          <path d={`M${BROKER.x} ${PRODUCER_Y} l-6 -3 v6 z`} stroke="none" />
        </g>
        <rect {...PRODUCER} rx={6} className={cn('fill-surface', producerStatus === 'accepted' ? 'stroke-success' : 'stroke-primary')} />
        <text x={PRODUCER.width / 2} y={PRODUCER_Y - 3} textAnchor="middle" className="fill-foreground font-semibold">
          {t.producer}
        </text>
        <text
          x={PRODUCER.width / 2}
          y={PRODUCER_Y + 12}
          textAnchor="middle"
          className={cn('text-[10px]', producerStatus === 'accepted' ? 'fill-success' : 'fill-muted-foreground')}
        >
          {t.producerStatus[producerStatus]}
        </text>

        <rect {...BROKER} rx={6} className="fill-subtle stroke-border" />
        <text x={BROKER.x + 8} y={BROKER.y + 18} className="fill-foreground font-semibold">
          {t.broker}
        </text>
        <text x={BROKER.x + 8} y={BROKER.y + 33} className="fill-muted-foreground font-mono text-[10px]">
          OrderPlaced
        </text>
        {retained.length > 0 && (
          <text x={BROKER.x + 8} y={BROKER.y + BROKER.height - 10} className="fill-warning text-[10px] font-semibold">
            {format(t.waiting, { count: retained.length })}
          </text>
        )}

        {EDA_CONSUMERS.map((id, index) => {
          const y = rowY(index)
          const top = y - CONSUMER.height / 2
          const { status, progress } = consumers[id]
          const style = CONSUMER_STYLE[status]
          const offline = status === 'offline'
          return (
            <g key={id}>
              <rect
                x={SLOT.x}
                y={y - SLOT.height / 2}
                width={SLOT.width}
                height={SLOT.height}
                rx={3}
                strokeDasharray="3 2"
                className="fill-background stroke-border"
              />
              {retained.includes(id) && (
                <motion.rect
                  x={SLOT.x + 3}
                  y={y - TOKEN.height / 2}
                  width={TOKEN.width}
                  height={TOKEN.height}
                  rx={2}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fill-brand/30 stroke-brand"
                />
              )}
              <g className={offline ? 'fill-danger stroke-danger' : 'fill-muted-foreground stroke-muted-foreground'}>
                <line x1={BROKER_END} y1={y} x2={CONSUMER.x - 6} y2={y} strokeWidth={1.5} strokeDasharray={offline ? '3 3' : undefined} />
                <path d={`M${CONSUMER.x} ${y} l-6 -3 v6 z`} stroke="none" />
              </g>
              <rect
                x={CONSUMER.x}
                y={top}
                width={CONSUMER.width}
                height={CONSUMER.height}
                rx={6}
                strokeWidth={status === 'processing' ? 2 : 1}
                strokeDasharray={offline ? '4 3' : undefined}
                className={cn('fill-surface', style.box)}
              />
              <text x={BAR.x} y={top + 15} className="fill-foreground font-semibold">
                {t.consumers[id]}
              </text>
              <text x={BAR.x} y={top + 27} className={cn('text-[10px]', style.text)}>
                {t.status[status]}
              </text>
              <rect x={BAR.x} y={top + 31} width={BAR.width} height={BAR.height} rx={2} className="fill-border" />
              <motion.rect
                x={BAR.x}
                y={top + 31}
                height={BAR.height}
                rx={2}
                initial={false}
                animate={{ width: (progress / EDA_WORK[id]) * BAR.width }}
                className={status === 'done' ? 'fill-success' : 'fill-primary'}
              />
            </g>
          )
        })}

        {step?.moving.map((hop) => {
          const publishing = hop === 'publish'
          const y = publishing ? PRODUCER_Y : rowY(EDA_CONSUMERS.indexOf(hop))
          return (
            <motion.rect
              key={`${state.index}-${hop}`}
              y={y - TOKEN.height / 2}
              width={TOKEN.width}
              height={TOKEN.height}
              rx={2}
              initial={{ x: publishing ? PRODUCER.width : SLOT.x + 3 }}
              animate={{ x: publishing ? BROKER.x - TOKEN.width / 2 : CONSUMER.x - TOKEN.width - 8 }}
              className="fill-brand stroke-brand"
            />
          )
        })}
      </LabSvg>
      <LabLegend
        items={[
          { label: t.legend.event, swatch: 'border-brand bg-brand/30' },
          { label: t.legend.processing, swatch: 'border-primary bg-primary' },
          { label: t.legend.done, swatch: 'border-success bg-success' },
          { label: t.legend.offline, swatch: 'border-dashed border-danger' },
        ]}
      />
    </VisualLab>
  )
}
