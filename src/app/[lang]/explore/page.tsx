import type { Metadata } from 'next'
import Link from 'next/link'
import { CategoryIcon } from '@/components/content/category-icon'
import { DifficultyBadge } from '@/components/content/difficulty-badge'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { getCategories, getTopicsByCategory } from '@/lib/content/queries'
import { getDictionary } from '@/lib/i18n/dictionary'
import { resolveLocale } from '@/lib/i18n/resolve-locale'
import { languageAlternates, routes } from '@/lib/routes'

export async function generateMetadata({ params }: PageProps<'/[lang]/explore'>): Promise<Metadata> {
  const { explore } = getDictionary(resolveLocale((await params).lang))
  return { title: explore.title, description: explore.description, alternates: { languages: languageAlternates(routes.explore) } }
}

export default async function ExplorePage({ params }: PageProps<'/[lang]/explore'>) {
  const locale = resolveLocale((await params).lang)
  const dictionary = getDictionary(locale)

  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs
        label={dictionary.nav.breadcrumbs}
        items={[{ label: dictionary.nav.home, href: routes.home(locale) }, { label: dictionary.explore.title }]}
      />
      <header className="mb-10 flex flex-col gap-3">
        <h1 className="text-4xl font-bold tracking-tight lg:text-[2.75rem]">{dictionary.explore.title}</h1>
        <p className="max-w-[65ch] text-lg text-muted-foreground">{dictionary.explore.description}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {getCategories().map((category) => (
          <section key={category.id} aria-labelledby={`explore-${category.id}`} className="rounded-lg border p-5">
            <h2 id={`explore-${category.id}`} className="mb-1 flex items-center gap-2.5 text-lg font-semibold tracking-tight">
              <CategoryIcon name={category.icon} className="size-5 text-brand" />
              <Link href={routes.category(locale, category.id)} className="hover:underline">
                {category.name[locale]}
              </Link>
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">{category.description[locale]}</p>
            <ul className="flex flex-col divide-y">
              {getTopicsByCategory(category.id).map((topic) => (
                <li key={topic.slug} className="flex items-center justify-between gap-3 py-2">
                  <Link href={routes.topic(locale, topic.slug)} className="text-sm font-medium text-primary hover:underline">
                    {topic.translations[locale].title}
                  </Link>
                  <DifficultyBadge difficulty={topic.difficulty} label={dictionary.difficulty[topic.difficulty]} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
