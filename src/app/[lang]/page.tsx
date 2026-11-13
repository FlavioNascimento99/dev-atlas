import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { TopicCard } from '@/components/content/topic-card'
import { Button } from '@/components/ui/button'
import { DomainCard } from '@/features/home/domain-card'
import { LearningPathCard } from '@/features/home/learning-path-card'
import { toTopicCard } from '@/features/topics/topic-card-data'
import { getCategories, getContent, getPublishedTopics, getTopicsByCategory, getTopicsBySlugs } from '@/lib/content/queries'
import { format, getDictionary } from '@/lib/i18n/dictionary'
import { resolveLocale } from '@/lib/i18n/resolve-locale'
import { routes } from '@/lib/routes'

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const locale = resolveLocale((await params).lang)
  const dictionary = getDictionary(locale)
  const { home } = dictionary
  const featured = getPublishedTopics().filter((topic) => topic.featured)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 pb-8">
      <section aria-labelledby="hero-title" className="flex flex-col items-start gap-5 pt-4 sm:pt-10">
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">{home.eyebrow}</p>
        <h1 id="hero-title" className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {home.title}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{home.description}</p>
        <Button asChild size="lg" className="mt-2">
          <Link href={routes.explore(locale)}>
            {home.cta}
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      </section>

      <HomeSection id="domains" title={home.domainsTitle}>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {getCategories().map((category) => (
            <li key={category.id}>
              <DomainCard
                href={routes.category(locale, category.id)}
                icon={category.icon}
                name={category.name[locale]}
                description={category.description[locale]}
                countLabel={format(home.topicCount, { count: getTopicsByCategory(category.id).length })}
              />
            </li>
          ))}
        </ul>
      </HomeSection>

      <HomeSection id="featured" title={home.featuredTitle}>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((topic) => (
            <li key={topic.slug}>
              <TopicCard {...toTopicCard(topic, locale, dictionary)} />
            </li>
          ))}
        </ul>
      </HomeSection>

      <HomeSection id="learning-paths" title={home.pathsTitle} description={home.pathsDescription}>
        <ul className="grid gap-4 lg:grid-cols-3">
          {getContent().learningPaths.map((path) => (
            <li key={path.id}>
              <LearningPathCard
                title={path.title[locale]}
                description={path.description[locale]}
                steps={getTopicsBySlugs(path.topics).map((topic) => ({
                  href: routes.topic(locale, topic.slug),
                  label: topic.translations[locale].title,
                }))}
              />
            </li>
          ))}
        </ul>
      </HomeSection>
    </div>
  )
}

function HomeSection({ id, title, description, children }: { id: string; title: string; description?: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 border-t pt-8">
        <h2 id={id} className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  )
}
