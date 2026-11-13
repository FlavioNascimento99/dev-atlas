import { TopicCard } from './topic-card'
import type { TopicCardProps } from './types'

export function RelatedConcepts({ topics, emptyLabel }: { topics: TopicCardProps[]; emptyLabel: string }) {
  if (topics.length === 0) return <p className="text-muted-foreground">{emptyLabel}</p>

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {topics.map((topic) => (
        <li key={topic.href}>
          <TopicCard {...topic} />
        </li>
      ))}
    </ul>
  )
}
