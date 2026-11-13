'use client'

import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import { useSyncExternalStore } from 'react'
import type { Dictionary } from '@/lib/i18n/types'
import { THEMES } from '@/lib/theme/constants'
import { getServerTheme, getTheme, setTheme, subscribeTheme } from '@/lib/theme/store'
import type { Theme } from '@/lib/theme/types'
import { cn } from '@/lib/utils'

const ICONS: Record<Theme, LucideIcon> = { system: Monitor, light: Sun, dark: Moon }

export function ThemeToggle({ labels }: { labels: Dictionary['theme'] }) {
  const current = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme)

  return (
    <div role="group" aria-label={labels.label} className="flex items-center rounded-md border bg-subtle p-0.5">
      {THEMES.map((theme) => {
        const Icon = ICONS[theme]
        const checked = theme === current
        return (
          <button
            key={theme}
            type="button"
            aria-pressed={checked}
            aria-label={labels[theme]}
            title={labels[theme]}
            onClick={() => setTheme(theme)}
            className={cn(
              'grid size-8 place-items-center rounded text-muted-foreground transition-colors hover:text-foreground',
              checked && 'bg-background text-foreground shadow-sm',
            )}
          >
            <Icon className="size-4" aria-hidden />
          </button>
        )
      })}
    </div>
  )
}
