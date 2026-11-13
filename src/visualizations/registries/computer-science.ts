import type { MDXComponents } from 'mdx/types'
import dynamic from 'next/dynamic'

export const computerScienceLabs: MDXComponents = {
  StackAndHeap: dynamic(() => import('../animations/stack-and-heap/stack-and-heap').then((lab) => lab.StackAndHeap)),
  GarbageCollection: dynamic(() => import('../animations/garbage-collection/garbage-collection').then((lab) => lab.GarbageCollection)),
}
