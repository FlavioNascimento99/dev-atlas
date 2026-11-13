import { DEFAULT_SEED } from '../../constants'
import { nextInt } from '../../random'
import type { SimulationModel } from '../../types'
import type { BalancerParams, BalancerState, Server, Strategy } from './types'

/** Requests take a random number of ticks in this range, so some servers stay busy longer than others. */
export const REQUEST_DURATION = { min: 1, max: 6 } as const

export function createBalancer({ servers }: BalancerParams, seed = DEFAULT_SEED): BalancerState {
  return {
    tick: 0,
    seed,
    servers: Array.from({ length: servers }, () => ({ active: [], handled: 0 })),
    cursor: 0,
    nextRequestId: 0,
    assignments: [],
  }
}

type Choice = { server: number; cursor: number; seed: number }

export function chooseServer(strategy: Strategy, servers: Server[], cursor: number, seed: number): Choice {
  switch (strategy) {
    case 'round-robin':
      return { server: cursor % servers.length, cursor: (cursor + 1) % servers.length, seed }
    case 'least-connections': {
      const server = servers.reduce(
        (best, current, index) => (current.active.length < (servers[best]?.active.length ?? Infinity) ? index : best),
        0,
      )
      return { server, cursor, seed }
    }
    case 'random': {
      const random = nextInt(seed, 0, servers.length - 1)
      return { server: random.value, cursor, seed: random.seed }
    }
  }
}

/** One tick: finished requests release their connections, then `rate` new requests are routed. */
export function advanceBalancer(state: BalancerState, { rate, strategy }: BalancerParams): BalancerState {
  const servers = state.servers.map((server) => ({
    ...server,
    active: server.active.map((remaining) => remaining - 1).filter((remaining) => remaining > 0),
  }))
  let { cursor, seed, nextRequestId } = state
  const assignments = []

  for (let i = 0; i < rate; i++) {
    const choice = chooseServer(strategy, servers, cursor, seed)
    const duration = nextInt(choice.seed, REQUEST_DURATION.min, REQUEST_DURATION.max)
    const target = servers[choice.server]
    if (target) {
      target.active = [...target.active, duration.value]
      target.handled += 1
    }
    assignments.push({ id: nextRequestId, server: choice.server })
    nextRequestId += 1
    cursor = choice.cursor
    seed = duration.seed
  }

  return { tick: state.tick + 1, seed, servers, cursor, nextRequestId, assignments }
}

export const balancerModel: SimulationModel<BalancerParams, BalancerState> = {
  create: (params) => createBalancer(params),
  advance: advanceBalancer,
}
