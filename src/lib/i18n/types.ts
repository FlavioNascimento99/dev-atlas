import type { LOCALES } from './config'

export type Locale = (typeof LOCALES)[number]

export type Localized<T = string> = Record<Locale, T>
