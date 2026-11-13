'use client'

import { ChevronRight, Compass, House } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { CategoryIcon } from '@/components/content/category-icon'
import { cn } from '@/lib/utils'
import type { NavData } from './types'

type SidebarNavProps = NavData & {
  onNavigate?: () => void
}

export function SidebarNav({ labels, homeHref, exploreHref, categories, onNavigate }: SidebarNavProps) {
  const pathname = usePathname()
  const [toggled, setToggled] = useState<Record<string, boolean>>({})
  const activeCategory = categories.find(
    (category) => category.href === pathname || category.topics.some((topic) => topic.href === pathname),
  )?.id

  return (
    <nav aria-label={labels.primary} className="flex flex-col gap-6 text-sm">
      <ul className="flex flex-col gap-0.5">
        <li>
          <NavItem href={homeHref} active={pathname === homeHref} onNavigate={onNavigate}>
            <House className="size-4" aria-hidden />
            {labels.home}
          </NavItem>
        </li>
        <li>
          <NavItem href={exploreHref} active={pathname === exploreHref} onNavigate={onNavigate}>
            <Compass className="size-4" aria-hidden />
            {labels.explore}
          </NavItem>
        </li>
      </ul>

      <div>
        <h2 id="sidebar-categories" className="mb-2 px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          {labels.categories}
        </h2>
        <ul aria-labelledby="sidebar-categories" className="flex flex-col gap-0.5">
          {categories.map((category) => {
            const expanded = toggled[category.id] ?? category.id === activeCategory
            const listId = `sidebar-topics-${category.id}`
            return (
              <li key={category.id}>
                <div className="flex items-center gap-1">
                  <NavItem
                    href={category.href}
                    active={pathname === category.href}
                    highlighted={category.id === activeCategory}
                    onNavigate={onNavigate}
                    className="flex-1"
                  >
                    <CategoryIcon name={category.icon} className="size-4" />
                    {category.label}
                  </NavItem>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={listId}
                    aria-label={category.label}
                    onClick={() => setToggled((state) => ({ ...state, [category.id]: !expanded }))}
                    className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-surface hover:text-foreground"
                  >
                    <ChevronRight className={cn('size-4 transition-transform', expanded && 'rotate-90')} aria-hidden />
                  </button>
                </div>
                <ul id={listId} hidden={!expanded} className="mt-0.5 mb-1 ml-5 flex flex-col gap-0.5 border-l pl-2">
                  {category.topics.map((topic) => (
                    <li key={topic.href}>
                      <NavItem href={topic.href} active={pathname === topic.href} onNavigate={onNavigate} className="py-1.5">
                        {topic.label}
                      </NavItem>
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

type NavItemProps = {
  href: string
  active: boolean
  highlighted?: boolean
  onNavigate?: () => void
  className?: string
  children: ReactNode
}

function NavItem({ href, active, highlighted = false, onNavigate, className, children }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative flex items-center gap-2.5 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground',
        (active || highlighted) && 'font-medium text-foreground',
        active &&
          'bg-surface before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-brand',
        className,
      )}
    >
      {children}
    </Link>
  )
}
