'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LOCALES, LOCALE_NAMES } from '@/lib/i18n/config'
import { useLocale } from '@/lib/i18n/use-locale'
import { switchLocale } from '@/lib/routes'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ label }: { label: string }) {
  const pathname = usePathname()
  const current = useLocale()

  return (
    <nav aria-label={label} className="flex items-center rounded-md border bg-subtle p-0.5">
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={switchLocale(pathname, locale)}
          hrefLang={locale}
          lang={locale}
          aria-current={locale === current ? 'true' : undefined}
          title={LOCALE_NAMES[locale]}
          className={cn(
            'grid h-8 min-w-9 place-items-center rounded px-2 text-xs font-semibold text-muted-foreground uppercase transition-colors hover:text-foreground',
            locale === current && 'bg-background text-foreground shadow-sm',
          )}
        >
          <span aria-hidden>{locale}</span>
          <span className="sr-only">{LOCALE_NAMES[locale]}</span>
        </Link>
      ))}
    </nav>
  )
}
