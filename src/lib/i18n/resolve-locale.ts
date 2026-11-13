import { notFound } from 'next/navigation'
import { isLocale } from './config'
import type { Locale } from './types'

export function resolveLocale(segment: string): Locale {
  if (!isLocale(segment)) notFound()
  return segment
}
