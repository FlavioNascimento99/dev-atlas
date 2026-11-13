import { scriptedModel } from '../../scripted'
import type { OAuthActor, OAuthStep } from './types'

export const OAUTH_ACTORS = [
  'browser',
  'client',
  'authorizationServer',
  'resourceServer',
] as const satisfies readonly OAuthActor[]

/**
 * Authorization code grant with PKCE (RFC 6749 §4.1, RFC 7636), as required by RFC 9700. The client is the part
 * of the application that holds the tokens, such as a web backend; the browser only carries redirects.
 */
export function buildCodeFlow(): OAuthStep[] {
  return [
    { id: 'prepare', events: [{ kind: 'note', at: 'client', label: 'pkce' }] },
    {
      id: 'redirect',
      events: [{ kind: 'message', from: 'client', to: 'browser', label: 'redirect', carries: ['challenge', 'state'] }],
    },
    {
      id: 'authorizationRequest',
      events: [
        {
          kind: 'message',
          from: 'browser',
          to: 'authorizationServer',
          label: 'authorizationRequest',
          carries: ['challenge', 'state'],
        },
        { kind: 'note', at: 'authorizationServer', label: 'storeChallenge' },
      ],
    },
    { id: 'consent', events: [{ kind: 'message', from: 'browser', to: 'authorizationServer', label: 'consent' }] },
    {
      id: 'redirectBack',
      events: [
        {
          kind: 'message',
          from: 'authorizationServer',
          to: 'browser',
          label: 'codeRedirect',
          reply: true,
          carries: ['code', 'state'],
        },
      ],
    },
    {
      id: 'callback',
      events: [
        { kind: 'message', from: 'browser', to: 'client', label: 'callback', carries: ['code', 'state'] },
        { kind: 'note', at: 'client', label: 'stateCheck' },
      ],
    },
    {
      id: 'tokenRequest',
      events: [
        {
          kind: 'message',
          from: 'client',
          to: 'authorizationServer',
          label: 'tokenRequest',
          carries: ['code', 'verifier'],
        },
      ],
    },
    {
      id: 'tokenResponse',
      events: [
        { kind: 'note', at: 'authorizationServer', label: 'verifyChallenge' },
        {
          kind: 'message',
          from: 'authorizationServer',
          to: 'client',
          label: 'tokens',
          reply: true,
          carries: ['accessToken'],
        },
      ],
    },
    {
      id: 'apiCall',
      events: [{ kind: 'message', from: 'client', to: 'resourceServer', label: 'apiCall', carries: ['accessToken'] }],
    },
    {
      id: 'apiResponse',
      events: [
        { kind: 'note', at: 'resourceServer', label: 'validateToken' },
        { kind: 'message', from: 'resourceServer', to: 'client', label: 'data', reply: true },
      ],
    },
  ]
}

export const oauthModel = scriptedModel(buildCodeFlow)
