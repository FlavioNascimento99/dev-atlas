'use client'

import { motion } from 'motion/react'
import { format, getDictionary } from '@/lib/i18n/dictionary'
import { useLocale } from '@/lib/i18n/use-locale'
import { entityColor } from '../../constants'
import { ChoiceParameter } from '../../primitives/choice-parameter'
import { LabSvg } from '../../primitives/lab-svg'
import { RangeParameter } from '../../primitives/range-parameter'
import { useSimulation } from '../../use-simulation'
import { VisualLab } from '../../visual-lab'
import { balancerModel } from './simulation'
import type { Strategy } from './types'

const WIDTH = 360
const ROW_HEIGHT = 38
const TOP = 6
const BALANCER = { x: 2, width: 92, height: 40 }
const SERVER_X = 150
const BAR_X = 176
const BAR_WIDTH = WIDTH - BAR_X - 2
/** Active connections that fill a bar; busier servers are capped visually, the label keeps the exact count. */
const BAR_CAPACITY = 12
const STRATEGIES: Strategy[] = ['round-robin', 'least-connections', 'random']

/** Type C lab: requests distributed over servers by round-robin, least-connections or random selection. */
export function LoadBalancerSimulator() {
  const locale = useLocale()
  const t = getDictionary(locale).labs.balancer
  const { params, state, setParams, playback } = useSimulation(balancerModel, {
    servers: 4,
    rate: 2,
    strategy: 'round-robin',
  })

  const height = TOP * 2 + params.servers * ROW_HEIGHT
  const middle = height / 2
  const rowTop = (server: number) => TOP + server * ROW_HEIGHT
  const rowMiddle = (server: number) => rowTop(server) + 12
  const serverName = (server: number) => format(t.server, { n: server + 1 })
  const targets = new Set(state.assignments.map((assignment) => assignment.server))
  const loads = state.servers.map((server) => server.active.length)

  const explanation =
    state.tick === 0
      ? format(t.start, { rate: params.rate })
      : format(t.moment, {
          tick: state.tick,
          targets: new Intl.ListFormat(locale).format([...targets].sort((a, b) => a - b).map(serverName)),
          min: Math.min(...loads),
          max: Math.max(...loads),
        })

  return (
    <VisualLab
      title={t.title}
      description={t.description}
      fidelity="faithful"
      playback={playback}
      explanation={
        <>
          <p>{explanation}</p>
          <p className="mt-1 text-muted-foreground">{t.hints[params.strategy]}</p>
        </>
      }
      parameters={
        <div className="grid gap-4 sm:grid-cols-2">
          <RangeParameter
            label={t.servers}
            value={params.servers}
            min={2}
            max={6}
            onChange={(servers) => setParams({ ...params, servers })}
          />
          <RangeParameter label={t.rate} value={params.rate} min={1} max={4} onChange={(rate) => setParams({ ...params, rate })} />
          <div className="sm:col-span-2">
            <ChoiceParameter
              label={t.strategy}
              value={params.strategy}
              options={STRATEGIES.map((strategy) => ({ value: strategy, label: t.strategies[strategy] }))}
              onChange={(strategy) => setParams({ ...params, strategy })}
            />
          </div>
        </div>
      }
    >
      <LabSvg width={WIDTH} height={height} title={t.svgTitle} description={t.svgDescription}>
        {state.servers.map((_, server) => (
          <line
            key={server}
            x1={BALANCER.x + BALANCER.width}
            y1={middle}
            x2={SERVER_X - 6}
            y2={rowMiddle(server)}
            strokeWidth={targets.has(server) ? 2 : 1}
            className={targets.has(server) ? 'stroke-primary' : 'stroke-border'}
          />
        ))}
        <rect
          x={BALANCER.x}
          y={middle - BALANCER.height / 2}
          width={BALANCER.width}
          height={BALANCER.height}
          rx={6}
          className="fill-surface stroke-primary"
        />
        <text x={BALANCER.x + BALANCER.width / 2} y={middle + 4} textAnchor="middle" className="fill-foreground font-semibold">
          {t.balancer}
        </text>

        {state.servers.map((server, index) => {
          const color = entityColor(index)
          const filled = (Math.min(server.active.length, BAR_CAPACITY) / BAR_CAPACITY) * BAR_WIDTH
          return (
            <g key={index}>
              <text x={SERVER_X} y={rowMiddle(index) + 4} className="fill-foreground font-semibold">
                {serverName(index)}
              </text>
              <rect x={BAR_X} y={rowTop(index) + 4} width={BAR_WIDTH} height={16} rx={3} className="fill-surface" />
              <motion.rect
                x={BAR_X}
                y={rowTop(index) + 4}
                height={16}
                rx={3}
                initial={false}
                animate={{ width: filled }}
                className={`${color.fill} ${color.stroke}`}
              />
              <text x={BAR_X} y={rowTop(index) + 32} className="fill-muted-foreground text-[10px]">
                {format(t.load, { active: server.active.length, handled: server.handled })}
              </text>
            </g>
          )
        })}

        {state.assignments.map((assignment, order) => (
          <motion.circle
            key={assignment.id}
            r={4}
            initial={{ cx: BALANCER.x + BALANCER.width, cy: middle, opacity: 1 }}
            animate={{ cx: SERVER_X - 10 - order * 3, cy: rowMiddle(assignment.server), opacity: 0.9 }}
            className="fill-primary"
          />
        ))}
      </LabSvg>
    </VisualLab>
  )
}
