import type { MDXComponents } from 'mdx/types'
import dynamic from 'next/dynamic'

export const concurrencyLabs: MDXComponents = {
  ExecutionTimeline: dynamic(() => import('../animations/concurrency-timeline/execution-timeline').then((lab) => lab.ExecutionTimeline)),
  RaceConditionSimulator: dynamic(() => import('../simulators/race-condition/race-condition-simulator').then((lab) => lab.RaceConditionSimulator)),
}
