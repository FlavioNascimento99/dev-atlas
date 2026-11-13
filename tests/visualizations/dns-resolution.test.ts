import { describe, expect, it } from 'vitest'
import { buildLookup } from '@/visualizations/animations/dns-resolution/script'
import type { DnsActor, DnsStep } from '@/visualizations/animations/dns-resolution/types'

function contacted(steps: DnsStep[]): DnsActor[] {
  return steps.flatMap((step) => step.events.flatMap((event) => (event.kind === 'message' ? [event.to] : [])))
}

describe('DNS recursive resolution', () => {
  it('walks root, TLD and authoritative servers in order when the cache is empty', () => {
    expect(contacted(buildLookup({ warmCache: false }))).toEqual([
      'resolver',
      'root',
      'resolver',
      'tld',
      'resolver',
      'authoritative',
      'resolver',
      'stub',
    ])
  })

  it('gets referrals from the root and the TLD, and the answer only from the authoritative server', () => {
    const replies = buildLookup({ warmCache: false }).flatMap((step) =>
      step.events.flatMap((event) => (event.kind === 'message' && event.reply ? [[event.from, event.label]] : [])),
    )
    expect(replies).toEqual([
      ['root', 'referralTld'],
      ['tld', 'referralAuthoritative'],
      ['authoritative', 'answer'],
      ['resolver', 'answer'],
    ])
  })

  it('answers from the resolver cache without touching root, TLD or authoritative servers when warm', () => {
    const steps = buildLookup({ warmCache: true })
    expect(contacted(steps)).toEqual(['resolver', 'stub'])
    expect(steps.at(-1)?.id).toBe('respondFromCache')
  })

  it('lets only the recursive resolver answer the stub resolver', () => {
    for (const warmCache of [false, true]) {
      const toStub = buildLookup({ warmCache }).flatMap((step) =>
        step.events.flatMap((event) => (event.kind === 'message' && event.to === 'stub' ? [event.from] : [])),
      )
      expect(toStub).toEqual(['resolver'])
    }
  })
})
