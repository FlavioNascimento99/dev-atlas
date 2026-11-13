import type { LayerKind, Stack } from './types'

/** Layers that include an operating system kernel. */
export const KERNEL_LAYERS: readonly LayerKind[] = ['hostOs', 'guestOs']

/** Each VM carries a full guest operating system on hardware virtualized by the hypervisor. */
export const VM_STACK: Stack = {
  id: 'vms',
  shared: ['hardware', 'hypervisor'],
  unit: ['guestOs', 'libs', 'app'],
  units: 2,
}

/** Containers carry only the application and its dependencies; the kernel is the host's. */
export const CONTAINER_STACK: Stack = {
  id: 'containers',
  shared: ['hardware', 'hostOs', 'runtime'],
  unit: ['libs', 'app'],
  units: 3,
}

export function kernelCount(stack: Stack): number {
  const kernels = (layers: LayerKind[]) => layers.filter((layer) => KERNEL_LAYERS.includes(layer)).length
  return kernels(stack.shared) + stack.units * kernels(stack.unit)
}
