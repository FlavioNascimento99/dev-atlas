import { describe, expect, it } from 'vitest'
import {
  checkClaims,
  CLOCK_TOLERANCE_SECONDS,
  CLOCKS,
  ISSUED_CLAIMS,
  jwtModel,
  presentToken,
  signatureIsValid,
  TAMPERED_CLAIMS,
  verify,
} from '@/visualizations/simulators/jwt/script'
import type { JwtParams } from '@/visualizations/simulators/jwt/types'

const decode = (part: string): unknown => JSON.parse(Buffer.from(part, 'base64url').toString())

function stepIds(params: JwtParams) {
  return jwtModel.create(params).steps.map((step) => step.id)
}

describe('JWT verification', () => {
  it('encodes header and payload as unpadded base64url JSON that anyone can decode', () => {
    for (const payload of ['issued', 'tampered'] as const) {
      const token = presentToken(payload)
      expect(decode(token.encoded.header)).toEqual(token.header)
      expect(decode(token.encoded.payload)).toEqual(token.claims)
      expect(Object.values(token.encoded).join('.')).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/)
    }
  })

  it('tampering changes the payload part but cannot change the signature', () => {
    const issued = presentToken('issued')
    const tampered = presentToken('tampered')
    expect(tampered.claims).toEqual(TAMPERED_CLAIMS)
    expect(tampered.encoded.payload).not.toBe(issued.encoded.payload)
    expect(tampered.encoded.header).toBe(issued.encoded.header)
    expect(tampered.encoded.signature).toBe(issued.encoded.signature)
  })

  it('accepts the issued token before it expires, checking signature, then claims, then authorizing', () => {
    expect(stepIds({ payload: 'issued', clock: 'valid' })).toEqual(['signatureValid', 'claimsValid', 'authorized'])
  })

  it('rejects a tampered payload at the signature and never reaches the claims', () => {
    expect(signatureIsValid(presentToken('tampered'))).toBe(false)
    expect(stepIds({ payload: 'tampered', clock: 'valid' })).toEqual(['signatureInvalid'])
    expect(stepIds({ payload: 'tampered', clock: 'expired' })).toEqual(['signatureInvalid'])
  })

  it('rejects a token whose header asks for another algorithm than the one the verifier pinned', () => {
    const token = presentToken('issued')
    expect(signatureIsValid({ ...token, header: { ...token.header, alg: 'none' } })).toBe(false)
  })

  it('rejects an expired token even though its signature is valid, and never authorizes', () => {
    expect(signatureIsValid(presentToken('issued'))).toBe(true)
    expect(stepIds({ payload: 'issued', clock: 'expired' })).toEqual(['signatureValid', 'claimsRejected'])
  })

  it('rejects at or after exp, allowing only the clock tolerance', () => {
    const { exp } = ISSUED_CLAIMS
    expect(checkClaims(ISSUED_CLAIMS, exp - 1).exp).toBe(true)
    expect(checkClaims(ISSUED_CLAIMS, exp + CLOCK_TOLERANCE_SECONDS - 1).exp).toBe(true)
    expect(checkClaims(ISSUED_CLAIMS, exp + CLOCK_TOLERANCE_SECONDS).exp).toBe(false)
    expect(checkClaims(ISSUED_CLAIMS, CLOCKS.valid).exp).toBe(true)
    expect(checkClaims(ISSUED_CLAIMS, CLOCKS.expired).exp).toBe(false)
  })

  it('rejects a correctly signed token meant for another issuer or audience', () => {
    const token = presentToken('issued')
    expect(checkClaims({ ...token.claims, aud: 'https://other.example.com' }, CLOCKS.valid).aud).toBe(false)
    expect(checkClaims({ ...token.claims, iss: 'https://evil.example.com' }, CLOCKS.valid).iss).toBe(false)
    expect(verify({ ...token, claims: { ...token.claims, aud: 'https://other.example.com' } }, CLOCKS.valid).at(-1)).toMatchObject({
      check: 'claims',
      passed: false,
    })
  })
})
