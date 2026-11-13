import type { MDXComponents } from 'mdx/types'

/**
 * Visual labs available to every MDX article, keyed by the tag authors write (e.g. `<ThreadScheduler />`).
 * Each lab is a client component wrapped in `VisualLab` that keeps its logic independent of the article.
 */
export const labComponents: MDXComponents = {}
