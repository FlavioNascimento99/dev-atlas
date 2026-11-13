import type { z } from 'zod'
import type { Locale } from '@/lib/i18n/types'
import type { DIFFICULTIES, EDITORIAL_SECTIONS, MDX_SECTIONS } from './constants'
import type {
  categorySchema,
  learningPathsSchema,
  referenceSchema,
  topicMetaSchema,
  topicTranslationSchema,
} from './schema'

export type Difficulty = (typeof DIFFICULTIES)[number]
export type EditorialSection = (typeof EDITORIAL_SECTIONS)[number]
export type MdxSection = (typeof MDX_SECTIONS)[number]

export type Reference = z.infer<typeof referenceSchema>
export type TopicTranslation = z.infer<typeof topicTranslationSchema>
export type LearningPath = z.infer<typeof learningPathsSchema>[number]

export type Category = z.infer<typeof categorySchema> & {
  id: string
}

export type Topic = z.infer<typeof topicMetaSchema> & {
  slug: string
  category: string
  translations: Record<Locale, TopicTranslation>
}

export type ContentIndex = {
  categories: Category[]
  topics: Topic[]
  learningPaths: LearningPath[]
}
