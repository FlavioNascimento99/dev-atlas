import type { MDXComponents } from 'mdx/types'
import { computerScienceLabs } from './registries/computer-science'
import { concurrencyLabs } from './registries/concurrency'
import { databasesLabs } from './registries/databases'
import { designPatternsLabs } from './registries/design-patterns'
import { distributedSystemsLabs } from './registries/distributed-systems'
import { infrastructureLabs } from './registries/infrastructure'
import { networkingLabs } from './registries/networking'
import { securityLabs } from './registries/security'
import { softwareArchitectureLabs } from './registries/software-architecture'
import { systemDesignLabs } from './registries/system-design'

/**
 * Visual labs available to every MDX article, keyed by the tag authors write (e.g. `<ExecutionTimeline />`).
 * Each lab is a client component wrapped in `VisualLab` that keeps its logic independent of the article,
 * and is split into its own chunk so only pages that render it download its code (doc 02 §12.4).
 * Labs are registered in the file of their content domain, so domains can be worked on in parallel.
 */
export const labComponents: MDXComponents = {
  ...computerScienceLabs,
  ...concurrencyLabs,
  ...databasesLabs,
  ...designPatternsLabs,
  ...distributedSystemsLabs,
  ...infrastructureLabs,
  ...networkingLabs,
  ...securityLabs,
  ...softwareArchitectureLabs,
  ...systemDesignLabs,
}
