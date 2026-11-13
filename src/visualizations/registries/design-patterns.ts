import type { MDXComponents } from 'mdx/types'
import dynamic from 'next/dynamic'

export const designPatternsLabs: MDXComponents = {
  FactoryMethodDiagram: dynamic(() => import('../diagrams/factory-method/factory-method-diagram').then((lab) => lab.FactoryMethodDiagram)),
  ObserverSimulator: dynamic(() => import('../simulators/observer/observer-simulator').then((lab) => lab.ObserverSimulator)),
}
