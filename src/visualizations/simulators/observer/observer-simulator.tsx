'use client'

import { motion } from 'motion/react'
import { format } from '@/lib/i18n/dictionary'
import { useLocale } from '@/lib/i18n/use-locale'
import { cn } from '@/lib/utils'
import { ChoiceParameter } from '../../primitives/choice-parameter'
import { LabSvg } from '../../primitives/lab-svg'
import { useSimulation } from '../../use-simulation'
import { VisualLab } from '../../visual-lab'
import { isStale, OBSERVERS, observerModel, setSubscribed } from './simulation'
import { texts } from './texts'

const WIDTH = 360
const HEIGHT = 212
const CALLER = { x: 0, y: 8, width: 88, height: 44 }
const CELL = { x: 124, y: 8, width: 160, height: 44 }
const OBSERVER = { y: 112, width: 112, height: 66, gap: 12 }
const LEGEND_Y = 200
const CELL_PORT = { x: CELL.x + CELL.width / 2, y: CELL.y + CELL.height }
const CALL_Y = CALLER.y + CALLER.height / 2

function observerX(index: number) {
  return index * (OBSERVER.width + OBSERVER.gap)
}

/** Type C lab: a subject notifying, synchronously and in subscription order, only the observers currently subscribed. */
export function ObserverSimulator() {
  const t = texts[useLocale()]
  const { state, update, playback } = useSimulation(observerModel, null)
  const { value, phase, queue, current, listeners } = state
  const waiting = phase === 'changed' || phase === 'notifying'
  const stale = OBSERVERS.filter((id) => isStale(state, id))

  let explanation = t.returned
  if (phase === 'idle') explanation = format(t.idle, { value })
  else if (phase === 'changed') explanation = queue.length > 0 ? format(t.changed, { value, list: queue.join(', ') }) : format(t.changedNobody, { value })
  else if (current) explanation = format(t.notifying, { name: current, value, remaining: queue.join(', ') || t.none })

  return (
    <VisualLab
      title={t.title}
      description={t.description}
      fidelity="faithful"
      playback={playback}
      explanation={
        <>
          <p>{explanation}</p>
          {stale.length > 0 && <p className="mt-1 text-muted-foreground">{format(t.staleNote, { names: stale.join(', ') })}</p>}
        </>
      }
      parameters={
        <div className="grid gap-4 sm:grid-cols-3">
          {OBSERVERS.map((id) => (
            <ChoiceParameter
              key={id}
              label={id}
              value={listeners.includes(id) ? 'on' : 'off'}
              options={[
                { value: 'on', label: t.subscribed },
                { value: 'off', label: t.unsubscribed },
              ]}
              onChange={(choice) => update((subject) => setSubscribed(subject, id, choice === 'on'))}
            />
          ))}
        </div>
      }
    >
      <LabSvg width={WIDTH} height={HEIGHT} title={t.svgTitle} description={t.svgDescription}>
        <rect {...CALLER} rx={6} className={cn('fill-surface', waiting ? 'stroke-warning' : 'stroke-border')} />
        <text x={CALLER.width / 2} y={CALLER.y + 18} textAnchor="middle" className="fill-foreground font-semibold">
          {t.caller}
        </text>
        <text
          x={CALLER.width / 2}
          y={CALLER.y + 34}
          textAnchor="middle"
          className={cn('text-[10px]', waiting ? 'fill-warning' : phase === 'returned' ? 'fill-success' : 'fill-muted-foreground')}
        >
          {t.callerStatus[phase]}
        </text>
        <g className={phase === 'changed' ? 'fill-primary stroke-primary' : 'fill-muted-foreground stroke-muted-foreground'}>
          <line x1={CALLER.width} y1={CALL_Y} x2={CELL.x - 7} y2={CALL_Y} strokeWidth={1.5} />
          <path d={`M${CELL.x} ${CALL_Y} l-7 -3.5 v7 z`} stroke="none" />
        </g>

        <rect {...CELL} rx={6} strokeWidth={waiting ? 2 : 1} className="fill-surface stroke-primary" />
        <text x={CELL_PORT.x} y={CELL.y + 17} textAnchor="middle" className="fill-foreground font-semibold">
          {t.subject}
        </text>
        <text x={CELL_PORT.x} y={CELL.y + 35} textAnchor="middle" className="fill-foreground font-mono text-[13px] font-semibold">
          value = {value}
        </text>

        {OBSERVERS.map((id, index) => {
          const x = observerX(index)
          const center = x + OBSERVER.width / 2
          const position = listeners.indexOf(id)
          const subscribed = position >= 0
          const active = current === id
          const outdated = isStale(state, id)
          return (
            <g key={id}>
              <line
                x1={CELL_PORT.x}
                y1={CELL_PORT.y}
                x2={center}
                y2={OBSERVER.y}
                strokeWidth={active ? 2 : 1.5}
                strokeDasharray={subscribed ? undefined : '3 4'}
                className={active ? 'stroke-primary' : subscribed ? 'stroke-muted-foreground' : 'stroke-border'}
              />
              <rect
                x={x}
                y={OBSERVER.y}
                width={OBSERVER.width}
                height={OBSERVER.height}
                rx={6}
                strokeWidth={active ? 2 : 1}
                strokeDasharray={subscribed ? undefined : '3 4'}
                className={cn('fill-surface', active ? 'stroke-primary' : outdated ? 'stroke-warning' : 'stroke-border')}
              />
              <text x={center} y={OBSERVER.y + 17} textAnchor="middle" className="fill-foreground font-mono font-semibold">
                {id}
              </text>
              <text
                x={center}
                y={OBSERVER.y + 38}
                textAnchor="middle"
                className={cn('font-mono text-[15px] font-semibold', outdated ? 'fill-warning' : 'fill-foreground')}
              >
                {state.seen[id]}
                {outdated && <tspan className="font-sans text-[10px]"> · {t.stale}</tspan>}
              </text>
              <text x={center} y={OBSERVER.y + 56} textAnchor="middle" className="fill-muted-foreground text-[10px]">
                {subscribed ? format(t.position, { n: position + 1 }) : t.notSubscribed}
              </text>
            </g>
          )
        })}

        {current && (
          <motion.circle
            key={`${value}-${current}`}
            r={6}
            initial={{ cx: CELL_PORT.x, cy: CELL_PORT.y }}
            animate={{ cx: observerX(OBSERVERS.indexOf(current)) + OBSERVER.width / 2, cy: OBSERVER.y }}
            className="fill-primary"
          />
        )}

        <g className="fill-muted-foreground text-[10px]">
          <line x1={0} y1={LEGEND_Y} x2={18} y2={LEGEND_Y} strokeWidth={1.5} className="stroke-muted-foreground" />
          <text x={24} y={LEGEND_Y + 3.5}>
            {t.legendSubscribed}
          </text>
          <line x1={120} y1={LEGEND_Y} x2={138} y2={LEGEND_Y} strokeWidth={1.5} strokeDasharray="3 4" className="stroke-muted-foreground" />
          <text x={144} y={LEGEND_Y + 3.5}>
            {t.legendUnsubscribed}
          </text>
          <circle cx={254} cy={LEGEND_Y} r={5} className="fill-primary" />
          <text x={264} y={LEGEND_Y + 3.5}>
            {t.legendNotification}
          </text>
        </g>
      </LabSvg>
    </VisualLab>
  )
}
