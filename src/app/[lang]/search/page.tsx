import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { SearchView } from '@/features/search/search-view'
import { getCategories } from '@/lib/content/queries'
import { getDictionary } from '@/lib/i18n/dictionary'
import { resolveLocale } from '@/lib/i18n/resolve-locale'
import { languageAlternates, routes } from '@/lib/routes'

export async function generateMetadata({ params }: PageProps<'/[lang]/search'>): Promise<Metadata> {
  const { search } = getDictionary(resolveLocale((await params).lang))
  return { title: search.title, description: search.description, alternates: { languages: languageAlternates(routes.search) } }
}

export default async function SearchPage({ params }: PageProps<'/[lang]/search'>) {
  const locale = resolveLocale((await params).lang)
  const dictionary = getDictionary(locale)

  return (
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs
        label={dictionary.nav.breadcrumbs}
        items={[{ label: dictionary.nav.home, href: routes.home(locale) }, { label: dictionary.search.title }]}
      />
      <header className="mb-8 flex flex-col gap-3">
        <h1 className="text-4xl font-bold tracking-tight lg:text-[2.75rem]">{dictionary.search.title}</h1>
        <p className="text-lg text-muted-foreground">{dictionary.search.description}</p>
      </header>
      {/* useSearchParams needs a Suspense boundary in a statically exported page. */}
      <Suspense>
        <SearchView
          categories={getCategories().map((category) => ({ value: category.id, label: category.name[locale] }))}
          labels={{ ...dictionary.search, difficulties: dictionary.difficulty }}
        />
      </Suspense>
    </div>
  )
}
