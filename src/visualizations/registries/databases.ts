import type { MDXComponents } from 'mdx/types'
import dynamic from 'next/dynamic'

export const databasesLabs: MDXComponents = {
  AcidTransfer: dynamic(() => import('../animations/acid-transfer/acid-transfer').then((lab) => lab.AcidTransfer)),
  DatabaseIndexVisualizer: dynamic(() =>
    import('../simulators/database-index/database-index-visualizer').then((lab) => lab.DatabaseIndexVisualizer),
  ),
}
