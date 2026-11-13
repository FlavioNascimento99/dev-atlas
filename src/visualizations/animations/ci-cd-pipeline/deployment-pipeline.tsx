'use client'

import { motion } from 'motion/react'
import { useLocale } from '@/lib/i18n/use-locale'
import { cn } from '@/lib/utils'
import { ChoiceParameter } from '../../primitives/choice-parameter'
import { LabLegend } from '../../primitives/lab-legend'
import { LabSvg } from '../../primitives/lab-svg'
import { useSimulation } from '../../use-simulation'
import { VisualLab } from '../../visual-lab'
import { DELIVERED_BY, holdsArtifact, pipelineModel, STAGES, stageStatuses } from './script'
import { texts } from './texts'
import type { ArtifactLocation, PipelineParams, StageStatus } from './types'

const WIDTH = 360
const ROW = { x: 1, top: 4, width: 196, height: 24, pitch: 28 }
const BOX = { x: 214, width: 145, height: 44 }
const HEIGHT = ROW.top + STAGES.length * ROW.pitch + 8
const LOCATIONS = ['registry', 'staging', 'production'] as const satisfies readonly ArtifactLocation[]
const FAIL_OPTIONS = ['none', 'unitTests', 'acceptance'] as const
const INITIAL_PARAMS: PipelineParams = { failAt: null }

const ROW_TONE: Record<StageStatus, string> = {
  pending: 'fill-surface stroke-border',
  passed: 'fill-success/15 stroke-success',
  failed: 'fill-danger/15 stroke-danger',
  blocked: 'fill-background stroke-muted-foreground',
}

/** Check, cross, dash and hollow dot, drawn around the origin. */
const STATUS_GLYPH: Record<StageStatus, { d: string; className: string }> = {
  pending: { d: 'M-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0', className: 'stroke-muted-foreground' },
  passed: { d: 'M-4.5 0 l3 3.5 l6 -7', className: 'stroke-success' },
  failed: { d: 'M-4 -4 l8 8 m0 -8 l-8 8', className: 'stroke-danger' },
  blocked: { d: 'M-4 0 h8', className: 'stroke-muted-foreground' },
}

function rowCenter(index: number) {
  return ROW.top + index * ROW.pitch + ROW.height / 2
}

/** Type B lab: a commit going through the stages of a deployment pipeline, with the artifact built once and promoted. */
export function DeploymentPipeline() {
  const t = texts[useLocale()]
  const { params, state, setParams, playback } = useSimulation(pipelineModel, INITIAL_PARAMS)
  const step = state.steps[state.index - 1]
  const statuses = stageStatuses(state.steps, state.index)
  const currentRow = step ? STAGES.indexOf(step.stage) : 0

  return (
    <VisualLab
      title={t.title}
      description={t.description}
      fidelity="conceptual"
      playback={playback}
      explanation={step ? t.steps[step.id] : t.start}
      parameters={
        <ChoiceParameter
          label={t.tests}
          value={params.failAt ?? 'none'}
          options={FAIL_OPTIONS.map((value) => ({
            value,
            label: { none: t.allPass, unitTests: t.unitFail, acceptance: t.acceptanceFail }[value],
          }))}
          onChange={(value) => setParams({ failAt: value === 'none' ? null : value })}
        />
      }
    >
      <LabSvg width={WIDTH} height={HEIGHT} title={t.svgTitle} description={t.svgDescription}>
        <circle cx={BOX.x + 6} cy={16} r={5} className="fill-primary" />
        <text x={BOX.x + 17} y={20} className="fill-foreground font-mono font-semibold">
          {t.commit}
        </text>

        {STAGES.map((stage, index) => {
          const status = statuses[stage]
          const current = step?.stage === stage
          const glyph = STATUS_GLYPH[status]
          return (
            <g key={stage}>
              <rect
                x={ROW.x}
                y={ROW.top + index * ROW.pitch}
                width={ROW.width}
                height={ROW.height}
                rx={5}
                strokeWidth={current ? 2.5 : 1}
                strokeDasharray={status === 'blocked' ? '4 3' : undefined}
                className={ROW_TONE[status]}
              />
              <path
                d={glyph.d}
                transform={`translate(${ROW.x + 13} ${rowCenter(index)})`}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn('fill-none', glyph.className)}
              />
              <text
                x={ROW.x + 26}
                y={rowCenter(index) + 4}
                className={cn(
                  status === 'pending' || status === 'blocked' ? 'fill-muted-foreground' : 'fill-foreground',
                  current && 'font-semibold',
                )}
              >
                {t.stages[stage]}
              </text>
            </g>
          )
        })}
        <motion.circle
          cx={ROW.x + ROW.width - 12}
          r={5}
          initial={false}
          animate={{ cy: rowCenter(currentRow), opacity: step ? 1 : 0 }}
          className={step?.passed === false ? 'fill-danger' : 'fill-primary'}
        />

        {LOCATIONS.map((location) => {
          const center = rowCenter(STAGES.indexOf(DELIVERED_BY[location]))
          const y = center - BOX.height / 2
          const delivered = holdsArtifact(statuses, location)
          return (
            <g key={location}>
              <line
                x1={ROW.x + ROW.width}
                y1={center}
                x2={BOX.x}
                y2={center}
                strokeWidth={delivered ? 2 : 1}
                strokeDasharray={delivered ? undefined : '3 3'}
                className={delivered ? 'stroke-brand' : 'stroke-border'}
              />
              <rect
                x={BOX.x}
                y={y}
                width={BOX.width}
                height={BOX.height}
                rx={6}
                className={cn('fill-surface', delivered ? 'stroke-brand' : 'stroke-border')}
              />
              <text x={BOX.x + BOX.width / 2} y={y + 15} textAnchor="middle" className="fill-foreground font-semibold">
                {t.locations[location]}
              </text>
              <motion.g key={String(delivered)} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect
                  x={BOX.x + 8}
                  y={y + 21}
                  width={BOX.width - 16}
                  height={17}
                  rx={4}
                  strokeWidth={delivered ? 2 : 1}
                  strokeDasharray={delivered || location !== 'registry' ? undefined : '3 3'}
                  className={delivered ? 'fill-brand/20 stroke-brand' : 'fill-background stroke-border'}
                />
                <text
                  x={BOX.x + BOX.width / 2}
                  y={y + 33.5}
                  textAnchor="middle"
                  className={cn('font-mono', delivered ? 'fill-foreground font-semibold' : 'fill-muted-foreground')}
                >
                  {delivered ? t.artifact : location === 'registry' ? t.notBuilt : t.previous}
                </text>
              </motion.g>
            </g>
          )
        })}
      </LabSvg>
      <LabLegend
        items={[
          { label: t.legend.passed, swatch: 'border-success bg-success/20' },
          { label: t.legend.failed, swatch: 'border-danger bg-danger/20' },
          { label: t.legend.blocked, swatch: 'border-dashed border-muted-foreground' },
          { label: t.legend.artifact, swatch: 'border-brand bg-brand/20' },
        ]}
      />
    </VisualLab>
  )
}
