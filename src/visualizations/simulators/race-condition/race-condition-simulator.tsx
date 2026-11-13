'use client'

import { motion } from 'motion/react'
import { format } from '@/lib/i18n/dictionary'
import type { Locale } from '@/lib/i18n/types'
import { useLocale } from '@/lib/i18n/use-locale'
import { cn } from '@/lib/utils'
import { entityColor } from '../../constants'
import { ChoiceParameter } from '../../primitives/choice-parameter'
import { LabSvg } from '../../primitives/lab-svg'
import { RangeParameter } from '../../primitives/range-parameter'
import { useSimulation } from '../../use-simulation'
import { VisualLab } from '../../visual-lab'
import { raceModel } from './simulation'
import { texts } from './texts'
import type { Operation, RaceState } from './types'

const WIDTH = 360
const HEIGHT = 190
const COLUMN_WIDTH = 120
const LINE_HEIGHT = 18
const REGISTER_Y = 136
const COUNTER = { x: 140, y: 40, width: 80, height: 48 }
const THREAD_NAMES = ['A', 'B']
const OPERATION_CODE: Record<Operation, string> = {
  acquire: 'lock()',
  read: 'r = counter',
  add: 'r = r + 1',
  write: 'counter = r',
  release: 'unlock()',
}

function columnX(thread: number) {
  return thread === 0 ? 0 : WIDTH - COLUMN_WIDTH
}

function registerPort(thread: number) {
  return { x: columnX(thread) + COLUMN_WIDTH / 2, y: REGISTER_Y }
}

const COUNTER_CENTER = { x: COUNTER.x + COUNTER.width / 2, y: COUNTER.y + COUNTER.height / 2 }
/** Values travel to the counter's bottom edge so the token never hides the digit. */
const COUNTER_PORT = { x: COUNTER_CENTER.x, y: COUNTER.y + COUNTER.height }

function describe(state: RaceState, t: (typeof texts)[Locale], expected: number, increments: number, finished: boolean) {
  if (finished) {
    return state.lostUpdates > 0
      ? format(t.finishedLost, { counter: state.counter, expected, lost: state.lostUpdates })
      : format(t.finishedOk, { counter: state.counter, expected })
  }
  const event = state.last
  if (!event) return format(t.start, { increments, expected })
  const name = THREAD_NAMES[event.thread] ?? ''
  const register = state.threads[event.thread]?.register ?? 0
  if (event.blocked) return format(t.blocked, { name, owner: THREAD_NAMES[state.lockOwner ?? 0] ?? '' })
  switch (event.operation) {
    case 'read':
      return format(t.read, { name, value: register })
    case 'add':
      return format(t.add, { name, value: register, counter: state.counter })
    case 'write':
      return format(event.lostUpdate ? t.lostUpdate : t.write, { name, value: register })
    case 'acquire':
      return format(t.acquire, { name })
    case 'release':
      return format(t.release, { name })
  }
}

/** Type C lab: two threads doing read-modify-write on a shared counter, with and without a mutex. */
export function RaceConditionSimulator() {
  const t = texts[useLocale()]
  const { params, state, setParams, playback } = useSimulation(raceModel, { mutex: false, increments: 1 })
  const opsPerIncrement = state.program.length / params.increments
  const event = state.last
  const transfer =
    event && !event.blocked && (event.operation === 'read' || event.operation === 'write')
      ? event.operation === 'read'
        ? { from: COUNTER_PORT, to: registerPort(event.thread) }
        : { from: registerPort(event.thread), to: COUNTER_PORT }
      : null

  return (
    <VisualLab
      title={t.title}
      description={t.description}
      fidelity="conceptual"
      playback={playback}
      explanation={describe(state, t, params.increments * state.threads.length, params.increments, playback.finished)}
      parameters={
        <div className="grid gap-4 sm:grid-cols-2">
          <ChoiceParameter
            label={t.mutex}
            value={params.mutex ? 'on' : 'off'}
            options={[
              { value: 'off', label: t.withoutMutex },
              { value: 'on', label: t.withMutex },
            ]}
            onChange={(value) => setParams({ ...params, mutex: value === 'on' })}
          />
          <RangeParameter
            label={t.increments}
            value={params.increments}
            min={1}
            max={3}
            onChange={(increments) => setParams({ ...params, increments })}
          />
        </div>
      }
    >
      <LabSvg width={WIDTH} height={HEIGHT} title={t.svgTitle} description={t.svgDescription}>
        {state.threads.map((thread, id) => {
          const x = columnX(id)
          const color = entityColor(id)
          const done = thread.pc >= state.program.length
          const block = Math.floor(Math.min(thread.pc, state.program.length - 1) / opsPerIncrement)
          const lines = state.program.slice(block * opsPerIncrement, (block + 1) * opsPerIncrement)
          const current = done ? -1 : thread.pc - block * opsPerIncrement
          const waiting = event?.blocked && event.thread === id
          return (
            <g key={id}>
              <text x={x + COLUMN_WIDTH / 2} y={14} textAnchor="middle" className="fill-foreground font-semibold">
                {format(t.thread, { name: THREAD_NAMES[id] ?? '' })}
              </text>
              {lines.map((operation, line) => (
                <g key={line}>
                  {line === current && (
                    <rect
                      x={x}
                      y={22 + line * LINE_HEIGHT}
                      width={COLUMN_WIDTH}
                      height={LINE_HEIGHT - 2}
                      rx={3}
                      className={cn(waiting ? 'fill-warning/20 stroke-warning' : `${color.fill} ${color.stroke}`)}
                    />
                  )}
                  <text
                    x={x + 8}
                    y={34 + line * LINE_HEIGHT}
                    className={cn('font-mono', line < current || done ? 'fill-muted-foreground' : 'fill-foreground')}
                  >
                    {OPERATION_CODE[operation]}
                  </text>
                </g>
              ))}
              <rect x={x} y={REGISTER_Y} width={COLUMN_WIDTH} height={26} rx={4} className="fill-surface stroke-border" />
              <text x={x + COLUMN_WIDTH / 2} y={REGISTER_Y + 17} textAnchor="middle" className="fill-foreground font-mono">
                {format(t.register, { value: thread.register ?? '–' })}
              </text>
            </g>
          )
        })}

        <text x={COUNTER_CENTER.x} y={COUNTER.y - 8} textAnchor="middle" className="fill-muted-foreground">
          {t.counter}
        </text>
        <rect
          {...COUNTER}
          rx={6}
          strokeWidth={2}
          className={cn('fill-surface', event?.lostUpdate ? 'stroke-danger' : 'stroke-border')}
        />
        <motion.text
          key={state.counter}
          x={COUNTER_CENTER.x}
          y={COUNTER_CENTER.y + 8}
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fill-foreground font-mono text-[22px] font-bold"
        >
          {state.counter}
        </motion.text>
        {params.mutex && (
          <g>
            <rect
              x={COUNTER.x}
              y={104}
              width={COUNTER.width}
              height={24}
              rx={4}
              className={cn('fill-surface', state.lockOwner === null ? 'stroke-border' : 'stroke-primary')}
            />
            <text x={COUNTER_CENTER.x} y={120} textAnchor="middle" className="fill-foreground font-mono text-[10.5px]">
              {state.lockOwner === null ? t.lockFree : format(t.lockHeld, { name: THREAD_NAMES[state.lockOwner] ?? '' })}
            </text>
          </g>
        )}
        {transfer && event && (
          <motion.circle
            key={state.step}
            r={6}
            initial={{ cx: transfer.from.x, cy: transfer.from.y }}
            animate={{ cx: transfer.to.x, cy: transfer.to.y }}
            className={`${entityColor(event.thread).stroke} fill-background`}
            strokeWidth={3}
          />
        )}
      </LabSvg>
    </VisualLab>
  )
}
