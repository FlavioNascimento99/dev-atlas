'use client'

import { Search } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useId, useState } from 'react'
import { Input } from '@/components/ui/input'
import { DIFFICULTIES } from '@/lib/content/constants'
import { format } from '@/lib/i18n/dictionary'
import { searchSite } from './pagefind'
import type { SearchLabels, SearchOption, SearchResult } from './types'

const DEBOUNCE_MS = 200

type SearchState = { query: string; category: string; difficulty: string }
type SearchResponse = { key: string; results: SearchResult[] } | { key: string; unavailable: true }

export function SearchView({ categories, labels }: { categories: SearchOption[]; labels: SearchLabels }) {
  const params = useSearchParams()
  const [state, setState] = useState<SearchState>({
    query: params.get('q') ?? '',
    category: params.get('category') ?? '',
    difficulty: params.get('difficulty') ?? '',
  })
  const [response, setResponse] = useState<SearchResponse | null>(null)
  const ids = { query: useId(), category: useId(), difficulty: useId() }

  const term = state.query.trim()
  const hasInput = term !== '' || state.category !== '' || state.difficulty !== ''
  const key = JSON.stringify([term, state.category, state.difficulty])

  useEffect(() => {
    if (!hasInput) return
    let cancelled = false
    const timer = setTimeout(async () => {
      const filters = Object.fromEntries(
        Object.entries({ category: state.category, difficulty: state.difficulty }).filter(([, value]) => value !== ''),
      )
      try {
        const results = await searchSite(term, filters)
        if (!cancelled) setResponse({ key, results })
      } catch {
        if (!cancelled) setResponse({ key, unavailable: true })
      }
    }, DEBOUNCE_MS)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [hasInput, key, term, state.category, state.difficulty])

  function update(patch: Partial<SearchState>) {
    const next = { ...state, ...patch }
    setState(next)
    const url = new URL(window.location.href)
    for (const [name, value] of [['q', next.query], ['category', next.category], ['difficulty', next.difficulty]] as const) {
      if (value) url.searchParams.set(name, value)
      else url.searchParams.delete(name)
    }
    window.history.replaceState(null, '', url)
  }

  const current = response?.key === key ? response : null

  return (
    <div className="flex flex-col gap-6">
      <form role="search" onSubmit={(event) => event.preventDefault()} className="flex flex-col gap-3 rounded-lg border bg-subtle p-4">
        <label htmlFor={ids.query} className="sr-only">
          {labels.label}
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            id={ids.query}
            type="search"
            autoFocus
            value={state.query}
            placeholder={labels.placeholder}
            onChange={(event) => update({ query: event.target.value })}
            className="h-11 bg-background pl-9 text-base"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select id={ids.category} label={labels.category} allLabel={labels.all} value={state.category} options={categories} onChange={(category) => update({ category })} />
          <Select
            id={ids.difficulty}
            label={labels.difficulty}
            allLabel={labels.all}
            value={state.difficulty}
            options={DIFFICULTIES.map((value) => ({ value, label: labels.difficulties[value] }))}
            onChange={(difficulty) => update({ difficulty })}
          />
        </div>
      </form>

      <div aria-live="polite" aria-busy={hasInput && !current}>
        {!hasInput ? (
          <p className="text-muted-foreground">{labels.prompt}</p>
        ) : !current ? (
          <p className="text-muted-foreground">{labels.loading}</p>
        ) : 'unavailable' in current ? (
          <p className="rounded-lg border border-l-4 border-l-warning bg-subtle p-4">{labels.unavailable}</p>
        ) : current.results.length === 0 ? (
          <p className="text-muted-foreground">{format(labels.noResults, { query: term })}</p>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">{format(labels.resultCount, { count: current.results.length })}</p>
            <ul className="flex flex-col gap-3">
              {current.results.map((result) => (
                <li key={result.id}>
                  <ResultCard result={result} categoryLabel={labels.categoryResult} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

function ResultCard({ result, categoryLabel }: { result: SearchResult; categoryLabel: string }) {
  const details = [result.isCategory ? categoryLabel : result.category, result.difficulty].filter(Boolean)
  return (
    <article className="relative rounded-lg border p-4 transition-colors hover:border-brand/60 hover:bg-subtle">
      <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">{details.join(' · ')}</p>
      <h2 className="font-semibold tracking-tight">
        <Link href={result.url} className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-ring">
          {result.title}
        </Link>
      </h2>
      {result.description && <p className="mt-1 text-sm text-muted-foreground">{result.description}</p>}
      <p
        className="mt-2 text-sm [&_mark]:rounded-sm [&_mark]:bg-brand/20 [&_mark]:px-0.5 [&_mark]:text-foreground"
        dangerouslySetInnerHTML={{ __html: result.excerpt }}
      />
    </article>
  )
}

type SelectProps = {
  id: string
  label: string
  allLabel: string
  value: string
  options: SearchOption[]
  onChange: (value: string) => void
}

function Select({ id, label, allLabel, value, options, onChange }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 rounded-md border bg-background px-3 text-sm"
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
