import type { Locale } from '@/lib/i18n/types'

export const routes = {
  home: (locale: Locale) => `/${locale}/`,
  explore: (locale: Locale) => `/${locale}/explore/`,
  search: (locale: Locale) => `/${locale}/search/`,
  category: (locale: Locale, category: string) => `/${locale}/categories/${category}/`,
  topic: (locale: Locale, slug: string) => `/${locale}/topics/${slug}/`,
}

/** Rewrites the locale segment of a pathname, keeping the rest of the route. */
export function switchLocale(pathname: string, locale: Locale): string {
  const [, , ...rest] = pathname.split('/')
  return `/${[locale, ...rest].join('/')}`
}
