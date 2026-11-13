export const THEMES = ['system', 'light', 'dark'] as const

export const THEME_STORAGE_KEY = 'devatlas-theme'

export const DARK_QUERY = '(prefers-color-scheme: dark)'

/**
 * Runs before first paint (inlined in <head>) so the stored or system theme is applied without a flash.
 * Kept as a string because it must execute before React and any bundle loads.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');var d=t==='dark'||(t!=='light'&&matchMedia('${DARK_QUERY}').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`
