import type { LOCALES } from './config'
import type { en } from './dictionaries/en'

export type Locale = (typeof LOCALES)[number]

export type Localized<T = string> = Record<Locale, T>

export type Dictionary = typeof en
