import type { MDXComponents } from 'mdx/types'
import dynamic from 'next/dynamic'

export const networkingLabs: MDXComponents = {
  DnsResolution: dynamic(() => import('../animations/dns-resolution/dns-resolution').then((lab) => lab.DnsResolution)),
  TransportExchange: dynamic(() => import('../animations/transport-exchange/transport-exchange').then((lab) => lab.TransportExchange)),
}
