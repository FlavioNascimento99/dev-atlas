'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { DEFAULT_LOCALE, LOCALES, LOCALE_NAMES, isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionary'
import { routes } from '@/lib/routes'
import { Logo } from './logo'

/**
 * Static export has no middleware, so `/` picks the locale in the browser from `navigator.language`.
 * The links stay visible as a fallback when JavaScript is disabled or the redirect is slow.
 */
export function LanguagePicker() {
  useEffect(() => {
    const preferred = navigator.languages.map((tag) => tag.slice(0, 2).toLowerCase()).find((tag) => isLocale(tag))
    window.location.replace(routes.home(isLocale(preferred) ? preferred : DEFAULT_LOCALE))
  }, [])

  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <div className="flex flex-col items-center gap-6 text-center">
        <Logo className="size-12" />
        {LOCALES.map((locale) => (
          <p key={locale} lang={locale} className="text-muted-foreground">
            {getDictionary(locale).languagePicker.redirecting}
          </p>
        ))}
        <ul className="flex gap-3">
          {LOCALES.map((locale) => (
            <li key={locale}>
              <Link
                href={routes.home(locale)}
                hrefLang={locale}
                lang={locale}
                className="inline-flex h-10 items-center rounded-md border px-5 font-medium hover:bg-surface"
              >
                {LOCALE_NAMES[locale]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
