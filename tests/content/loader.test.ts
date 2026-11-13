import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { ContentValidationError, loadContent } from '@/lib/content/loader'
import { MDX_SECTIONS } from '@/lib/content/constants'

const CATEGORY_YAML = `icon: git-fork
order: 1
name: { en: Concurrency, pt: Concorrência }
description: { en: Coordinating work., pt: Coordenando trabalho. }
subcategories:
  execution-models: { en: Execution models, pt: Modelos de execução }
`

const topicYaml = (related: string[] = []) => `subcategory: execution-models
difficulty: beginner
readingTime: 8
tags: [concurrency]
related: [${related.join(', ')}]
references:
  - title: The Go Blog
    url: https://go.dev/blog/waza-talk
    type: article
lastReviewed: 2026-11-01
published: true
`

const sections = (ids: readonly string[] = MDX_SECTIONS) =>
  ids.map((id) => `<ArticleSection id="${id}">\nDraft.\n</ArticleSection>`).join('\n\n')

const mdx = (title: string, body = sections()) => `---\ntitle: ${title}\ndescription: A description.\n---\n\n${body}\n`

let root: string

function write(relative: string, contents: string) {
  const file = path.join(root, relative)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, contents)
}

function writeTopic(slug: string, related: string[] = []) {
  write(`concurrency/${slug}/topic.yaml`, topicYaml(related))
  write(`concurrency/${slug}/en.mdx`, mdx(`${slug} en`))
  write(`concurrency/${slug}/pt.mdx`, mdx(`${slug} pt`))
}

function setupValid() {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'devatlas-content-'))
  write('concurrency/category.yaml', CATEGORY_YAML)
  writeTopic('mutex', ['race-condition'])
  writeTopic('race-condition', ['mutex'])
  write('learning-paths.yaml', `- id: basics\n  title: { en: Basics, pt: Básico }\n  description: { en: Start., pt: Comece. }\n  topics: [mutex, race-condition]\n`)
}

function expectErrors(...fragments: string[]) {
  try {
    loadContent(root)
  } catch (error) {
    expect(error).toBeInstanceOf(ContentValidationError)
    const { issues } = error as ContentValidationError
    for (const fragment of fragments) {
      expect(issues.some((issue) => issue.includes(fragment)), `missing issue "${fragment}" in:\n${issues.join('\n')}`).toBe(true)
    }
    return
  }
  throw new Error('expected loadContent to fail')
}

afterEach(() => fs.rmSync(root, { recursive: true, force: true }))

describe('loadContent', () => {
  it('loads categories, topics and learning paths with derived slug and category', () => {
    setupValid()
    const content = loadContent(root)

    expect(content.categories).toHaveLength(1)
    expect(content.categories[0]).toMatchObject({ id: 'concurrency', name: { en: 'Concurrency' } })
    expect(content.topics.map((topic) => topic.slug).sort()).toEqual(['mutex', 'race-condition'])
    const mutex = content.topics.find((topic) => topic.slug === 'mutex')
    expect(mutex).toMatchObject({
      category: 'concurrency',
      featured: false,
      lastReviewed: '2026-11-01',
      translations: { en: { title: 'mutex en' }, pt: { title: 'mutex pt' } },
    })
    expect(content.learningPaths[0]?.topics).toEqual(['mutex', 'race-condition'])
  })

  it('fails when a required metadata field is missing', () => {
    setupValid()
    write('concurrency/mutex/topic.yaml', topicYaml().replace('difficulty: beginner\n', ''))
    expectErrors('concurrency/mutex/topic.yaml', 'difficulty')
  })

  it('fails when a locale file is missing', () => {
    setupValid()
    fs.rmSync(path.join(root, 'concurrency/mutex/pt.mdx'))
    expectErrors('concurrency/mutex/pt.mdx')
  })

  it('fails when a related slug does not exist', () => {
    setupValid()
    write('concurrency/mutex/topic.yaml', topicYaml(['deadlock']))
    expectErrors('related topic "deadlock" does not exist')
  })

  it('fails when the subcategory is not declared by the category', () => {
    setupValid()
    write('concurrency/mutex/topic.yaml', topicYaml().replace('execution-models', 'unknown'))
    expectErrors('subcategory "unknown"')
  })

  it('fails when the MDX does not contain every editorial section in order', () => {
    setupValid()
    write('concurrency/mutex/en.mdx', mdx('mutex', sections([...MDX_SECTIONS].reverse())))
    expectErrors('concurrency/mutex/en.mdx', 'editorial sections')
  })

  it('fails when the MDX frontmatter is incomplete', () => {
    setupValid()
    write('concurrency/mutex/en.mdx', `---\ntitle: Only title\n---\n\n${sections()}\n`)
    expectErrors('concurrency/mutex/en.mdx', 'description')
  })

  it('fails when a learning path references an unknown topic', () => {
    setupValid()
    write('learning-paths.yaml', `- id: basics\n  title: { en: B, pt: B }\n  description: { en: D, pt: D }\n  topics: [mutex, ghost]\n`)
    expectErrors('learning path "basics" references unknown topic "ghost"')
  })

  it('fails when a topic folder lives in a category without category.yaml', () => {
    setupValid()
    write('orphan/thing/topic.yaml', topicYaml())
    expectErrors('orphan/category.yaml')
  })
})
