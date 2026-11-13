import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CategoryIcon } from '@/components/content/category-icon'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { CategoryTopics } from '@/features/categories/category-topics'
import { toTopicCard } from '@/features/topics/topic-card-data'
import { getCategories, getCategory, getTopicsByCategory } from '@/lib/content/queries'
import { getDictionary } from '@/lib/i18n/dictionary'
import { resolveLocale } from '@/lib/i18n/resolve-locale'
import { languageAlternates, routes } from '@/lib/routes'

export const dynamicParams = false

export function generateStaticParams() {
  return getCategories().map((category) => ({ category: category.id }))
}

export async function generateMetadata({ params }: PageProps<'/[lang]/categories/[category]'>): Promise<Metadata> {
  const { lang, category: id } = await params
  const category = getCategory(id)
  if (!category) return {}
  const locale = resolveLocale(lang)
  return {
    title: category.name[locale],
    description: category.description[locale],
    alternates: { languages: languageAlternates((target) => routes.category(target, id)) },
  }
}

export default async function CategoryPage({ params }: PageProps<'/[lang]/categories/[category]'>) {
  const { lang, category: id } = await params
  const locale = resolveLocale(lang)
  const category = getCategory(id)
  if (!category) notFound()

  const dictionary = getDictionary(locale)
  const topics = getTopicsByCategory(category.id).map((topic) => ({
    ...toTopicCard(topic, locale, dictionary, false),
    tags: topic.tags,
    subcategory: topic.subcategory,
  }))

  return (
    <div className="mx-auto max-w-5xl">
      <Breadcrumbs
        label={dictionary.nav.breadcrumbs}
        items={[{ label: dictionary.nav.home, href: routes.home(locale) }, { label: category.name[locale] }]}
      />
      <header data-pagefind-body className="mb-10 flex flex-col gap-4">
        <span data-pagefind-filter={`category:${category.id}`} data-pagefind-meta="kind:category" />
        <span className="grid size-12 place-items-center rounded-lg border bg-subtle text-brand">
          <CategoryIcon name={category.icon} className="size-6" />
        </span>
        <h1 className="text-4xl font-bold tracking-tight lg:text-[2.75rem]">{category.name[locale]}</h1>
        <p data-pagefind-meta="description" className="max-w-[65ch] text-lg text-muted-foreground">
          {category.description[locale]}
        </p>
      </header>

      <h2 className="mb-4 text-2xl font-semibold tracking-tight">{dictionary.category.topics}</h2>
      <CategoryTopics
        topics={topics}
        subcategories={Object.entries(category.subcategories).map(([subId, name]) => ({ id: subId, label: name[locale] }))}
        labels={{ ...dictionary.category, difficulties: dictionary.difficulty }}
      />
    </div>
  )
}
