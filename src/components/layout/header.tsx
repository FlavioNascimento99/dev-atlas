import { Search } from 'lucide-react'
import Link from 'next/link'
import { MobileNav } from '@/components/navigation/mobile-nav'
import type { NavData } from '@/components/navigation/types'
import type { Dictionary, Locale } from '@/lib/i18n/types'
import { routes } from '@/lib/routes'
import { LanguageSwitcher } from './language-switcher'
import { Logo } from './logo'
import { ThemeToggle } from './theme-toggle'

type HeaderProps = {
  locale: Locale
  dictionary: Dictionary
  navigation: NavData
}

export function Header({ locale, dictionary, navigation }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-14 border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
      <div className="flex h-full items-center gap-2 px-3 sm:gap-4 sm:px-4">
        <MobileNav
          {...navigation}
          title={dictionary.site.name}
          openLabel={dictionary.nav.openMenu}
          closeLabel={dictionary.nav.closeMenu}
        >
          <ThemeToggle labels={dictionary.theme} />
          <LanguageSwitcher label={dictionary.language.label} />
        </MobileNav>

        <Link href={routes.home(locale)} className="flex shrink-0 items-center gap-2 rounded-md font-semibold tracking-tight">
          <Logo />
          <span className="hidden sm:inline">{dictionary.site.name}</span>
        </Link>

        <form role="search" action={routes.search(locale)} className="mx-auto w-full max-w-xl">
          <label htmlFor="global-search" className="sr-only">
            {dictionary.search.label}
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              id="global-search"
              name="q"
              type="search"
              placeholder={dictionary.search.placeholder}
              className="h-9 w-full rounded-lg border bg-subtle pr-3 pl-9 text-sm shadow-xs transition-colors placeholder:text-muted-foreground hover:border-brand/50 focus-visible:bg-background"
            />
          </div>
        </form>

        <div className="hidden items-center gap-2 sm:flex">
          <ThemeToggle labels={dictionary.theme} />
          <LanguageSwitcher label={dictionary.language.label} />
        </div>
      </div>
    </header>
  )
}
