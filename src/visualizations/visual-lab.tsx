'use client'

import { FlaskConical, Pause, Play, RotateCcw, StepForward } from 'lucide-react'
import { useId } from 'react'
import { Button } from '@/components/ui/button'
import { getDictionary } from '@/lib/i18n/dictionary'
import { useLocale } from '@/lib/i18n/use-locale'
import { cn } from '@/lib/utils'
import type { VisualLabProps } from './types'

/** Standard frame shared by every visual lab: header, visualization area, playback, parameters and explanation. */
export function VisualLab({ title, description, fidelity, children, playback, parameters, explanation }: VisualLabProps) {
  const labels = getDictionary(useLocale()).lab
  const titleId = useId()

  return (
    <section aria-labelledby={titleId} className="my-8 overflow-hidden rounded-xl border bg-subtle">
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

      <div className="min-h-64 overflow-auto bg-background p-4">{children}</div>

      {playback && (
        <div role="toolbar" aria-label={labels.controls} className="flex flex-wrap gap-2 border-t p-4">
          {playback.playing ? (
            <Button type="button" variant="outline" onClick={playback.onPause}>
              <Pause aria-hidden />
              {labels.pause}
            </Button>
          ) : (
            <Button type="button" onClick={playback.onPlay}>
              <Play aria-hidden />
              {labels.play}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={playback.onReset}>
            <RotateCcw aria-hidden />
            {labels.reset}
          </Button>
          {playback.onStep && (
            <Button type="button" variant="outline" onClick={playback.onStep} disabled={playback.playing}>
              <StepForward aria-hidden />
              {labels.step}
            </Button>
          )}
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
