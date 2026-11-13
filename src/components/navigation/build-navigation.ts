import { getCategories, getTopicsByCategory } from '@/lib/content/queries'
import type { Dictionary, Locale } from '@/lib/i18n/types'
import { routes } from '@/lib/routes'
import type { NavData } from './types'

export function buildNavigation(locale: Locale, dictionary: Dictionary): NavData {
  return {
    labels: {
      primary: dictionary.nav.primary,
      home: dictionary.nav.home,
      explore: dictionary.nav.explore,
      categories: dictionary.nav.categories,
    },
    homeHref: routes.home(locale),
    exploreHref: routes.explore(locale),
    categories: getCategories().map((category) => ({
      id: category.id,
      icon: category.icon,
      label: category.name[locale],
      href: routes.category(locale, category.id),
      topics: getTopicsByCategory(category.id).map((topic) => ({
        label: topic.translations[locale].title,
        href: routes.topic(locale, topic.slug),
      })),
    })),
  }
}
