import Link from 'next/link'
import type { NavLink } from '@/components/navigation/types'

type LearningPathCardProps = {
  title: string
  description: string
  steps: NavLink[]
}

/** Editorial sequence of topics; in the MVP a learning path is only an ordered grouping (doc 02 §4.1). */
export function LearningPathCard({ title, description, steps }: LearningPathCardProps) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-lg border bg-card p-5">
      <h3 className="font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <ol className="mt-2 flex flex-col gap-1.5 text-sm">
        {steps.map((step, index) => (
          <li key={step.href} className="flex items-baseline gap-3">
            <span className="font-mono text-xs text-muted-foreground" aria-hidden>
              {String(index + 1).padStart(2, '0')}
            </span>
            <Link href={step.href} className="font-medium text-primary underline-offset-4 hover:underline">
              {step.label}
            </Link>
          </li>
        ))}
      </ol>
    </article>
  )
}
