export type LayerKind = 'hardware' | 'hypervisor' | 'hostOs' | 'runtime' | 'guestOs' | 'libs' | 'app'

export type StackId = 'vms' | 'containers'

/** A way of running several isolated applications on one machine. Layers are listed bottom to top. */
export type Stack = {
  id: StackId
  /** Layers that exist once per machine. */
  shared: LayerKind[]
  /** Layers repeated inside every isolated unit (a VM or a container). */
  unit: LayerKind[]
  units: number
}
