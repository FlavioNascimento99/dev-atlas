import '@/styles/globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { fontVariables } from '@/app/fonts'
import { Logo } from '@/components/layout/logo'
import { ThemeScript } from '@/components/layout/theme-script'
import { DEFAULT_LOCALE, LOCALES } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionary'
import { routes } from '@/lib/routes'

export const metadata: Metadata = {
  title: getDictionary(DEFAULT_LOCALE).notFound.title,
}

/** Single 404 for both root layouts; the URL may not carry a valid locale, so it is bilingual. */
export default function GlobalNotFound() {
  return (
    <html lang={DEFAULT_LOCALE} className={fontVariables} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <main className="grid min-h-dvh place-items-center p-6">
          <div className="flex flex-col items-center gap-8 text-center">
            <Logo className="size-12" />
            <h1 className="font-mono text-sm text-muted-foreground">404</h1>
            {LOCALES.map((locale) => {
              const { notFound } = getDictionary(locale)
              return (
                <section key={locale} lang={locale} className="flex flex-col items-center gap-2">
                  <h2 className="text-2xl font-semibold tracking-tight">{notFound.title}</h2>
                  <p className="text-muted-foreground">{notFound.description}</p>
                  <Link href={routes.home(locale)} className="font-medium text-primary underline-offset-4 hover:underline">
                    {notFound.back}
                  </Link>
                </section>
              )
            })}
          </div>
        </main>
      </body>
    </html>
  )
}
