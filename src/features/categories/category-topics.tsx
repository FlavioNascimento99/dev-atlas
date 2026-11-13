'use client'

import { Search } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { TopicCard } from '@/components/content/topic-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DIFFICULTIES } from '@/lib/content/constants'
import { format } from '@/lib/i18n/dictionary'
import { cn } from '@/lib/utils'
import { filterTopics } from './filter-topics'
import type { CategoryTopicsLabels, FilterableTopic, TopicFilters } from './types'

type CategoryTopicsProps = {
  topics: FilterableTopic[]
  subcategories: { id: string; label: string }[]
  labels: CategoryTopicsLabels
}

const EMPTY_FILTERS: TopicFilters = { query: '', difficulty: null, tag: null }

/** Client-side contextual search for a single category (doc 02 §4.2). */
export function CategoryTopics({ topics, subcategories, labels }: CategoryTopicsProps) {
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const inputId = useId()
  const visible = filterTopics(topics, filters)
  const tags = [...new Set(topics.flatMap((topic) => topic.tags))].sort()
  const hasFilters = filters.query !== '' || filters.difficulty !== null || filters.tag !== null
  const update = (patch: Partial<TopicFilters>) => setFilters((current) => ({ ...current, ...patch }))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-lg border bg-subtle p-4">
        <div className="relative">
          <label htmlFor={inputId} className="sr-only">
            {labels.filterLabel}
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            id={inputId}
            type="search"
            value={filters.query}
            placeholder={labels.filterPlaceholder}
            onChange={(event) => update({ query: event.target.value })}
            className="bg-background pl-9"
          />
        </div>
        <FilterGroup label={labels.difficulty}>
          <Chip pressed={filters.difficulty === null} onClick={() => update({ difficulty: null })}>
            {labels.all}
          </Chip>
          {DIFFICULTIES.map((difficulty) => (
            <Chip
              key={difficulty}
              pressed={filters.difficulty === difficulty}
              onClick={() => update({ difficulty: filters.difficulty === difficulty ? null : difficulty })}
            >
              {labels.difficulties[difficulty]}
            </Chip>
          ))}
        </FilterGroup>
        <FilterGroup label={labels.tags}>
          {tags.map((tag) => (
            <Chip key={tag} pressed={filters.tag === tag} onClick={() => update({ tag: filters.tag === tag ? null : tag })}>
              #{tag}
            </Chip>
          ))}
        </FilterGroup>
        <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <p aria-live="polite">{format(labels.resultCount, { count: visible.length, total: topics.length })}</p>
          {hasFilters && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
              {labels.clear}
            </Button>
          )}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-muted-foreground">{labels.noMatches}</p>
      ) : (
        subcategories.map((subcategory) => {
          const items = visible.filter((topic) => topic.subcategory === subcategory.id)
          if (items.length === 0) return null
          return (
            <section key={subcategory.id} aria-labelledby={`subcategory-${subcategory.id}`}>
              <h3 id={`subcategory-${subcategory.id}`} className="mb-3 text-lg font-semibold tracking-tight">
                {subcategory.label}
              </h3>
              <ul className="grid gap-3 md:grid-cols-2">
                {items.map((topic) => (
                  <li key={topic.href}>
                    <TopicCard {...topic} />
                  </li>
                ))}
              </ul>
            </section>
          )
        })
      )}
    </div>
  )
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase" aria-hidden>
        {label}
      </span>
      {children}
    </div>
  )
}

function Chip({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        'rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground',
        pressed && 'border-primary bg-primary text-primary-foreground hover:text-primary-foreground',
      )}
    >
      {children}
    </button>
  )
}
