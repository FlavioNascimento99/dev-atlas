import { describe, expect, it } from 'vitest'
import { buildExchange } from '@/visualizations/animations/transport-exchange/script'
import type { TransportStep } from '@/visualizations/animations/transport-exchange/types'

function messages(steps: TransportStep[]) {
  return steps.flatMap((step) => step.events.flatMap((event) => (event.kind === 'message' ? [event] : [])))
}

const delivered = (steps: TransportStep[]) => steps.at(-1)?.delivered

describe('TCP exchange', () => {
  it('completes the three-way handshake before sending any data', () => {
    for (const loss of [false, true]) {
      const labels = messages(buildExchange({ protocol: 'tcp', loss })).map((message) => message.label)
      expect(labels.slice(0, 4)).toEqual(['syn', 'synAck', 'ack', 'data1'])
    }
  })

  it('delivers every segment in order even when one is lost', () => {
    expect(delivered(buildExchange({ protocol: 'tcp', loss: true }))).toEqual([1, 2, 3])
    expect(delivered(buildExchange({ protocol: 'tcp', loss: false }))).toEqual([1, 2, 3])
  })

  it('holds segment 3 back until the lost segment 2 is retransmitted', () => {
    const steps = buildExchange({ protocol: 'tcp', loss: true })
    const retransmit = steps.find((step) => step.id === 'retransmit')
    expect(steps.find((step) => step.id === 'data3Buffered')?.delivered).toEqual([1])
    expect(steps.find((step) => step.id === 'duplicateAck')?.events).toMatchObject([{ label: 'ack1' }])
    expect(retransmit?.events).toMatchObject([{ label: 'timeout' }, { label: 'data2', lost: false }, { label: 'deliver23' }])
    expect(retransmit?.delivered).toEqual([1, 2, 3])
  })

  it('loses exactly one packet, and only when asked to', () => {
    expect(messages(buildExchange({ protocol: 'tcp', loss: true })).filter((message) => message.lost)).toHaveLength(1)
    expect(messages(buildExchange({ protocol: 'tcp', loss: false })).filter((message) => message.lost)).toHaveLength(0)
  })

  it('closes the connection with a FIN from each side', () => {
    const labels = messages(buildExchange({ protocol: 'tcp', loss: false })).map((message) => message.label)
    expect(labels.slice(-3)).toEqual(['fin', 'finAck', 'ack'])
  })
})

describe('UDP exchange', () => {
  it('sends only data: no handshake, acknowledgment, retransmission or teardown', () => {
    for (const loss of [false, true]) {
      const sent = messages(buildExchange({ protocol: 'udp', loss }))
      expect(sent.map((message) => message.label)).toEqual(['data1', 'data2', 'data3'])
      expect(sent.every((message) => message.from === 'client')).toBe(true)
    }
  })

  it('never recovers a lost datagram and delivers the next one without waiting', () => {
    expect(delivered(buildExchange({ protocol: 'udp', loss: true }))).toEqual([1, 3])
  })

  it('delivers everything when nothing is lost', () => {
    expect(delivered(buildExchange({ protocol: 'udp', loss: false }))).toEqual([1, 2, 3])
  })
})
