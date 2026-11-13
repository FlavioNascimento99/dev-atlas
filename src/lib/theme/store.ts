import { DARK_QUERY, THEMES, THEME_STORAGE_KEY } from './constants'
import type { Theme } from './types'

const listeners = new Set<() => void>()

function isTheme(value: string | null): value is Theme {
  return THEMES.some((theme) => theme === value)
}

function applyTheme(theme: Theme) {
  const dark = theme === 'dark' || (theme === 'system' && window.matchMedia(DARK_QUERY).matches)
  document.documentElement.classList.toggle('dark', dark)
}

export function getTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  return isTheme(stored) ? stored : 'system'
}

export function getServerTheme(): Theme {
  return 'system'
}

export function setTheme(theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme)
  applyTheme(theme)
  for (const listener of listeners) listener()
}

/** Subscribes to theme changes, including OS changes while the "system" theme is active. */
export function subscribeTheme(listener: () => void) {
  const media = window.matchMedia(DARK_QUERY)
  const onSystemChange = () => applyTheme(getTheme())
  listeners.add(listener)
  media.addEventListener('change', onSystemChange)
  return () => {
    listeners.delete(listener)
    media.removeEventListener('change', onSystemChange)
  }
}
