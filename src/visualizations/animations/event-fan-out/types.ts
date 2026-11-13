export type EdaConsumer = 'inventory' | 'billing' | 'notification'

export type ConsumerStatus = 'idle' | 'offline' | 'processing' | 'done'

export type ConsumerState = {
  status: ConsumerStatus
  /** Steps of work already done on the event. */
  progress: number
}

export type EdaStepId =
  | 'publish'
  | 'stored'
  | 'deliver'
  | 'deliverOnline'
  | 'inventoryDone'
  | 'billingDone'
  | 'notificationDone'
  | 'recover'
  | 'deliverRetained'
  | 'working'

export type EdaParams = {
  /** The notification service is down when the event is published and recovers after the others finish. */
  consumerDown: boolean
}

export type EdaStep = {
  id: EdaStepId
  /** The producer already handed the event to the broker, which is all it ever learns. */
  accepted: boolean
  /** Subscribers whose copy of the event is still waiting at the broker. */
  retained: EdaConsumer[]
  consumers: Record<EdaConsumer, ConsumerState>
  /** Hops the event travels in this step: from the producer to the broker, or from the broker to a consumer. */
  moving: ('publish' | EdaConsumer)[]
}
