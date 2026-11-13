import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { loadContent } from '@/lib/content/loader'

describe('repository content', () => {
  const content = loadContent(path.join(process.cwd(), 'content'))

  it('defines the ten knowledge domains in order', () => {
    expect(content.categories.map((category) => category.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('publishes at least two topics per domain', () => {
    for (const category of content.categories) {
      const published = content.topics.filter((topic) => topic.category === category.id && topic.published)
      expect(published.length, category.id).toBeGreaterThanOrEqual(2)
    }
  })
})
