import '@/styles/globals.css'
import type { Metadata } from 'next'
import { fontVariables } from '@/app/fonts'
import { Header } from '@/components/layout/header'
import { ThemeScript } from '@/components/layout/theme-script'
import { buildNavigation } from '@/components/navigation/build-navigation'
import { SidebarNav } from '@/components/navigation/sidebar-nav'
import { LOCALES } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionary'
import { resolveLocale } from '@/lib/i18n/resolve-locale'

export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { site } = getDictionary(resolveLocale((await params).lang))
  return {
    title: { template: `%s · ${site.name}`, default: `${site.name} — ${site.tagline}` },
    description: site.tagline,
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const locale = resolveLocale((await params).lang)
  const dictionary = getDictionary(locale)
  const navigation = buildNavigation(locale, dictionary)

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
        >
          {dictionary.nav.skipToContent}
        </a>
        <Header locale={locale} dictionary={dictionary} navigation={navigation} />
        <div className="flex">
          <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-72 shrink-0 overflow-y-auto border-r bg-subtle p-4 lg:block">
            <SidebarNav {...navigation} />
          </aside>
          <main id="main" tabIndex={-1} className="min-w-0 flex-1 px-4 py-8 outline-none sm:px-8 lg:px-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
