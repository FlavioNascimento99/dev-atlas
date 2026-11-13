import type { Locale } from './types'

export const LOCALES = ['en', 'pt'] as const

export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  pt: 'Português',
}

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.some((locale) => locale === value)
}
