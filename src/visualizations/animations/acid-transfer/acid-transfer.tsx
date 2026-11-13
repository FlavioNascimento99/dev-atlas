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
import { acidModel, INITIAL_BALANCES, total, TRANSFER_AMOUNT } from './script'
import { texts } from './texts'
import type { AccountId, AcidStepId } from './types'

const WIDTH = 360
const CARD = { y: 2, width: 110, height: 72 }
const CARD_X: Record<AccountId, number> = { alice: 1, bob: WIDTH - CARD.width - 1 }
const TRACK_Y = CARD.y + CARD.height / 2
const TOKEN = { width: 44, height: 22 }
/** Where the 100 is: still with Alice, debited but not credited, or with Bob. */
const TOKEN_X = { alice: CARD_X.alice + CARD.width - TOKEN.width / 2, flight: WIDTH / 2, bob: CARD_X.bob + TOKEN.width / 2 }
const CRASH_X = WIDTH / 2 + 46
const TOTAL = { y: 84, height: 24 }
const LOG = { titleY: 128, top: 136, row: 20, rows: 4 }
const HEIGHT = LOG.top + LOG.rows * LOG.row + 2
const EXPECTED_TOTAL = total(INITIAL_BALANCES)
const ACCOUNTS = ['alice', 'bob'] as const satisfies readonly AccountId[]

const LOG_TONE: Partial<Record<AcidStepId, string>> = {
  crash: 'stroke-danger fill-danger/15',
  crashAutocommit: 'stroke-danger fill-danger/15',
  restart: 'stroke-danger fill-danger/15',
  rollback: 'stroke-success fill-success/15',
  commit: 'stroke-success fill-success/15',
}

/** Type B lab: a debit and a credit with a crash between them, inside a transaction and with each statement committing alone. */
export function AcidTransfer() {
  const t = texts[useLocale()]
  const { params, state, setParams, playback } = useSimulation(acidModel, { transaction: true, crash: true })
  const revealed = state.steps.slice(0, state.index)
  const step = revealed.at(-1)
  const balances = step?.balances ?? INITIAL_BALANCES
  const committed = step?.committed ?? INITIAL_BALANCES
  const crashed = revealed.some((past) => past.statement === 'crash')
  const missing = EXPECTED_TOTAL - total(committed)
  const inFlight = total(balances) < EXPECTED_TOTAL
  const tokenAt = inFlight ? 'flight' : balances.bob > INITIAL_BALANCES.bob ? 'bob' : 'alice'

  return (
    <VisualLab
      title={t.title}
      description={t.description}
      fidelity="conceptual"
      playback={playback}
      explanation={step ? t.steps[step.id] : params.transaction ? t.startTransaction : t.startAutocommit}
      parameters={
        <div className="grid gap-4 sm:grid-cols-2">
          <ChoiceParameter
            label={t.mode}
            value={params.transaction ? 'on' : 'off'}
            options={[
              { value: 'on', label: t.withTransaction },
              { value: 'off', label: t.withoutTransaction },
            ]}
            onChange={(value) => setParams({ ...params, transaction: value === 'on' })}
          />
          <ChoiceParameter
            label={t.failure}
            value={params.crash ? 'on' : 'off'}
            options={[
              { value: 'on', label: t.crash },
              { value: 'off', label: t.noCrash },
            ]}
            onChange={(value) => setParams({ ...params, crash: value === 'on' })}
          />
        </div>
      }
    >
      <LabSvg width={WIDTH} height={HEIGHT} title={t.svgTitle} description={t.svgDescription}>
        <line
          x1={CARD_X.alice + CARD.width}
          y1={TRACK_Y}
          x2={CARD_X.bob}
          y2={TRACK_Y}
          className="stroke-border"
          strokeDasharray="4 3"
        />
        <path d={`M${CARD_X.bob - 7} ${TRACK_Y - 4} l7 4 l-7 4`} className="fill-none stroke-muted-foreground" />

        {ACCOUNTS.map((account) => {
          const x = CARD_X[account]
          const pending = balances[account] !== committed[account]
          return (
            <g key={account}>
              <rect
                x={x}
                y={CARD.y}
                width={CARD.width}
                height={CARD.height}
                rx={6}
                strokeWidth={pending ? 2 : 1}
                className={cn('fill-surface', pending ? 'stroke-warning' : 'stroke-border')}
              />
              <text x={x + CARD.width / 2} y={CARD.y + 17} textAnchor="middle" className="fill-foreground font-semibold">
                {t.accounts[account]}
              </text>
              <motion.text
                key={balances[account]}
                x={x + CARD.width / 2}
                y={CARD.y + 45}
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fill-foreground font-mono text-[22px] font-bold"
              >
                {balances[account]}
              </motion.text>
              {pending && (
                <text x={x + CARD.width / 2} y={CARD.y + 63} textAnchor="middle" className="fill-foreground">
                  {t.uncommitted}
                </text>
              )}
            </g>
          )
        })}

        <motion.g initial={false} animate={{ x: TOKEN_X[tokenAt], opacity: inFlight ? 1 : 0 }}>
          <rect
            x={-TOKEN.width / 2}
            y={TRACK_Y - TOKEN.height / 2}
            width={TOKEN.width}
            height={TOKEN.height}
            rx={TOKEN.height / 2}
            strokeWidth={2}
            className={cn('fill-background', crashed || missing > 0 ? 'stroke-danger' : 'stroke-warning')}
          />
          <text y={TRACK_Y + 4} textAnchor="middle" className="fill-foreground font-mono font-semibold">
            {TRANSFER_AMOUNT}
          </text>
        </motion.g>

        {crashed && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <path
              d={`M${CRASH_X - 6} ${TRACK_Y - 6} l12 12 m0 -12 l-12 12`}
              strokeWidth={3}
              strokeLinecap="round"
              className="fill-none stroke-danger"
            />
            <text x={CRASH_X} y={TRACK_Y - 14} textAnchor="middle" className="fill-foreground font-semibold">
              {t.crashMark}
            </text>
          </motion.g>
        )}

        <rect
          x={1}
          y={TOTAL.y}
          width={WIDTH - 2}
          height={TOTAL.height}
          rx={5}
          strokeWidth={2}
          className={missing > 0 ? 'fill-danger/15 stroke-danger' : 'fill-success/15 stroke-success'}
        />
        <text x={WIDTH / 2} y={TOTAL.y + 16} textAnchor="middle" className="fill-foreground font-mono font-semibold">
          {format(missing > 0 ? t.totalBroken : t.totalOk, { total: total(committed), missing })}
        </text>

        <text x={1} y={LOG.titleY} className="fill-muted-foreground font-semibold">
          {t.logTitle}
        </text>
        {revealed.map((past, row) => {
          const y = LOG.top + row * LOG.row
          const current = row === revealed.length - 1
          return (
            <motion.g key={past.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect
                x={1}
                y={y}
                width={WIDTH - 2}
                height={LOG.row - 3}
                rx={3}
                strokeWidth={current ? 2 : 1}
                className={LOG_TONE[past.id] ?? (current ? 'fill-surface stroke-primary' : 'fill-surface stroke-border')}
              />
              <text x={10} y={y + 12.5} className="fill-muted-foreground font-mono">
                {row + 1}
              </text>
              <text x={26} y={y + 12.5} className={cn('fill-foreground font-mono', current && 'font-semibold')}>
                {t.log[past.id]}
              </text>
            </motion.g>
          )
        })}
      </LabSvg>
      <LabLegend
        items={[
          { label: t.legend.committed, swatch: 'border-success bg-success/20' },
          { label: t.legend.uncommitted, swatch: 'border-warning bg-warning/20' },
          { label: t.legend.failure, swatch: 'border-danger bg-danger/20' },
        ]}
      />
    </VisualLab>
  )
}
