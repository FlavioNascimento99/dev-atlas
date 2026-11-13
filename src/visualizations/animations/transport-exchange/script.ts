import { scriptedModel } from '../../scripted'
import type { SequenceEvent } from '../../types'
import type { TransportActor, TransportLabel, TransportParams, TransportStep, TransportStepId } from './types'

type TransportEvent = SequenceEvent<TransportActor, TransportLabel>

/** A step before the running list of delivered packets is filled in. */
type Draft = { id: TransportStepId; events: TransportEvent[]; delivers?: number[] }

export const TRANSPORT_ACTORS = ['client', 'server'] as const satisfies readonly TransportActor[]

const send = (label: TransportLabel, lost = false): TransportEvent => ({ kind: 'message', from: 'client', to: 'server', label, lost })
const answer = (label: TransportLabel): TransportEvent => ({ kind: 'message', from: 'server', to: 'client', label })
const serverNote = (label: TransportLabel): TransportEvent => ({ kind: 'note', at: 'server', label })

const HANDSHAKE: Draft[] = [
  { id: 'syn', events: [send('syn')] },
  { id: 'synAck', events: [answer('synAck')] },
  { id: 'ack', events: [send('ack')] },
]

const TEARDOWN: Draft[] = [
  { id: 'fin', events: [send('fin')] },
  { id: 'finAck', events: [answer('finAck')] },
  { id: 'lastAck', events: [send('ack')] },
]

const FIRST_SEGMENT: Draft[] = [
  { id: 'data1', events: [send('data1'), serverNote('deliver1')], delivers: [1] },
  { id: 'ack1', events: [answer('ack1')] },
]

/** TCP: every segment is acknowledged, and a gap holds back later segments until a retransmission fills it. */
function tcpDrafts(loss: boolean): Draft[] {
  const transfer: Draft[] = loss
    ? [
        { id: 'data2Lost', events: [send('data2', true)] },
        { id: 'data3Buffered', events: [send('data3'), serverNote('buffer3')] },
        { id: 'duplicateAck', events: [answer('ack1')] },
        {
          id: 'retransmit',
          events: [{ kind: 'note', at: 'client', label: 'timeout' }, send('data2'), serverNote('deliver23')],
          delivers: [2, 3],
        },
        { id: 'ackAll', events: [answer('ack3')] },
      ]
    : [
        { id: 'data2', events: [send('data2'), serverNote('deliver2')], delivers: [2] },
        { id: 'ack2', events: [answer('ack2')] },
        { id: 'data3', events: [send('data3'), serverNote('deliver3')], delivers: [3] },
        { id: 'ack3', events: [answer('ack3')] },
      ]
  return [...HANDSHAKE, ...FIRST_SEGMENT, ...transfer, ...TEARDOWN]
}

/** UDP: each datagram is sent once and delivered on arrival; nothing notices or repairs a loss. */
function udpDrafts(loss: boolean): Draft[] {
  return [
    { id: 'udpData1', events: [send('data1'), serverNote('deliver1')], delivers: [1] },
    loss
      ? { id: 'udpData2Lost', events: [send('data2', true)] }
      : { id: 'udpData2', events: [send('data2'), serverNote('deliver2')], delivers: [2] },
    { id: loss ? 'udpData3AfterLoss' : 'udpData3', events: [send('data3'), serverNote('deliver3')], delivers: [3] },
  ]
}

/** The same three packets sent over TCP or UDP, optionally losing the second one. */
export function buildExchange({ protocol, loss }: TransportParams): TransportStep[] {
  let delivered: number[] = []
  return (protocol === 'tcp' ? tcpDrafts(loss) : udpDrafts(loss)).map(({ delivers = [], ...step }) => {
    delivered = [...delivered, ...delivers]
    return { ...step, delivered }
  })
}

export const transportModel = scriptedModel(buildExchange)
