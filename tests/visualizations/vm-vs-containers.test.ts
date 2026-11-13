import { describe, expect, it } from 'vitest'
import { CONTAINER_STACK, KERNEL_LAYERS, kernelCount, VM_STACK } from '@/visualizations/diagrams/vm-vs-containers/stacks'

describe('virtual machines versus containers', () => {
  it('runs one kernel per virtual machine and none on the host side of the hypervisor', () => {
    expect(kernelCount(VM_STACK)).toBe(VM_STACK.units)
    expect(VM_STACK.unit[0]).toBe('guestOs')
  })

  it('shares a single host kernel among all containers, however many there are', () => {
    expect(kernelCount(CONTAINER_STACK)).toBe(1)
    expect(kernelCount({ ...CONTAINER_STACK, units: 50 })).toBe(1)
  })

  it('packs only the application and its libraries in a container', () => {
    expect(CONTAINER_STACK.unit).toEqual(['libs', 'app'])
    expect(CONTAINER_STACK.unit.some((layer) => KERNEL_LAYERS.includes(layer))).toBe(false)
  })

  it('puts the hypervisor directly on the hardware and the container runtime on the host operating system', () => {
    expect(VM_STACK.shared).toEqual(['hardware', 'hypervisor'])
    expect(CONTAINER_STACK.shared).toEqual(['hardware', 'hostOs', 'runtime'])
  })
})
