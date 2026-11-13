// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { CategoryTopics } from '@/features/categories/category-topics'
import type { CategoryTopicsLabels, FilterableTopic } from '@/features/categories/types'
import { en } from '@/lib/i18n/dictionaries/en'

const labels: CategoryTopicsLabels = { ...en.category, difficulties: en.difficulty }

const topics: FilterableTopic[] = [
  { href: '/en/topics/a/', title: 'Load Balancing', description: 'Spread requests.', difficulty: 'beginner', difficultyLabel: 'Beginner', tags: ['traffic'], subcategory: 'traffic' },
  { href: '/en/topics/b/', title: 'Caching', description: 'Keep copies.', difficulty: 'intermediate', difficultyLabel: 'Intermediate', tags: ['latency'], subcategory: 'caching' },
]
const subcategories = [
  { id: 'traffic', label: 'Traffic management' },
  { id: 'caching', label: 'Caching strategies' },
]

afterEach(cleanup)

describe('CategoryTopics', () => {
  it('groups topics by subcategory and narrows them with the contextual filters', () => {
    render(<CategoryTopics topics={topics} subcategories={subcategories} labels={labels} />)
    expect(screen.getByText('2 of 2 topics')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Traffic management' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Intermediate' }))
    expect(screen.getByText('1 of 2 topics')).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Load Balancing' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Intermediate' }).getAttribute('aria-pressed')).toBe('true')

    fireEvent.change(screen.getByLabelText(labels.filterLabel), { target: { value: 'nothing-matches' } })
    expect(screen.getByText(labels.noMatches)).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: labels.clear }))
    expect(screen.getByText('2 of 2 topics')).toBeTruthy()
  })
})
