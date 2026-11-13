import type { MDXComponents } from 'mdx/types'
import dynamic from 'next/dynamic'

export const infrastructureLabs: MDXComponents = {
  DeploymentPipeline: dynamic(() =>
    import('../animations/ci-cd-pipeline/deployment-pipeline').then((lab) => lab.DeploymentPipeline),
  ),
  VmVsContainers: dynamic(() => import('../diagrams/vm-vs-containers/vm-vs-containers').then((lab) => lab.VmVsContainers)),
}
