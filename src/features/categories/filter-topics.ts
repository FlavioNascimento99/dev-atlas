import type { FilterableTopic, TopicFilters } from './types'

/** Lowercases and strips diacritics so "concorrencia" matches "Concorrência". */
function normalize(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

export function filterTopics<T extends FilterableTopic>(topics: T[], { query, difficulty, tag }: TopicFilters): T[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  return topics.filter((topic) => {
    if (difficulty && topic.difficulty !== difficulty) return false
    if (tag && !topic.tags.includes(tag)) return false
    const haystack = normalize([topic.title, topic.description, ...topic.tags].join(' '))
    return terms.every((term) => haystack.includes(term))
  })
}
