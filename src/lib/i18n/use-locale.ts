'use client'

import { usePathname } from 'next/navigation'
import { DEFAULT_LOCALE, isLocale } from './config'
import type { Locale } from './types'

/** Locale of the current route, for client components rendered inside MDX that receive no locale prop. */
export function useLocale(): Locale {
  const segment = usePathname().split('/')[1]
  return isLocale(segment) ? segment : DEFAULT_LOCALE
}
