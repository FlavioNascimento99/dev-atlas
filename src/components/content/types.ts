import type { Difficulty } from '@/lib/content/types'

export type CalloutType = 'info' | 'tip' | 'warning' | 'important'

export type TocItem = {
  id: string
  label: string
}

export type TopicCardProps = {
  href: string
  title: string
  description: string
  difficulty: Difficulty
  difficultyLabel: string
  categoryLabel?: string
  tags?: string[]
}
