import { scriptedModel } from '../../scripted'
import type { SequenceEvent } from '../../types'
import type { DnsActor, DnsLabel, DnsParams, DnsStep } from './types'

type DnsEvent = SequenceEvent<DnsActor, DnsLabel>

export const DNS_ACTORS = ['stub', 'resolver', 'root', 'tld', 'authoritative'] as const satisfies readonly DnsActor[]

const query = (from: DnsActor, to: DnsActor): DnsEvent => ({ kind: 'message', from, to, label: 'query' })
const reply = (from: DnsActor, to: DnsActor, label: DnsLabel): DnsEvent => ({ kind: 'message', from, to, label, reply: true })
const note = (label: DnsLabel): DnsEvent => ({ kind: 'note', at: 'resolver', label })

/** Lookup of one name: with a warm cache the resolver answers by itself, otherwise it walks the tree from the root. */
export function buildLookup({ warmCache }: DnsParams): DnsStep[] {
  const ask: DnsStep = { id: 'ask', events: [query('stub', 'resolver')] }
  if (warmCache) {
    return [ask, { id: 'respondFromCache', events: [note('cacheHit'), reply('resolver', 'stub', 'answer')] }]
  }
  return [
    ask,
    { id: 'askRoot', events: [note('cacheMiss'), query('resolver', 'root')] },
    { id: 'rootReferral', events: [reply('root', 'resolver', 'referralTld')] },
    { id: 'askTld', events: [query('resolver', 'tld')] },
    { id: 'tldReferral', events: [reply('tld', 'resolver', 'referralAuthoritative')] },
    { id: 'askAuthoritative', events: [query('resolver', 'authoritative')] },
    { id: 'authoritativeAnswer', events: [reply('authoritative', 'resolver', 'answer')] },
    { id: 'respond', events: [note('cached'), reply('resolver', 'stub', 'answer')] },
  ]
}

export const dnsModel = scriptedModel(buildLookup)
