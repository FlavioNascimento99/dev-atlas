'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { TocItem } from './types'

/** Top band of the viewport (below the sticky header) where a heading counts as "being read". */
const READING_ZONE = '-72px 0px -65% 0px'

type TableOfContentsProps = {
  title: string
  items: TocItem[]
  /** Renders as an expandable menu, used on tablet and mobile (doc 02 §7). */
  collapsible?: boolean
  className?: string
}

export function TableOfContents({ title, items, collapsible = false, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: READING_ZONE },
    )
    for (const item of items) {
      const heading = document.getElementById(item.id)
      if (heading) observer.observe(heading)
    }
    return () => observer.disconnect()
  }, [items])

  const list = (
    <ol className="flex flex-col gap-0.5 border-l text-sm">
      {items.map((item, index) => {
        const active = item.id === activeId
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active ? 'location' : undefined}
              className={cn(
                '-ml-px flex gap-2 border-l-2 border-transparent py-1 pl-3 text-muted-foreground transition-colors hover:text-foreground',
                active && 'border-brand font-medium text-foreground',
              )}
            >
              <span className="font-mono text-xs leading-5 opacity-70" aria-hidden>
                {String(index + 1).padStart(2, '0')}
              </span>
              {item.label}
            </a>
          </li>
        )
      })}
    </ol>
  )

  if (collapsible) {
    return (
      <details className={cn('group rounded-lg border bg-subtle', className)}>
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
          {title}
          <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <nav aria-label={title} className="px-4 pb-4">
          {list}
        </nav>
      </details>
    )
  }

  return (
    <nav aria-labelledby="toc-title" className={className}>
      <p id="toc-title" className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </p>
      {list}
    </nav>
  )
}
