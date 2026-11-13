import type { Difficulty } from '@/lib/content/types'
import { cn } from '@/lib/utils'

const DOT: Record<Difficulty, string> = {
  beginner: 'bg-success',
  intermediate: 'bg-info',
  advanced: 'bg-warning',
}

/** Difficulty level shown as text plus a colored dot, so color is never the only cue. */
export function DifficultyBadge({ difficulty, label, className }: { difficulty: Difficulty; label: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border bg-subtle px-2.5 py-0.5 text-xs font-medium', className)}>
      <span className={cn('size-1.5 rounded-full', DOT[difficulty])} aria-hidden />
      {label}
    </span>
  )
}
