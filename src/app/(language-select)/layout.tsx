import '@/styles/globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { fontVariables } from '@/app/fonts'
import { ThemeScript } from '@/components/layout/theme-script'
import { DEFAULT_LOCALE } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionary'

const { site } = getDictionary(DEFAULT_LOCALE)

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.tagline,
}

/** Root layout for `/` only; localized pages use the `/[lang]` root layout. */
export default function LanguageSelectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={DEFAULT_LOCALE} className={fontVariables} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  )
}
