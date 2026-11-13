import { describe, expect, it } from 'vitest'
import { buildCodeFlow } from '@/visualizations/animations/oauth-code-flow/script'
import type { OAuthArtifact } from '@/visualizations/animations/oauth-code-flow/types'

const messages = buildCodeFlow().flatMap((step) =>
  step.events.flatMap((event) => (event.kind === 'message' ? [{ ...event, step: step.id, carries: event.carries ?? [] }] : [])),
)
const carrying = (artifact: OAuthArtifact) => messages.filter((message) => message.carries.includes(artifact))
const firstWith = (artifact: OAuthArtifact) => messages.findIndex((message) => message.carries.includes(artifact))

describe('OAuth 2.0 authorization code flow with PKCE', () => {
  it('sends the code verifier only in the token request, straight to the authorization server', () => {
    expect(carrying('verifier')).toMatchObject([{ step: 'tokenRequest', from: 'client', to: 'authorizationServer' }])
  })

  it('redeems the code together with the verifier', () => {
    expect(messages.find((message) => message.step === 'tokenRequest')?.carries).toEqual(['code', 'verifier'])
  })

  it('never exposes the verifier or a token to the browser', () => {
    const exposed = messages
      .filter((message) => message.from === 'browser' || message.to === 'browser')
      .flatMap((message) => message.carries)
    expect(exposed).not.toContain('verifier')
    expect(exposed).not.toContain('accessToken')
  })

  it('hands the challenge to the authorization server before any code is issued', () => {
    expect(firstWith('challenge')).toBeGreaterThanOrEqual(0)
    expect(firstWith('challenge')).toBeLessThan(firstWith('code'))
    expect(carrying('challenge').at(-1)?.to).toBe('authorizationServer')
  })

  it('returns state with the code so the client can match the response to its request', () => {
    const callback = messages.find((message) => message.step === 'callback')
    expect(callback).toMatchObject({ to: 'client', carries: ['code', 'state'] })
  })

  it('issues the access token on the back channel, after the verifier, and uses it only against the resource server', () => {
    expect(firstWith('verifier')).toBeLessThan(firstWith('accessToken'))
    expect(carrying('accessToken').map((message) => [message.from, message.to])).toEqual([
      ['authorizationServer', 'client'],
      ['client', 'resourceServer'],
    ])
  })

  it('has the user authenticate with the authorization server, not with the client', () => {
    expect(messages.find((message) => message.step === 'consent')).toMatchObject({ from: 'browser', to: 'authorizationServer' })
  })
})
