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
import { runningAt, timelineModel } from './schedule'
import type { Schedule } from './types'

const WIDTH = 360
const GRID_X = 64
const GRID_WIDTH = WIDTH - GRID_X - 4
const ROW_HEIGHT = 20
const ROW_GAP = 4
const LANE_TITLE = 18
const CORE_OPTIONS = [2, 3, 4]

type LaneProps = {
  title: string
  schedule: Schedule
  top: number
  time: number
  cellWidth: number
  coreLabel: (core: number) => string
}

function Lane({ title, schedule, top, time, cellWidth, coreLabel }: LaneProps) {
  return (
    <g>
      <text x={0} y={top + 12} className="fill-foreground font-semibold">
        {title}
      </text>
      {schedule.slots.map((row, core) => {
        const y = top + LANE_TITLE + core * (ROW_HEIGHT + ROW_GAP)
        return (
          <g key={core}>
            <text x={0} y={y + 14} className="fill-muted-foreground">
              {coreLabel(core + 1)}
            </text>
            <rect x={GRID_X} y={y} width={GRID_WIDTH} height={ROW_HEIGHT} rx={3} className="fill-surface" />
            {row.slice(0, time).map((task, slot) => {
              if (task === null) return null
              const color = entityColor(task)
              return (
                <motion.g key={slot} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <rect
                    x={GRID_X + slot * cellWidth + 1}
                    y={y + 1}
                    width={cellWidth - 2}
                    height={ROW_HEIGHT - 2}
                    rx={2}
                    className={`${color.fill} ${color.stroke}`}
                  />
                  <text
                    x={GRID_X + slot * cellWidth + cellWidth / 2}
                    y={y + 14}
                    textAnchor="middle"
                    className="fill-foreground text-[9px] font-semibold"
                  >
                    {task + 1}
                  </text>
                </motion.g>
              )
            })}
          </g>
        )
      })}
    </g>
  )
}

function laneHeight(schedule: Schedule) {
  return LANE_TITLE + schedule.slots.length * (ROW_HEIGHT + ROW_GAP)
}

/** Type B lab: the same tasks interleaved on one core and running simultaneously on several cores. */
export function ExecutionTimeline() {
  const locale = useLocale()
  const t = getDictionary(locale).labs.concurrency
  const { params, state, setParams, playback } = useSimulation(timelineModel, { tasks: 4, cores: 2 })
  const { concurrent, parallel, time } = state

  const cellWidth = GRID_WIDTH / concurrent.makespan
  const parallelTop = laneHeight(concurrent) + 10
  const legendTop = parallelTop + laneHeight(parallel) + 8
  const height = legendTop + 24
  const taskName = (task: number) => format(t.task, { n: task + 1 })
  const list = (tasks: number[]) => new Intl.ListFormat(locale).format(tasks.map(taskName))
  const coreLabel = (n: number) => format(t.core, { n })

  let explanation = format(t.start, { tasks: params.tasks, work: state.work.reduce((sum, work) => sum + work, 0) })
  if (playback.finished) {
    explanation = format(t.finished, { single: concurrent.makespan, cores: params.cores, parallel: parallel.makespan })
  } else if (time > 0) {
    const values = { time, single: list(runningAt(concurrent, time - 1)), cores: params.cores }
    const simultaneous = runningAt(parallel, time - 1)
    explanation =
      simultaneous.length > 0
        ? format(t.moment, { ...values, parallel: list(simultaneous) })
        : format(t.parallelDone, values)
  }

  return (
    <VisualLab
      title={t.title}
      description={t.description}
      fidelity="conceptual"
      playback={playback}
      explanation={explanation}
      parameters={
        <div className="grid gap-4 sm:grid-cols-2">
          <RangeParameter
            label={t.tasks}
            value={params.tasks}
            min={2}
            max={6}
            onChange={(tasks) => setParams({ ...params, tasks })}
          />
          <ChoiceParameter
            label={t.cores}
            value={String(params.cores)}
            options={CORE_OPTIONS.map((cores) => ({ value: String(cores), label: String(cores) }))}
            onChange={(cores) => setParams({ ...params, cores: Number(cores) })}
          />
        </div>
      }
    >
      <LabSvg width={WIDTH} height={height} title={t.svgTitle} description={t.svgDescription}>
        <Lane
          title={t.concurrentLane}
          schedule={concurrent}
          top={0}
          time={time}
          cellWidth={cellWidth}
          coreLabel={coreLabel}
        />
        <Lane
          title={format(t.parallelLane, { cores: params.cores })}
          schedule={parallel}
          top={parallelTop}
          time={Math.min(time, parallel.makespan)}
          cellWidth={cellWidth}
          coreLabel={coreLabel}
        />
        <motion.line
          y1={LANE_TITLE - 2}
          y2={legendTop - 6}
          x1={GRID_X}
          x2={GRID_X}
          initial={false}
          animate={{ x: time * cellWidth }}
          className="stroke-primary"
          strokeWidth={2}
        />
        {state.work.map((_, task) => {
          const color = entityColor(task)
          return (
            <g key={task} transform={`translate(${task * 56} ${legendTop})`}>
              <rect width={14} height={14} rx={2} className={`${color.fill} ${color.stroke}`} />
              <text x={19} y={11} className="fill-foreground">
                {taskName(task)}
              </text>
            </g>
          )
        })}
      </LabSvg>
    </VisualLab>
  )
}
