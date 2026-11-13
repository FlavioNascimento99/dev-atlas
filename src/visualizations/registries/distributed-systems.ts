import type { MDXComponents } from 'mdx/types'
import dynamic from 'next/dynamic'

export const distributedSystemsLabs: MDXComponents = {
  CapPartitionSimulator: dynamic(() => import('../simulators/cap-theorem/cap-partition-simulator').then((lab) => lab.CapPartitionSimulator)),
  EventualConsistencySimulator: dynamic(() =>
    import('../simulators/eventual-consistency/eventual-consistency-simulator').then((lab) => lab.EventualConsistencySimulator),
  ),
}
