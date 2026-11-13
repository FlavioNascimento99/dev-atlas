import { CalendarCheck, Clock } from 'lucide-react'
import Link from 'next/link'
import { format } from '@/lib/i18n/dictionary'
import type { Category, Topic } from '@/lib/content/types'
import type { Dictionary, Locale } from '@/lib/i18n/types'
import { routes } from '@/lib/routes'
import { CategoryIcon } from './category-icon'
import { DifficultyBadge } from './difficulty-badge'

type TopicHeaderProps = {
  topic: Topic
  category: Category
  locale: Locale
  dictionary: Dictionary
}

/** Topic title block (doc 02 §4.3 B). `data-pagefind-meta` attributes feed the search result cards. */
export function TopicHeader({ topic, category, locale, dictionary }: TopicHeaderProps) {
  const { title, description } = topic.translations[locale]

  return (
    <header className="mb-10 flex flex-col gap-4">
      <Link
        href={routes.category(locale, category.id)}
        className="inline-flex w-fit items-center gap-2 text-sm font-semibold tracking-wide text-primary uppercase hover:underline"
      >
        <CategoryIcon name={category.icon} className="size-4" />
        <span data-pagefind-meta="category">{category.name[locale]}</span>
      </Link>
      <h1 className="text-4xl font-bold tracking-tight text-balance lg:text-[2.75rem] lg:leading-tight">{title}</h1>
      <p data-pagefind-meta="description" className="max-w-[65ch] text-lg text-muted-foreground">
        {description}
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span data-pagefind-meta="difficulty" data-pagefind-filter={`difficulty:${topic.difficulty}`}>
          <DifficultyBadge difficulty={topic.difficulty} label={dictionary.difficulty[topic.difficulty]} />
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4" aria-hidden />
          {format(dictionary.topic.readingTime, { minutes: topic.readingTime })}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarCheck className="size-4" aria-hidden />
          {dictionary.topic.lastReviewed}: <time dateTime={topic.lastReviewed}>{topic.lastReviewed}</time>
        </span>
      </div>
      <ul aria-label={dictionary.topic.tags} className="flex flex-wrap gap-1.5">
        {topic.tags.map((tag) => (
          <li key={tag} className="rounded-full bg-surface px-2.5 py-0.5 font-mono text-xs">
            #{tag}
          </li>
        ))}
      </ul>
    </header>
  )
}
