import type { TopicCardProps } from '@/components/content/types'
import type { Difficulty } from '@/lib/content/types'

export type FilterableTopic = TopicCardProps & {
  tags: string[]
  subcategory: string
}

export type TopicFilters = {
  query: string
  difficulty: Difficulty | null
  tag: string | null
}

export type CategoryTopicsLabels = {
  topics: string
  filterLabel: string
  filterPlaceholder: string
  difficulty: string
  tags: string
  all: string
  clear: string
  noMatches: string
  resultCount: string
  difficulties: Record<Difficulty, string>
}
