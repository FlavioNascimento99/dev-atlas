import type { MDXComponents } from 'mdx/types'
import { labComponents } from '@/visualizations/registry'

/** Global MDX components required by @next/mdx; locale-bound content components are added per page. */
export function useMDXComponents(): MDXComponents {
  return labComponents
}
