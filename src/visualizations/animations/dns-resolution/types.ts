import type { SequenceStep } from '../../types'

export type DnsActor = 'stub' | 'resolver' | 'root' | 'tld' | 'authoritative'

export type DnsLabel = 'query' | 'cacheMiss' | 'cacheHit' | 'referralTld' | 'referralAuthoritative' | 'answer' | 'cached'

export type DnsStepId =
  | 'ask'
  | 'askRoot'
  | 'rootReferral'
  | 'askTld'
  | 'tldReferral'
  | 'askAuthoritative'
  | 'authoritativeAnswer'
  | 'respond'
  | 'respondFromCache'

export type DnsParams = {
  /** The recursive resolver already holds the record, as in a second lookup within the TTL. */
  warmCache: boolean
}

export type DnsStep = SequenceStep<DnsActor, DnsLabel> & { id: DnsStepId }
