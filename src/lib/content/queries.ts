import path from 'node:path'
import { cache } from 'react'
import { loadContent } from './loader'
import type { Category, Topic } from './types'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export const getContent = cache(() => loadContent(CONTENT_DIR))

export function getCategories(): Category[] {
  return getContent().categories
}

export function getCategory(id: string): Category | undefined {
  return getCategories().find((category) => category.id === id)
}

export function getPublishedTopics(): Topic[] {
  return getContent().topics.filter((topic) => topic.published)
}

export function getTopic(slug: string): Topic | undefined {
  return getPublishedTopics().find((topic) => topic.slug === slug)
}

export function getTopicsByCategory(categoryId: string): Topic[] {
  return getPublishedTopics().filter((topic) => topic.category === categoryId)
}

export function getTopicsBySlugs(slugs: string[]): Topic[] {
  return slugs.map(getTopic).filter((topic) => topic !== undefined)
}
