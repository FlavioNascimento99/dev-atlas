import { scriptedModel } from '../../scripted'
import type { JwtClaimChecks, JwtClaims, JwtHeader, JwtParams, JwtStep, JwtToken } from './types'

const ISSUED_HEADER: JwtHeader = { alg: 'ES256', typ: 'at+jwt', kid: 'key-1' }

export const ISSUED_CLAIMS: JwtClaims = {
  iss: 'https://auth.example.com',
  sub: 'user-8472',
  aud: 'https://api.example.com',
  role: 'viewer',
  exp: 1794571200,
}

/** What the holder writes over the issued payload in the tampered scenario. */
export const TAMPERED_CLAIMS: JwtClaims = { ...ISSUED_CLAIMS, role: 'admin' }

/** What the verifier requires, stated in its own configuration and never read from the token. */
export const EXPECTED = { algorithm: 'ES256', issuer: 'https://auth.example.com', audience: 'https://api.example.com' }

/** Clock skew the verifier tolerates when checking `exp`. */
export const CLOCK_TOLERANCE_SECONDS = 30

/** The verifier's clock in each scenario: two minutes before `exp` and seven minutes after it. */
export const CLOCKS: Record<JwtParams['clock'], number> = {
  valid: ISSUED_CLAIMS.exp - 120,
  expired: ISSUED_CLAIMS.exp + 420,
}

/**
 * ES256 signature of the issued header and payload, computed once with a throwaway key. The lab does not run the
 * cryptography: it stands in for it by remembering which bytes this signature covers.
 */
const SIGNATURE = 'P5kkwYUZSvaI2Ovb5-FH12hkNUaHTw9WVgIqtHYNcnJEY78tQeC1jB78oWWn4qJLOOw0QfX9O62CQdS9Ip4Saw'

/** base64url of the JSON text, as in RFC 7515. The lab's JSON is ASCII, so `btoa` is enough. */
export function encodePart(value: JwtHeader | JwtClaims): string {
  return btoa(JSON.stringify(value)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

const signingInput = (header: string, payload: string) => `${header}.${payload}`

const SIGNED_INPUT = signingInput(encodePart(ISSUED_HEADER), encodePart(ISSUED_CLAIMS))

/** The token as the API receives it. Tampering re-encodes the payload; the holder cannot produce a new signature. */
export function presentToken(payload: JwtParams['payload']): JwtToken {
  const claims = payload === 'tampered' ? TAMPERED_CLAIMS : ISSUED_CLAIMS
  return {
    header: ISSUED_HEADER,
    claims,
    encoded: { header: encodePart(ISSUED_HEADER), payload: encodePart(claims), signature: SIGNATURE },
  }
}

/** Cryptographic layer: the algorithm is the one the verifier pinned, and the signature covers exactly these bytes. */
export function signatureIsValid(token: JwtToken): boolean {
  return token.header.alg === EXPECTED.algorithm && signingInput(token.encoded.header, token.encoded.payload) === SIGNED_INPUT
}

/** Claims layer. `exp`: the token is rejected at or after that time, allowing for the clock tolerance. */
export function checkClaims(claims: JwtClaims, now: number): JwtClaimChecks {
  return {
    iss: claims.iss === EXPECTED.issuer,
    aud: claims.aud === EXPECTED.audience,
    exp: now - CLOCK_TOLERANCE_SECONDS < claims.exp,
  }
}

/** The order a verifier follows: nothing in the payload is trusted before the signature, and no claim is used before the claims pass. */
export function verify(token: JwtToken, now: number): JwtStep[] {
  if (!signatureIsValid(token)) return [{ id: 'signatureInvalid', check: 'signature', passed: false }]
  const signature: JwtStep = { id: 'signatureValid', check: 'signature', passed: true }
  if (!Object.values(checkClaims(token.claims, now)).every(Boolean)) {
    return [signature, { id: 'claimsRejected', check: 'claims', passed: false }]
  }
  return [signature, { id: 'claimsValid', check: 'claims', passed: true }, { id: 'authorized', check: 'authorize', passed: true }]
}

export const jwtModel = scriptedModel(({ payload, clock }: JwtParams) => verify(presentToken(payload), CLOCKS[clock]))
