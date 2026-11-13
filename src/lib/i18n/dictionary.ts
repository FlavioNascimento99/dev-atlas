import { en } from './dictionaries/en'
import { pt } from './dictionaries/pt'
import type { Dictionary, Locale } from './types'

const dictionaries: Record<Locale, Dictionary> = { en, pt }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

/** Replaces `{name}` placeholders in a dictionary string. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match))
}
