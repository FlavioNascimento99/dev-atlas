'use client'

import { Check, Circle, Minus, X } from 'lucide-react'
import { motion } from 'motion/react'
import { Fragment, type ReactNode } from 'react'
import { format } from '@/lib/i18n/dictionary'
import { useLocale } from '@/lib/i18n/use-locale'
import { cn } from '@/lib/utils'
import { ChoiceParameter } from '../../primitives/choice-parameter'
import { useSimulation } from '../../use-simulation'
import { VisualLab } from '../../visual-lab'
import { checkClaims, CLOCK_TOLERANCE_SECONDS, CLOCKS, ISSUED_CLAIMS, jwtModel, presentToken } from './script'
import { texts } from './texts'
import type { JwtCheck, JwtClaims, JwtHeader, JwtPart } from './types'

type CheckStatus = 'pending' | 'passed' | 'failed' | 'skipped'

const PARTS: JwtPart[] = ['header', 'payload', 'signature']
const CHECKS: JwtCheck[] = ['signature', 'claims', 'authorize']

/** One color per token part, shared by the encoded token and the panel that explains it. */
const PART_STYLE: Record<JwtPart, { chip: string; panel: string }> = {
  header: { chip: 'border-brand bg-brand/15', panel: 'border-l-brand' },
  payload: { chip: 'border-highlight bg-highlight/15', panel: 'border-l-highlight' },
  signature: { chip: 'border-info bg-info/15', panel: 'border-l-info' },
}

const STATUS_STYLE: Record<CheckStatus, { row: string; icon: string; Icon: typeof Check }> = {
  pending: { row: 'border-border', icon: 'text-muted-foreground', Icon: Circle },
  passed: { row: 'border-success bg-success/10', icon: 'text-success', Icon: Check },
  failed: { row: 'border-danger bg-danger/10', icon: 'text-danger', Icon: X },
  skipped: { row: 'border-dashed border-border', icon: 'text-muted-foreground', Icon: Minus },
}

/** Time of day of a Unix timestamp, in UTC so every reader sees the same clock. */
function timeOf(seconds: number) {
  return new Date(seconds * 1000).toISOString().slice(11, 19)
}

function Panel({ part, title, note, children }: { part: JwtPart; title: string; note: string; children: ReactNode }) {
  return (
    <div className={cn('min-w-0 rounded-md border border-l-4 bg-background', PART_STYLE[part].panel)}>
      <p className="border-b px-3 py-1.5 text-xs">
        <span className="font-semibold">{title}</span>
        <span className="text-muted-foreground"> · {note}</span>
      </p>
      {children}
    </div>
  )
}

function JsonLines({ value, flagged, flag }: { value: JwtHeader | JwtClaims; flagged: string | null; flag: string }) {
  const entries = Object.entries(value)
  return (
    <pre className="p-3 font-mono text-xs leading-5 break-all whitespace-pre-wrap">
      <span className="block">{'{'}</span>
      {entries.map(([key, entry], index) => (
        <span key={key} className={cn('block rounded-sm px-1', key === flagged && 'bg-danger/15')}>
          {`  ${JSON.stringify(key)}: ${JSON.stringify(entry)}${index < entries.length - 1 ? ',' : ''}`}
          {key === flagged && <span className="ml-2 font-sans font-semibold">← {flag}</span>}
        </span>
      ))}
      <span className="block">{'}'}</span>
    </pre>
  )
}

/** Type C lab: the three parts of a signed JWT and the two validation layers, with a tampered and an expired token. */
export function JwtInspector() {
  const t = texts[useLocale()]
  const { params, state, setParams, playback } = useSimulation(jwtModel, { payload: 'issued', clock: 'valid' })
  const token = presentToken(params.payload)
  const tampered = params.payload === 'tampered'
  const now = CLOCKS[params.clock]
  const times = { now: timeOf(now), exp: timeOf(token.claims.exp), tolerance: CLOCK_TOLERANCE_SECONDS }
  const revealed = state.steps.slice(0, state.index)
  const current = revealed.at(-1)
  const rejected = revealed.some((step) => !step.passed)
  const final = playback.finished ? current : undefined

  const statusOf = (check: JwtCheck): CheckStatus => {
    const step = revealed.find((candidate) => candidate.check === check)
    if (step) return step.passed ? 'passed' : 'failed'
    return rejected ? 'skipped' : 'pending'
  }

  const mark = (passed: boolean) => (passed ? '✓' : '✗')
  const claimChecks = checkClaims(token.claims, now)
  const detailOf = (check: JwtCheck, status: CheckStatus) => {
    if (check === 'signature') {
      if (status === 'passed') return t.details.signatureValid
      if (status === 'failed') return format(t.details.signatureInvalid, { signed: ISSUED_CLAIMS.role, presented: token.claims.role })
      return t.details.signature
    }
    if (check === 'claims') {
      if (status === 'pending' || status === 'skipped') return format(t.details.claims, times)
      return format(t.details.claimsChecked, {
        ...times,
        iss: mark(claimChecks.iss),
        aud: mark(claimChecks.aud),
        expMark: mark(claimChecks.exp),
      })
    }
    return status === 'passed' ? format(t.details.authorized, { role: token.claims.role }) : t.details.authorize
  }

  const verdict = !final
    ? t.verdict.none
    : final.id === 'authorized'
      ? format(t.verdict.authorized, { role: token.claims.role })
      : final.id === 'signatureInvalid'
        ? t.verdict.signatureInvalid
        : t.verdict.claimsRejected

  return (
    <VisualLab
      title={t.title}
      description={t.description}
      fidelity="conceptual"
      playback={playback}
      explanation={current ? format(t.steps[current.id], times) : t.start}
      parameters={
        <div className="grid gap-4 sm:grid-cols-2">
          <ChoiceParameter
            label={t.payloadParam}
            value={params.payload}
            options={[
              { value: 'issued', label: t.issued },
              { value: 'tampered', label: t.tampered },
            ]}
            onChange={(payload) => setParams({ ...params, payload })}
          />
          <ChoiceParameter
            label={t.clockParam}
            value={params.clock}
            options={[
              { value: 'valid', label: format(t.clockValid, { time: timeOf(CLOCKS.valid) }) },
              { value: 'expired', label: format(t.clockExpired, { time: timeOf(CLOCKS.expired) }) },
            ]}
            onChange={(clock) => setParams({ ...params, clock })}
          />
        </div>
      }
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-3 text-sm">
        <div>
          <p className="mb-1.5 text-xs font-semibold text-muted-foreground">{t.tokenLabel}</p>
          <p className="rounded-md border bg-surface p-3 font-mono text-xs leading-6 break-all">
            {PARTS.map((part, index) => (
              <Fragment key={part}>
                {index > 0 && <span className="font-bold">.</span>}
                <span
                  className={cn(
                    'box-decoration-clone border-b-2 px-0.5 py-0.5',
                    PART_STYLE[part].chip,
                    tampered && part === 'payload' && 'underline decoration-danger decoration-wavy',
                  )}
                >
                  <span className="sr-only">{t.parts[part]}: </span>
                  {token.encoded[part]}
                </span>
              </Fragment>
            ))}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[2fr_3fr]">
          <Panel part="header" title={t.parts.header} note={t.decoded}>
            <JsonLines value={token.header} flagged={null} flag={t.edited} />
          </Panel>
          <Panel part="payload" title={t.parts.payload} note={t.decoded}>
            <JsonLines value={token.claims} flagged={tampered ? 'role' : null} flag={t.edited} />
          </Panel>
          <div className="sm:col-span-2">
            <Panel part="signature" title={t.parts.signature} note={t.notJson}>
              <p className="p-3 text-xs">{t.signatureNote}</p>
            </Panel>
          </div>
        </div>

        <div>
          <p className="mb-1.5 flex flex-wrap justify-between gap-x-3 text-xs font-semibold text-muted-foreground">
            <span>{t.checksTitle}</span>
            <span className="font-mono">{format(t.clock, { time: times.now })}</span>
          </p>
          <ol className="flex flex-col gap-2">
            {CHECKS.map((check, index) => {
              const status = statusOf(check)
              const { row, icon, Icon } = STATUS_STYLE[status]
              return (
                <li
                  key={check}
                  className={cn('flex items-start gap-3 rounded-md border p-3', row, current?.check === check && 'outline-2 outline-ring')}
                >
                  <Icon aria-hidden className={cn('mt-0.5 size-4 shrink-0', icon)} />
                  <div className="min-w-0">
                    <p>
                      <span className="font-semibold">
                        {index + 1}. {t.checks[check]}
                      </span>
                      <span className="text-muted-foreground"> · {t.status[status]}</span>
                    </p>
                    <p className="text-xs break-words text-muted-foreground">{detailOf(check, status)}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        <motion.p
          key={verdict}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            'rounded-md border p-3 text-center font-mono text-xs font-semibold',
            !final ? 'border-dashed text-muted-foreground' : final.passed ? 'border-success bg-success/10' : 'border-danger bg-danger/10',
          )}
        >
          {verdict}
        </motion.p>
      </div>
    </VisualLab>
  )
}
