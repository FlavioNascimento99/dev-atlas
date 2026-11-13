import type { MDXComponents } from 'mdx/types'
import dynamic from 'next/dynamic'

export const systemDesignLabs: MDXComponents = {
  LoadBalancerSimulator: dynamic(() => import('../simulators/load-balancer/load-balancer-simulator').then((lab) => lab.LoadBalancerSimulator)),
  MessageQueueVisualizer: dynamic(() => import('../simulators/message-queue/message-queue-visualizer').then((lab) => lab.MessageQueueVisualizer)),
  CacheVisualizer: dynamic(() => import('../simulators/cache/cache-visualizer').then((lab) => lab.CacheVisualizer)),
}
