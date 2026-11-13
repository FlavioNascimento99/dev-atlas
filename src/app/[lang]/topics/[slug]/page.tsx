import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleSection } from '@/components/content/article-section'
import { createMdxComponents } from '@/components/content/mdx-components'
import { ReferencesList } from '@/components/content/references-list'
import { RelatedConcepts } from '@/components/content/related-concepts'
import { TableOfContents } from '@/components/content/table-of-contents'
import { TopicHeader } from '@/components/content/topic-header'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { toTopicCard } from '@/features/topics/topic-card-data'
import { EDITORIAL_SECTIONS } from '@/lib/content/constants'
import { getCategory, getPublishedTopics, getTopic, getTopicsBySlugs } from '@/lib/content/queries'
import { getDictionary } from '@/lib/i18n/dictionary'
import { resolveLocale } from '@/lib/i18n/resolve-locale'
import { languageAlternates, routes } from '@/lib/routes'

export const dynamicParams = false

export function generateStaticParams() {
  return getPublishedTopics().map((topic) => ({ slug: topic.slug }))
}

export async function generateMetadata({ params }: PageProps<'/[lang]/topics/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await params
  const topic = getTopic(slug)
  if (!topic) return {}
  const { title, description } = topic.translations[resolveLocale(lang)]
  return { title, description, alternates: { languages: languageAlternates((locale) => routes.topic(locale, slug)) } }
}

export default async function TopicPage({ params }: PageProps<'/[lang]/topics/[slug]'>) {
  const { lang, slug } = await params
  const locale = resolveLocale(lang)
  const topic = getTopic(slug)
  const category = topic && getCategory(topic.category)
  if (!topic || !category) notFound()

  const dictionary = getDictionary(locale)
  const { default: Content } = await import(`@content/${topic.category}/${topic.slug}/${locale}.mdx`)
  const tocItems = EDITORIAL_SECTIONS.map((id) => ({ id, label: dictionary.sections[id] }))

  return (
    <div className="mx-auto flex max-w-6xl gap-12">
      <div className="min-w-0 flex-1">
        <Breadcrumbs
          label={dictionary.nav.breadcrumbs}
          items={[
            { label: dictionary.nav.home, href: routes.home(locale) },
            { label: category.name[locale], href: routes.category(locale, category.id) },
            { label: category.subcategories[topic.subcategory]?.[locale] ?? topic.subcategory },
            { label: topic.translations[locale].title },
          ]}
        />
        <TableOfContents title={dictionary.topic.onThisPage} items={tocItems} collapsible className="mb-8 xl:hidden" />

        <article data-pagefind-body>
          <span data-pagefind-filter={`category:${category.id}`} />
          <TopicHeader topic={topic} category={category} locale={locale} dictionary={dictionary} />
          <div className="prose-atlas">
            <Content components={createMdxComponents(dictionary)} />
          </div>
          <div className="max-w-[72ch]" data-pagefind-ignore="all">
            <ArticleSection id="related-concepts" title={dictionary.sections['related-concepts']}>
              <RelatedConcepts
                topics={getTopicsBySlugs(topic.related).map((related) => toTopicCard(related, locale, dictionary))}
                emptyLabel={dictionary.topic.noRelated}
              />
            </ArticleSection>
            <ArticleSection id="references" title={dictionary.sections.references}>
              <ReferencesList references={topic.references} typeLabels={dictionary.referenceTypes} />
            </ArticleSection>
          </div>
        </article>
      </div>

      <aside className="hidden w-60 shrink-0 xl:block">
        <TableOfContents title={dictionary.topic.onThisPage} items={tocItems} className="sticky top-22" />
      </aside>
    </div>
  )
}
