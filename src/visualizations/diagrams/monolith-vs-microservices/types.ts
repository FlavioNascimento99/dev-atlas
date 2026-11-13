export type ArchitectureId = 'monolith' | 'microservices'

/** Business capabilities of the store in the article. */
export type ModuleId = 'orders' | 'payments' | 'inventory' | 'catalog'

export type ComponentId = ModuleId | 'gateway'

export type CallKind = 'inProcess' | 'network'

export type Call = {
  from: ComponentId
  to: ComponentId
}

export type Architecture = {
  /** Each inner list is built and released together, as one process. */
  deployUnits: ComponentId[][]
  /** Each database with the modules that read and write it. */
  databases: { owners: ModuleId[] }[]
  calls: Call[]
}
