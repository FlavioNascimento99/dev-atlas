import type { Difficulty } from '@/lib/content/types'
import type { Dictionary } from '@/lib/i18n/types'

/** Subset of the Pagefind JS API (https://pagefind.app/docs/api/) used by the search page. */
export type Pagefind = {
  search: (
    term: string | null,
    options?: { filters?: Record<string, string> },
  ) => Promise<{ results: { id: string; data: () => Promise<PagefindResultData> }[] }>
}

export type PagefindResultData = {
  url: string
  excerpt: string
  meta: Partial<Record<'title' | 'category' | 'description' | 'difficulty' | 'kind', string>>
}

export type SearchResult = {
  id: string
  url: string
  title: string
  excerpt: string
  category?: string
  description?: string
  difficulty?: string
  isCategory: boolean
}

export type SearchLabels = Dictionary['search'] & {
  difficulties: Record<Difficulty, string>
}

export type SearchOption = {
  value: string
  label: string
}
