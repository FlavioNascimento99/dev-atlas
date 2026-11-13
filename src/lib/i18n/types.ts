import type { LOCALES } from './config'
import type { en } from './dictionaries/en'

export type Locale = (typeof LOCALES)[number]

export type Dictionary = typeof en
