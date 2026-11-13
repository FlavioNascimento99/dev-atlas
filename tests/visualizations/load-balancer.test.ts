import { describe, expect, it } from 'vitest'
import { advanceBalancer, chooseServer, createBalancer } from '@/visualizations/simulators/load-balancer/simulation'
import type { BalancerParams, BalancerState } from '@/visualizations/simulators/load-balancer/types'

function runTicks(params: BalancerParams, ticks: number, seed?: number): BalancerState {
  let state = createBalancer(params, seed)
  for (let i = 0; i < ticks; i++) state = advanceBalancer(state, params)
  return state
}

describe('load balancer', () => {
  it('round-robin distributes requests equally across servers', () => {
    const state = runTicks({ servers: 4, rate: 2, strategy: 'round-robin' }, 10)
    expect(state.servers.map((server) => server.handled)).toEqual([5, 5, 5, 5])
  })

  it('round-robin visits servers in order', () => {
    const state = runTicks({ servers: 3, rate: 3, strategy: 'round-robin' }, 1)
    expect(state.assignments.map((assignment) => assignment.server)).toEqual([0, 1, 2])
  })

  it('least-connections picks the server with the fewest active connections', () => {
    const servers = [
      { active: [3, 2], handled: 2 },
      { active: [1], handled: 1 },
      { active: [4, 4, 4], handled: 3 },
    ]
    expect(chooseServer('least-connections', servers, 0, 1).server).toBe(1)
  })

  it('least-connections keeps active connections more even than round-robin', () => {
    const spread = (state: BalancerState) => {
      const loads = state.servers.map((server) => server.active.length)
      return Math.max(...loads) - Math.min(...loads)
    }
    const least = runTicks({ servers: 4, rate: 3, strategy: 'least-connections' }, 30)
    expect(spread(least)).toBeLessThanOrEqual(1)
  })

  it('random is reproducible for a seed and changes with the seed', () => {
    const params: BalancerParams = { servers: 5, rate: 3, strategy: 'random' }
    const handled = (seed: number) => runTicks(params, 20, seed).servers.map((server) => server.handled)
    expect(handled(7)).toEqual(handled(7))
    expect(handled(7)).not.toEqual(handled(8))
  })

  it('releases connections when requests finish', () => {
    const quiet: BalancerParams = { servers: 2, rate: 0, strategy: 'round-robin' }
    let state = runTicks({ ...quiet, rate: 1 }, 1)
    expect(state.servers[0]?.active).toHaveLength(1)
    for (let i = 0; i < 6; i++) state = advanceBalancer(state, quiet)
    expect(state.servers.every((server) => server.active.length === 0)).toBe(true)
    expect(state.servers[0]?.handled).toBe(1)
  })
})
