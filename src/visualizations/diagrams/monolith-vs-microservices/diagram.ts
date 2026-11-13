import type { Architecture, ArchitectureId, Call, CallKind, ComponentId, ModuleId } from './types'

export const MODULES = ['orders', 'payments', 'inventory', 'catalog'] as const satisfies readonly ModuleId[]

/** Placing an order needs a charge and a stock reservation, whatever the architecture. */
const ORDER_CALLS: Call[] = [
  { from: 'orders', to: 'payments' },
  { from: 'orders', to: 'inventory' },
]

/** The same four capabilities packaged as one deploy unit with one database, or as one unit and one database each. */
export const ARCHITECTURES: Record<ArchitectureId, Architecture> = {
  monolith: {
    deployUnits: [[...MODULES]],
    databases: [{ owners: [...MODULES] }],
    calls: ORDER_CALLS,
  },
  microservices: {
    deployUnits: [['gateway'], ...MODULES.map((module) => [module])],
    databases: MODULES.map((module) => ({ owners: [module] })),
    calls: [{ from: 'gateway', to: 'orders' }, ...ORDER_CALLS],
  },
}

function unitOf(architecture: Architecture, component: ComponentId) {
  return architecture.deployUnits.findIndex((unit) => unit.includes(component))
}

/** A call stays in process only when both ends are released in the same deploy unit; otherwise it crosses the network. */
export function callKind(architecture: Architecture, call: Call): CallKind {
  return unitOf(architecture, call.from) === unitOf(architecture, call.to) ? 'inProcess' : 'network'
}
