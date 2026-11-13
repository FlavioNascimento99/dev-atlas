import Link from 'next/link'
import { DifficultyBadge } from './difficulty-badge'
import type { TopicCardProps } from './types'

/** Compact, fully clickable card used for topic listings and related concepts (doc 02 §5.5). */
export function TopicCard({ href, title, description, difficulty, difficultyLabel, categoryLabel, tags }: TopicCardProps) {
  return (
    <article className="group relative flex h-full flex-col gap-2 rounded-lg border bg-card p-4 transition-colors hover:border-brand/60 hover:bg-subtle">
      {categoryLabel && <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{categoryLabel}</p>}
      <h3 className="font-semibold tracking-tight">
        <Link href={href} className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-ring">
          {title}
        </Link>
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
        <DifficultyBadge difficulty={difficulty} label={difficultyLabel} />
        {tags?.map((tag) => (
          <span key={tag} className="rounded-full px-1.5 text-xs text-muted-foreground">
            #{tag}
          </span>
        ))}
      </div>
    </article>
  )
}
