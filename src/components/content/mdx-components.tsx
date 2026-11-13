import type { MDXComponents } from 'mdx/types'
import { isValidElement, type ComponentProps, type ReactNode } from 'react'
import { EDITORIAL_SECTIONS } from '@/lib/content/constants'
import type { EditorialSection } from '@/lib/content/types'
import type { Dictionary } from '@/lib/i18n/types'
import { ArticleSection } from './article-section'
import { Callout } from './callout'
import { CodeBlock } from './code-block'
import { ComparisonTable } from './comparison-table'

type CodeElementProps = { className?: string; children?: ReactNode }

function isEditorialSection(id: string): id is EditorialSection {
  return EDITORIAL_SECTIONS.some((section) => section === id)
}

/**
 * Content components bound to the page locale, so MDX authors never pass UI labels.
 * Locale-independent components (visual labs) live in the global map at src/mdx-components.tsx.
 */
export function createMdxComponents(dictionary: Dictionary): MDXComponents {
  const copyLabels = { copyLabel: dictionary.code.copy, copiedLabel: dictionary.code.copied }

  return {
    ArticleSection: ({ id, children }: { id: string; children: ReactNode }) => {
      if (!isEditorialSection(id)) throw new Error(`Unknown editorial section "${id}"`)
      return (
        <ArticleSection id={id} title={dictionary.sections[id]}>
          {children}
        </ArticleSection>
      )
    },
    Callout: ({ type = 'info', children }: Omit<ComponentProps<typeof Callout>, 'label'>) => (
      <Callout type={type} label={dictionary.callout[type]}>
        {children}
      </Callout>
    ),
    CodeBlock: (props: Omit<ComponentProps<typeof CodeBlock>, 'copyLabel' | 'copiedLabel'>) => (
      <CodeBlock {...props} {...copyLabels} />
    ),
    ComparisonTable,
    // Fenced code blocks arrive as <pre><code className="language-x">; route them through CodeBlock.
    pre: ({ children }: { children?: ReactNode }) => {
      if (!isValidElement<CodeElementProps>(children)) return <pre>{children}</pre>
      const language = children.props.className?.replace('language-', '')
      const code = String(children.props.children ?? '').replace(/\n$/, '')
      return <CodeBlock code={code} language={language} {...copyLabels} />
    },
  }
}
