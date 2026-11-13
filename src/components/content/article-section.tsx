import type { ReactNode } from 'react'
import { EDITORIAL_SECTIONS } from '@/lib/content/constants'
import type { EditorialSection } from '@/lib/content/types'

type ArticleSectionProps = {
  id: EditorialSection
  title: string
  children: ReactNode
}

/** One numbered section of the editorial model (doc 01 §4.1). */
export function ArticleSection({ id, title, children }: ArticleSectionProps) {
  const number = EDITORIAL_SECTIONS.indexOf(id) + 1
  return (
    <section aria-labelledby={id} className="border-t py-8">
      <h2 id={id} className="mb-4 flex items-baseline gap-3 text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
        <span className="font-mono text-sm font-medium text-brand" aria-hidden>
          {String(number).padStart(2, '0')}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}
