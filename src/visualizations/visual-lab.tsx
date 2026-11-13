'use client'

import { FlaskConical, Pause, Play, RotateCcw, StepForward } from 'lucide-react'
import { MotionConfig, useReducedMotion } from 'motion/react'
import { useId } from 'react'
import { Button } from '@/components/ui/button'
import { getDictionary } from '@/lib/i18n/dictionary'
import { useLocale } from '@/lib/i18n/use-locale'
import { cn } from '@/lib/utils'
import { PLAYBACK_SPEEDS } from './constants'
import type { VisualLabProps } from './types'

// Touch targets reach 44px on small screens (WCAG 2.5.5) and return to the compact size from `sm` up.
const CONTROL_SIZE = 'h-11 sm:h-9'

/** Standard frame shared by every visual lab: header, visualization area, playback, parameters and explanation. Static diagrams omit `playback`. */
export function VisualLab({ title, description, fidelity, children, playback, parameters, explanation }: VisualLabProps) {
  const labels = getDictionary(useLocale()).lab
  const titleId = useId()
  const speedId = useId()
  // With reduced motion every transition is instant: the state still advances, nothing travels across the screen.
  const reduceMotion = useReducedMotion()

  return (
    <section
      aria-labelledby={titleId}
      data-pagefind-ignore="all"
      className="my-8 overflow-hidden rounded-xl border bg-subtle"
    >
      <header className="flex flex-col gap-2 border-b bg-background p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
            <FlaskConical className="size-3.5" aria-hidden />
            {labels.badge}
          </p>
          <span
            className={cn(
              'rounded-full border px-2.5 py-0.5 text-xs font-medium',
              fidelity === 'faithful' ? 'border-success/50' : 'border-highlight/50',
            )}
          >
            {labels.fidelity[fidelity]}
          </span>
        </div>
        <h3 id={titleId} className="text-lg font-semibold tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>

      <div className="bg-background p-3 sm:p-4">
        <MotionConfig
          reducedMotion="user"
          transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: 'easeOut' }}
        >
          {children}
        </MotionConfig>
      </div>

      {playback && (
        <div role="toolbar" aria-label={labels.controls} className="flex flex-wrap items-center gap-2 border-t p-4">
          {playback.playing ? (
            <Button type="button" variant="outline" className={CONTROL_SIZE} onClick={playback.onPause}>
              <Pause aria-hidden />
              {labels.pause}
            </Button>
          ) : (
            <Button type="button" className={CONTROL_SIZE} onClick={playback.onPlay}>
              <Play aria-hidden />
              {labels.play}
            </Button>
          )}
          <Button type="button" variant="outline" className={CONTROL_SIZE} onClick={playback.onReset}>
            <RotateCcw aria-hidden />
            {labels.reset}
          </Button>
          <Button
            type="button"
            variant="outline"
            className={CONTROL_SIZE}
            onClick={playback.onStep}
            disabled={playback.playing || playback.finished}
          >
            <StepForward aria-hidden />
            {labels.step}
          </Button>
          <label htmlFor={speedId} className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            {labels.speed}
            <select
              id={speedId}
              value={playback.speed}
              onChange={(event) => playback.onSpeedChange(Number(event.target.value))}
              className={cn(CONTROL_SIZE, 'rounded-md border bg-background px-2 text-foreground')}
            >
              {PLAYBACK_SPEEDS.map((speed) => (
                <option key={speed} value={speed}>
                  {speed}×
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {parameters && (
        <div className="border-t p-4">
          <h4 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">{labels.parameters}</h4>
          {parameters}
        </div>
      )}

      <div className="border-t p-4">
        <h4 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">{labels.explanation}</h4>
        <div aria-live="polite" className="text-sm">
          {explanation}
        </div>
      </div>
    </section>
  )
}
