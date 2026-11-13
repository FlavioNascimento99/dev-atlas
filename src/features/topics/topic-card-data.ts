import type { TopicCardProps } from '@/components/content/types'
import { getCategory } from '@/lib/content/queries'
import type { Topic } from '@/lib/content/types'
import type { Dictionary, Locale } from '@/lib/i18n/types'
import { routes } from '@/lib/routes'

export function toTopicCard(topic: Topic, locale: Locale, dictionary: Dictionary, withCategory = true): TopicCardProps {
  const { title, description } = topic.translations[locale]
  return {
    href: routes.topic(locale, topic.slug),
    title,
    description,
    difficulty: topic.difficulty,
    difficultyLabel: dictionary.difficulty[topic.difficulty],
    categoryLabel: withCategory ? getCategory(topic.category)?.name[locale] : undefined,
  }
}
