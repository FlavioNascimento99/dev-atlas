import type { MDXComponents } from 'mdx/types'
import dynamic from 'next/dynamic'

export const softwareArchitectureLabs: MDXComponents = {
  EventFanOut: dynamic(() => import('../animations/event-fan-out/event-fan-out').then((lab) => lab.EventFanOut)),
  MonolithVsMicroservices: dynamic(() => import('../diagrams/monolith-vs-microservices/monolith-vs-microservices').then((lab) => lab.MonolithVsMicroservices)),
}
