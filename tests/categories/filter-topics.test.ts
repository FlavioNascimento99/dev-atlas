import { describe, expect, it } from 'vitest'
import { filterTopics } from '@/features/categories/filter-topics'
import type { FilterableTopic } from '@/features/categories/types'

const topic = (title: string, overrides: Partial<FilterableTopic> = {}): FilterableTopic => ({
  href: `/${title}`,
  title,
  description: `About ${title}`,
  difficulty: 'beginner',
  difficultyLabel: 'Beginner',
  tags: [],
  subcategory: 'general',
  ...overrides,
})

const topics = [
  topic('Concorrência', { tags: ['threads'] }),
  topic('Load Balancing', { difficulty: 'intermediate', tags: ['traffic'] }),
  topic('Caching', { difficulty: 'advanced', tags: ['traffic', 'latency'] }),
]
const none = { query: '', difficulty: null, tag: null }

describe('filterTopics', () => {
  it('returns everything without filters', () => {
    expect(filterTopics(topics, none)).toHaveLength(3)
  })

  it('matches every query term against title, description and tags, ignoring case and accents', () => {
    expect(filterTopics(topics, { ...none, query: 'concorrencia' }).map((t) => t.title)).toEqual(['Concorrência'])
    expect(filterTopics(topics, { ...none, query: 'about latency' }).map((t) => t.title)).toEqual(['Caching'])
  })

  it('combines difficulty and tag filters', () => {
    expect(filterTopics(topics, { ...none, tag: 'traffic' })).toHaveLength(2)
    expect(filterTopics(topics, { ...none, tag: 'traffic', difficulty: 'intermediate' }).map((t) => t.title)).toEqual([
      'Load Balancing',
    ])
  })
})
