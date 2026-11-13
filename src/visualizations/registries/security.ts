import type { MDXComponents } from 'mdx/types'
import dynamic from 'next/dynamic'

export const securityLabs: MDXComponents = {
  OAuthCodeFlow: dynamic(() => import('../animations/oauth-code-flow/oauth-code-flow').then((lab) => lab.OAuthCodeFlow)),
  JwtInspector: dynamic(() => import('../simulators/jwt/jwt-inspector').then((lab) => lab.JwtInspector)),
}
