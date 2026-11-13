import { scriptedModel } from '../../scripted'
import type { ConsumerState, EdaConsumer, EdaParams, EdaStep, EdaStepId } from './types'

type Consumers = Record<EdaConsumer, ConsumerState>

export const EDA_CONSUMERS = ['inventory', 'billing', 'notification'] as const satisfies readonly EdaConsumer[]

/** Steps each consumer needs to process one event: every subscriber works at its own pace. */
export const EDA_WORK: Record<EdaConsumer, number> = { inventory: 1, billing: 2, notification: 3 }

const DONE_STEP: Record<EdaConsumer, EdaStepId> = {
  inventory: 'inventoryDone',
  billing: 'billingDone',
  notification: 'notificationDone',
}

function mapConsumers(consumers: Consumers, change: (id: EdaConsumer, state: ConsumerState) => ConsumerState): Consumers {
  return {
    inventory: change('inventory', consumers.inventory),
    billing: change('billing', consumers.billing),
    notification: change('notification', consumers.notification),
  }
}

/** Consumers before anything is published. */
export function initialConsumers({ consumerDown }: EdaParams): Consumers {
  return {
    inventory: { status: 'idle', progress: 0 },
    billing: { status: 'idle', progress: 0 },
    notification: { status: consumerDown ? 'offline' : 'idle', progress: 0 },
  }
}

/**
 * One `OrderPlaced` event through a publish-subscribe broker: the producer hands it over and is done, the broker
 * keeps one copy per subscriber and delivers each copy when its consumer is reachable.
 */
export function buildFanOut(params: EdaParams): EdaStep[] {
  const steps: EdaStep[] = []
  let consumers = initialConsumers(params)
  let retained: EdaConsumer[] = []
  const push = (id: EdaStepId, moving: EdaStep['moving'] = []) =>
    steps.push({ id, accepted: id !== 'publish', retained, consumers, moving })

  const deliver = (id: EdaStepId) => {
    const reachable = retained.filter((consumer) => consumers[consumer].status !== 'offline')
    retained = retained.filter((consumer) => !reachable.includes(consumer))
    consumers = mapConsumers(consumers, (consumer, state) => (reachable.includes(consumer) ? { status: 'processing', progress: 0 } : state))
    push(id, reachable)
  }

  const work = () => {
    while (EDA_CONSUMERS.some((consumer) => consumers[consumer].status === 'processing')) {
      const before = consumers
      consumers = mapConsumers(before, (consumer, state) => {
        if (state.status !== 'processing') return state
        const progress = state.progress + 1
        return { status: progress >= EDA_WORK[consumer] ? 'done' : 'processing', progress }
      })
      const finished = EDA_CONSUMERS.find((consumer) => before[consumer].status === 'processing' && consumers[consumer].status === 'done')
      push(finished ? DONE_STEP[finished] : 'working')
    }
  }

  push('publish', ['publish'])
  retained = [...EDA_CONSUMERS]
  push('stored')
  deliver(params.consumerDown ? 'deliverOnline' : 'deliver')
  work()
  if (params.consumerDown) {
    consumers = mapConsumers(consumers, (_, state) => (state.status === 'offline' ? { status: 'idle', progress: 0 } : state))
    push('recover')
    deliver('deliverRetained')
    work()
  }
  return steps
}

export const fanOutModel = scriptedModel(buildFanOut)
