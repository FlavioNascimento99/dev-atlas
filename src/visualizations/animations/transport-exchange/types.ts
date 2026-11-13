import type { SequenceStep } from '../../types'

export type TransportActor = 'client' | 'server'

export type TransportProtocol = 'tcp' | 'udp'

export type TransportParams = {
  protocol: TransportProtocol
  /** The second of the three packets is lost on the way. */
  loss: boolean
}

export type TransportLabel =
  | 'syn'
  | 'synAck'
  | 'ack'
  | 'data1'
  | 'data2'
  | 'data3'
  | 'ack1'
  | 'ack2'
  | 'ack3'
  | 'fin'
  | 'finAck'
  | 'deliver1'
  | 'deliver2'
  | 'deliver3'
  | 'deliver23'
  | 'buffer3'
  | 'timeout'

export type TransportStepId =
  | 'syn'
  | 'synAck'
  | 'ack'
  | 'data1'
  | 'ack1'
  | 'data2'
  | 'ack2'
  | 'data3'
  | 'ack3'
  | 'data2Lost'
  | 'data3Buffered'
  | 'duplicateAck'
  | 'retransmit'
  | 'ackAll'
  | 'fin'
  | 'finAck'
  | 'lastAck'
  | 'udpData1'
  | 'udpData2'
  | 'udpData2Lost'
  | 'udpData3'
  | 'udpData3AfterLoss'

export type TransportStep = SequenceStep<TransportActor, TransportLabel> & {
  id: TransportStepId
  /** Packets handed to the receiving application so far, in the order it got them. */
  delivered: number[]
}
