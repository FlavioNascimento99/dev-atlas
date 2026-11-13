import type { MDXComponents } from 'mdx/types'
import dynamic from 'next/dynamic'

/**
 * Visual labs available to every MDX article, keyed by the tag authors write (e.g. `<ExecutionTimeline />`).
 * Each lab is a client component wrapped in `VisualLab` that keeps its logic independent of the article,
 * and is split into its own chunk so only pages that render it download its code (doc 02 §12.4).
 */
export const labComponents: MDXComponents = {
  ExecutionTimeline: dynamic(() =>
    import('./animations/concurrency-timeline/execution-timeline').then((lab) => lab.ExecutionTimeline),
  ),
  RaceConditionSimulator: dynamic(() =>
    import('./simulators/race-condition/race-condition-simulator').then((lab) => lab.RaceConditionSimulator),
  ),
  LoadBalancerSimulator: dynamic(() =>
    import('./simulators/load-balancer/load-balancer-simulator').then((lab) => lab.LoadBalancerSimulator),
  ),
  MessageQueueVisualizer: dynamic(() =>
    import('./simulators/message-queue/message-queue-visualizer').then((lab) => lab.MessageQueueVisualizer),
  ),
  CacheVisualizer: dynamic(() => import('./simulators/cache/cache-visualizer').then((lab) => lab.CacheVisualizer)),
}
