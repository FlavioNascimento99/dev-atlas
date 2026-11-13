'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useId } from 'react'
import { useLocale } from '@/lib/i18n/use-locale'
import { cn } from '@/lib/utils'
import { ChoiceParameter } from '../../primitives/choice-parameter'
import { LabSvg } from '../../primitives/lab-svg'
import { useSimulation } from '../../use-simulation'
import { VisualLab } from '../../visual-lab'
import { EMPTY_MEMORY, isDangling, leakedBlocks, programLines, stackHeapModel } from './script'
import { texts } from './texts'

const WIDTH = 320
const TOP = 22
const REGION = { width: 140, height: 132 }
const HEAP_X = WIDTH - REGION.width
const FRAME = { x: 6, width: 128, height: 58, row: 62 }
const CELL = { x: 14, width: 112, height: 24, top: 24 }
const BLOCK = { x: HEAP_X + 12, y: TOP + 34, width: 116, height: 40 }
const LEGEND_Y = TOP + REGION.height + 10
const HEIGHT = LEGEND_Y + 36
const ARROW = 7
const MARKER_FILLS = ['fill-primary', 'fill-danger'] as const

const BLOCK_STYLES = {
  allocated: { box: 'fill-brand/20 stroke-brand', text: 'fill-foreground' },
  freed: { box: 'fill-none stroke-muted-foreground', text: 'fill-muted-foreground' },
  leaked: { box: 'fill-danger/20 stroke-danger', text: 'fill-danger' },
}

const hex = (address: number) => `0x${address.toString(16)}`
/** The oldest frame sits at the bottom, so the running one is always on top. */
const frameY = (index: number) => TOP + 6 + (1 - index) * FRAME.row

/** Type B lab: the C program of the article executed statement by statement over a model of the stack and the heap. */
export function StackAndHeap() {
  const t = texts[useLocale()]
  const markerId = useId()
  const { params, state, setParams, playback } = useSimulation(stackHeapModel, { release: true })
  const step = state.steps[state.index - 1]
  const memory = step?.memory ?? EMPTY_MEMORY
  const leaked = leakedBlocks(memory)
  const running = memory.stack.length - 1
  const touchesHeap = step?.id === 'allocate' || step?.id === 'write' || step?.id === 'free'
  const regions = [
    { x: 0, label: t.stack, empty: memory.stack.length === 0 ? t.emptyStack : null },
    { x: HEAP_X, label: t.heap, empty: memory.heap.length === 0 ? t.emptyHeap : null },
  ]

  return (
    <VisualLab
      title={t.title}
      description={t.description}
      fidelity="conceptual"
      playback={playback}
      explanation={step ? t.steps[step.id] : params.release ? t.startRelease : t.startLeak}
      parameters={
        <ChoiceParameter
          label={t.release}
          value={params.release ? 'yes' : 'no'}
          options={[
            { value: 'yes', label: t.releaseYes },
            { value: 'no', label: t.releaseNo },
          ]}
          onChange={(release) => setParams({ release: release === 'yes' })}
        />
      }
    >
      <div className="grid items-center gap-4 md:grid-cols-[auto_minmax(0,1fr)]">
        <figure className="min-w-0">
          <figcaption className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">{t.program}</figcaption>
          <pre className="overflow-x-auto rounded-md border bg-subtle py-2 font-mono text-xs leading-5">
            <code>
              {programLines(params).map((line, index) => (
                <span
                  key={index}
                  aria-current={index === step?.line ? 'step' : undefined}
                  className={cn(
                    'block border-l-2 px-3',
                    index === step?.line ? 'border-primary bg-primary/10 font-semibold' : 'border-transparent',
                    line.trimStart().startsWith('//') && 'text-muted-foreground',
                  )}
                >
                  {line || ' '}
                </span>
              ))}
            </code>
          </pre>
        </figure>

        <LabSvg width={WIDTH} height={HEIGHT} title={t.svgTitle} description={t.svgDescription}>
          <defs>
            {MARKER_FILLS.map((fill, index) => (
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

          {regions.map((region) => (
            <g key={region.label}>
              <text x={region.x + REGION.width / 2} y={12} textAnchor="middle" className="fill-foreground font-semibold">
                {region.label}
              </text>
              <rect
                x={region.x + 0.5}
                y={TOP}
                width={REGION.width - 1}
                height={REGION.height}
                rx={6}
                strokeDasharray="4 3"
                className="fill-surface stroke-border"
              />
              {region.empty && (
                <text
                  x={region.x + REGION.width / 2}
                  y={TOP + REGION.height / 2 + 4}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px]"
                >
                  {region.empty}
                </text>
              )}
            </g>
          ))}

          {memory.heap.map((block) => {
            const status = leaked.includes(block) ? 'leaked' : block.status
            const style = BLOCK_STYLES[status]
            return (
              <motion.g key={block.address} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <text x={BLOCK.x} y={BLOCK.y - 6} className="fill-muted-foreground font-mono text-[10px]">
                  {hex(block.address)}
                </text>
                <rect
                  x={BLOCK.x}
                  y={BLOCK.y}
                  width={BLOCK.width}
                  height={BLOCK.height}
                  rx={4}
                  strokeWidth={touchesHeap ? 2 : 1}
                  strokeDasharray={status === 'freed' ? '4 3' : undefined}
                  className={style.box}
                />
                <text
                  x={BLOCK.x + BLOCK.width / 2}
                  y={BLOCK.y + BLOCK.height / 2 + 5}
                  textAnchor="middle"
                  className={cn('font-mono text-[14px] font-semibold', style.text)}
                >
                  {block.value ?? '?'}
                </text>
                <text
                  x={BLOCK.x + BLOCK.width / 2}
                  y={BLOCK.y + BLOCK.height + 15}
                  textAnchor="middle"
                  className={cn('font-medium', style.text)}
                >
                  {t.status[status]}
                </text>
              </motion.g>
            )
          })}

          <AnimatePresence>
            {memory.stack.map((frame, index) => {
              const y = frameY(index)
              return (
                <motion.g
                  key={frame.fn}
                  initial={{ opacity: 0, y: -14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                >
                  <rect
                    x={FRAME.x}
                    y={y}
                    width={FRAME.width}
                    height={FRAME.height}
                    rx={5}
                    strokeWidth={index === running ? 2 : 1}
                    className={cn('fill-background', index === running ? 'stroke-primary' : 'stroke-border')}
                  />
                  <text x={CELL.x} y={y + 16} className="fill-foreground font-mono font-semibold">
                    {frame.fn}()
                  </text>
                  {frame.variables.map((variable) => {
                    const dangling = isDangling(memory, variable)
                    const cellY = y + CELL.top
                    return (
                      <g key={variable.name}>
                        <rect
                          x={CELL.x}
                          y={cellY}
                          width={CELL.width}
                          height={CELL.height}
                          rx={3}
                          className={cn('fill-surface', dangling ? 'stroke-danger' : 'stroke-border')}
                        />
                        <text x={CELL.x + 8} y={cellY + 16} className="fill-foreground font-mono">
                          {variable.name}
                        </text>
                        <text
                          x={CELL.x + CELL.width - 8}
                          y={cellY + 16}
                          textAnchor="end"
                          className={cn('font-mono', variable.value === null ? 'fill-muted-foreground' : 'fill-foreground')}
                        >
                          {variable.value === null ? '?' : hex(variable.value)}
                        </text>
                        {variable.value !== null && (
                          <motion.line
                            x1={CELL.x + CELL.width}
                            y1={cellY + CELL.height / 2}
                            x2={BLOCK.x}
                            y2={BLOCK.y + BLOCK.height / 2}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            strokeWidth={1.5}
                            strokeDasharray={dangling ? '4 3' : undefined}
                            markerEnd={`url(#${markerId}-${dangling ? 1 : 0})`}
                            className={dangling ? 'stroke-danger' : 'stroke-primary'}
                          />
                        )}
                      </g>
                    )
                  })}
                </motion.g>
              )
            })}
          </AnimatePresence>

          {(['allocated', 'freed', 'leaked'] as const).map((status, index) => (
            <g key={status} transform={`translate(${(index % 2) * 164} ${LEGEND_Y + Math.floor(index / 2) * 18})`}>
              <rect
                y={1}
                width={16}
                height={12}
                rx={2}
                strokeDasharray={status === 'freed' ? '3 2' : undefined}
                className={BLOCK_STYLES[status].box}
              />
              <text x={22} y={11} className="fill-foreground">
                {t.legend[status]}
              </text>
            </g>
          ))}
          <g transform={`translate(164 ${LEGEND_Y + 18})`}>
            <line x1={0} y1={7} x2={16} y2={7} strokeWidth={1.5} strokeDasharray="4 3" className="stroke-danger" />
            <text x={22} y={11} className="fill-foreground">
              {t.legend.dangling}
            </text>
          </g>
        </LabSvg>
      </div>
    </VisualLab>
  )
}
