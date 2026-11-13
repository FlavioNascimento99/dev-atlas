import fs from 'node:fs'
import path from 'node:path'
import { parse as parseYaml } from 'yaml'
import type { z } from 'zod'
import { LOCALES } from '@/lib/i18n/config'
import type { Locale } from '@/lib/i18n/types'
import { CATEGORY_FILE, LEARNING_PATHS_FILE, MDX_SECTIONS, TOPIC_FILE } from './constants'
import { categorySchema, learningPathsSchema, topicMetaSchema, topicTranslationSchema } from './schema'
import type { Category, ContentIndex, LearningPath, Topic, TopicTranslation } from './types'

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/
const SECTION_TAG = /<ArticleSection\s+id="([a-z-]+)"/g

export class ContentValidationError extends Error {
  constructor(readonly issues: string[]) {
    super(`Invalid content (${issues.length} issue(s)):\n- ${issues.join('\n- ')}`)
    this.name = 'ContentValidationError'
  }
}

/**
 * Reads and validates every category, topic and learning path under `root`.
 * All problems are collected and thrown together so a single build run reports them all.
 */
export function loadContent(root: string): ContentIndex {
  const issues: string[] = []
  const relative = (file: string) => path.relative(root, file).split(path.sep).join('/')

  function read(file: string): string | undefined {
    if (fs.existsSync(file)) return fs.readFileSync(file, 'utf8')
    issues.push(`${relative(file)}: file is missing`)
    return undefined
  }

  function validate<T>(schema: z.ZodType<T>, data: unknown, file: string): T | undefined {
    const result = schema.safeParse(data)
    if (result.success) return result.data
    for (const issue of result.error.issues) {
      issues.push(`${relative(file)}: ${issue.path.join('.') || '(root)'} - ${issue.message}`)
    }
    return undefined
  }

  function readYaml<T>(schema: z.ZodType<T>, file: string): T | undefined {
    const source = read(file)
    return source === undefined ? undefined : parseValidated(schema, source, file)
  }

  function parseValidated<T>(schema: z.ZodType<T>, source: string, file: string): T | undefined {
    try {
      return validate(schema, parseYaml(source), file)
    } catch (error) {
      issues.push(`${relative(file)}: invalid YAML - ${(error as Error).message}`)
      return undefined
    }
  }

  function readTranslation(file: string): TopicTranslation | undefined {
    const source = read(file)
    if (source === undefined) return undefined
    const sections = [...source.matchAll(SECTION_TAG)].map((match) => match[1])
    if (sections.join() !== MDX_SECTIONS.join()) {
      issues.push(`${relative(file)}: editorial sections must be exactly [${MDX_SECTIONS.join(', ')}], found [${sections.join(', ')}]`)
    }
    const frontmatter = FRONTMATTER.exec(source)?.[1]
    if (frontmatter === undefined) {
      issues.push(`${relative(file)}: frontmatter with title and description is missing`)
      return undefined
    }
    return parseValidated(topicTranslationSchema, frontmatter, file)
  }

  function loadTopic(categoryId: string, dir: string): Topic | undefined {
    const meta = readYaml(topicMetaSchema, path.join(dir, TOPIC_FILE))
    const translations: Partial<Record<Locale, TopicTranslation>> = {}
    for (const locale of LOCALES) translations[locale] = readTranslation(path.join(dir, `${locale}.mdx`))
    if (!meta || !isComplete(translations)) return undefined
    return { ...meta, slug: path.basename(dir), category: categoryId, translations }
  }

  const categories: Category[] = []
  const topics: Topic[] = []
  for (const categoryId of subdirectories(root)) {
    const categoryDir = path.join(root, categoryId)
    const category = readYaml(categorySchema, path.join(categoryDir, CATEGORY_FILE))
    if (category) categories.push({ ...category, id: categoryId })
    for (const slug of subdirectories(categoryDir)) {
      const topic = loadTopic(categoryId, path.join(categoryDir, slug))
      if (topic) topics.push(topic)
    }
  }

  const learningPathsFile = path.join(root, LEARNING_PATHS_FILE)
  const learningPaths: LearningPath[] = fs.existsSync(learningPathsFile)
    ? (readYaml(learningPathsSchema, learningPathsFile) ?? [])
    : []

  issues.push(...crossReferenceIssues(categories, topics, learningPaths))
  if (issues.length > 0) throw new ContentValidationError(issues)

  return {
    categories: categories.sort((a, b) => a.order - b.order),
    topics: topics.sort((a, b) => a.slug.localeCompare(b.slug)),
    learningPaths,
  }
}

function crossReferenceIssues(categories: Category[], topics: Topic[], learningPaths: LearningPath[]): string[] {
  const issues: string[] = []
  const categoriesById = new Map(categories.map((category) => [category.id, category]))
  const slugs = new Set<string>()

  for (const topic of topics) {
    const where = `${topic.category}/${topic.slug}`
    if (slugs.has(topic.slug)) issues.push(`${where}: slug "${topic.slug}" is used by more than one topic`)
    slugs.add(topic.slug)
    const category = categoriesById.get(topic.category)
    if (category && !(topic.subcategory in category.subcategories)) {
      issues.push(`${where}: subcategory "${topic.subcategory}" is not declared in ${topic.category}/${CATEGORY_FILE}`)
    }
  }

  for (const topic of topics) {
    for (const related of topic.related) {
      if (related === topic.slug) issues.push(`${topic.category}/${topic.slug}: a topic cannot be related to itself`)
      else if (!slugs.has(related)) issues.push(`${topic.category}/${topic.slug}: related topic "${related}" does not exist`)
    }
  }

  for (const learningPath of learningPaths) {
    for (const slug of learningPath.topics) {
      if (!slugs.has(slug)) issues.push(`${LEARNING_PATHS_FILE}: learning path "${learningPath.id}" references unknown topic "${slug}"`)
    }
  }

  return issues
}

function subdirectories(dir: string): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

function isComplete(translations: Partial<Record<Locale, TopicTranslation>>): translations is Record<Locale, TopicTranslation> {
  return LOCALES.every((locale) => translations[locale] !== undefined)
}
