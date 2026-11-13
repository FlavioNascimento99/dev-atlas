'use client'

import { motion } from 'motion/react'
import { format, getDictionary } from '@/lib/i18n/dictionary'
import { useLocale } from '@/lib/i18n/use-locale'
import { cn } from '@/lib/utils'
import { LabSvg } from '../../primitives/lab-svg'
import { RangeParameter } from '../../primitives/range-parameter'
import { useSimulation } from '../../use-simulation'
import { VisualLab } from '../../visual-lab'
import { cacheModel, hitRatio } from './simulation'

const WIDTH = 360
const MAX_CAPACITY = 6
const SLOT = { x: 130, top: 22, width: 100, height: 20, row: 24 }
const STATS_Y = SLOT.top + MAX_CAPACITY * SLOT.row + 22
const HEIGHT = STATS_Y + 8
const MIDDLE = SLOT.top + (MAX_CAPACITY * SLOT.row) / 2
const APP = { x: 0, width: 64, height: 40 }
const DATABASE = { x: WIDTH - 72, width: 72, height: 40 }

/** Type C lab: cache-aside reads with hits, misses and least-recently-used eviction. */
export function CacheVisualizer() {
  const locale = useLocale()
  const t = getDictionary(locale).labs.cache
  const { params, state, setParams, playback } = useSimulation(cacheModel, { capacity: 3, keys: 8 })
  const { last } = state
  const keyName = (key: number) => format(t.key, { n: key + 1 })
  const ratio = new Intl.NumberFormat(locale, { style: 'percent' }).format(hitRatio(state))
  const stats = format(t.stats, { hits: state.hits, misses: state.misses, ratio })
  const slotY = (index: number) => SLOT.top + index * SLOT.row
  const appEdge = APP.x + APP.width
  const cacheEdge = SLOT.x
  const databaseEdge = DATABASE.x

  let explanation = format(t.start, { capacity: params.capacity, keys: params.keys })
  if (last) {
    explanation = format(last.hit ? t.hit : t.miss, { key: last.key + 1 })
    if (last.evicted !== null) explanation += ` ${format(t.evicted, { evicted: last.evicted + 1 })}`
  }

  return (
    <VisualLab
      title={t.title}
      description={t.description}
      fidelity="faithful"
      playback={playback}
      explanation={
        <>
          <p>{explanation}</p>
          <p className="mt-1 font-mono text-muted-foreground">{stats}</p>
        </>
      }
      parameters={
        <div className="grid gap-4 sm:grid-cols-2">
          <RangeParameter
            label={t.capacity}
            value={params.capacity}
            min={2}
            max={MAX_CAPACITY}
            onChange={(capacity) => setParams({ ...params, capacity })}
          />
          <RangeParameter label={t.keys} value={params.keys} min={4} max={12} onChange={(keys) => setParams({ ...params, keys })} />
        </div>
      }
    >
      <LabSvg width={WIDTH} height={HEIGHT} title={t.svgTitle} description={t.svgDescription}>
        <line x1={appEdge} y1={MIDDLE} x2={cacheEdge} y2={MIDDLE} className="stroke-border" strokeDasharray="4 3" />
        <line x1={SLOT.x + SLOT.width} y1={MIDDLE} x2={databaseEdge} y2={MIDDLE} className="stroke-border" strokeDasharray="4 3" />
        <rect x={APP.x} y={MIDDLE - APP.height / 2} width={APP.width} height={APP.height} rx={6} className="fill-surface stroke-primary" />
        <text x={APP.width / 2} y={MIDDLE + 4} textAnchor="middle" className="fill-foreground font-semibold">
          {t.app}
        </text>
        <rect
          x={DATABASE.x}
          y={MIDDLE - DATABASE.height / 2}
          width={DATABASE.width}
          height={DATABASE.height}
          rx={6}
          className="fill-surface stroke-border"
        />
        <text x={DATABASE.x + DATABASE.width / 2} y={MIDDLE + 4} textAnchor="middle" className="fill-foreground text-[10px] font-semibold">
          {t.database}
        </text>

        <text x={SLOT.x + SLOT.width / 2} y={SLOT.top - 8} textAnchor="middle" className="fill-foreground font-semibold">
          {t.cache}
        </text>
        <text x={SLOT.x - 4} y={slotY(0) + 14} textAnchor="end" className="fill-muted-foreground text-[9px]">
          {t.mostRecent}
        </text>
        <text x={SLOT.x - 4} y={slotY(params.capacity - 1) + 14} textAnchor="end" className="fill-muted-foreground text-[9px]">
          {t.leastRecent}
        </text>
        {Array.from({ length: params.capacity }, (_, index) => (
          <rect
            key={index}
            x={SLOT.x}
            y={slotY(index)}
            width={SLOT.width}
            height={SLOT.height}
            rx={3}
            className="fill-surface stroke-border"
            strokeDasharray="3 2"
          />
        ))}
        {state.entries.map((key, index) => {
          const current = last?.key === key
          return (
            <motion.g key={key} initial={{ y: slotY(0), opacity: 0 }} animate={{ y: slotY(index), opacity: 1 }}>
              <rect
                x={SLOT.x}
                width={SLOT.width}
                height={SLOT.height}
                rx={3}
                strokeWidth={current ? 2 : 1}
                className={cn(
                  'fill-background',
                  current ? (last.hit ? 'stroke-success' : 'stroke-warning') : 'stroke-muted-foreground',
                )}
              />
              <text x={SLOT.x + SLOT.width / 2} y={14} textAnchor="middle" className="fill-foreground font-mono">
                {keyName(key)}
              </text>
            </motion.g>
          )
        })}

        {last && (
          <g>
            <motion.circle
              key={state.tick}
              r={6}
              cy={MIDDLE}
              initial={{ cx: appEdge }}
              animate={{
                cx: last.hit ? [appEdge, cacheEdge] : [appEdge, cacheEdge, databaseEdge, SLOT.x + SLOT.width],
              }}
              className={last.hit ? 'fill-success' : 'fill-warning'}
            />
            <text
              x={APP.width / 2}
              y={MIDDLE - APP.height / 2 - 8}
              textAnchor="middle"
              className="fill-foreground font-semibold"
            >
              {keyName(last.key)} · {last.hit ? t.hitLabel : t.missLabel}
            </text>
          </g>
        )}
        <text x={WIDTH / 2} y={STATS_Y} textAnchor="middle" className="fill-muted-foreground font-mono text-[10px]">
          {stats}
        </text>
      </LabSvg>
    </VisualLab>
  )
}
