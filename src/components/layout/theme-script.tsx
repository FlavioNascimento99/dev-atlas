import { THEME_INIT_SCRIPT } from '@/lib/theme/constants'

/** Must be rendered inside <head> so the theme class is set before the first paint. */
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
}
