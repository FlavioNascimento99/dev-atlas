import { z } from 'zod'
import { CATEGORY_ICONS, DIFFICULTIES, REFERENCE_TYPES } from './constants'

const text = z.string().trim().min(1)
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be kebab-case')

const localizedSchema = z.strictObject({ en: text, pt: text })

export const categorySchema = z.strictObject({
  icon: z.enum(CATEGORY_ICONS),
  order: z.int().positive(),
  name: localizedSchema,
  description: localizedSchema,
  subcategories: z.record(slug, localizedSchema).refine((value) => Object.keys(value).length > 0, {
    message: 'must define at least one subcategory',
  }),
})

export const referenceSchema = z.strictObject({
  title: text,
  url: z.url({ protocol: /^https$/ }),
  type: z.enum(REFERENCE_TYPES),
})

export const topicMetaSchema = z.strictObject({
  subcategory: slug,
  difficulty: z.enum(DIFFICULTIES),
  readingTime: z.int().positive(),
  tags: z.array(slug).min(1),
  related: z.array(slug),
  references: z.array(referenceSchema).min(1),
  lastReviewed: z.iso.date(),
  published: z.boolean(),
  featured: z.boolean().default(false),
})

export const topicTranslationSchema = z.strictObject({
  title: text,
  description: text,
})

export const learningPathsSchema = z.array(
  z.strictObject({
    id: slug,
    title: localizedSchema,
    description: localizedSchema,
    topics: z.array(slug).min(2),
  }),
)
