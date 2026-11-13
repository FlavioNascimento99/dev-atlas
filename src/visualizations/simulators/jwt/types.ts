export type JwtHeader = {
  alg: string
  typ: string
  kid: string
}

export type JwtClaims = {
  iss: string
  sub: string
  aud: string
  role: string
  /** Expiration time, in seconds since the epoch. */
  exp: number
}

export type JwtPart = 'header' | 'payload' | 'signature'

export type JwtToken = {
  header: JwtHeader
  claims: JwtClaims
  /** The three base64url parts, as they travel joined by dots. */
  encoded: Record<JwtPart, string>
}

export type JwtParams = {
  /** `tampered`: the holder edited a claim after the issuer signed the token. */
  payload: 'issued' | 'tampered'
  /** Whether the verifier's clock is before or after the token's `exp`. */
  clock: 'valid' | 'expired'
}

export type JwtCheck = 'signature' | 'claims' | 'authorize'

export type JwtStepId = 'signatureValid' | 'signatureInvalid' | 'claimsValid' | 'claimsRejected' | 'authorized'

export type JwtStep = {
  id: JwtStepId
  check: JwtCheck
  passed: boolean
}

export type JwtClaimChecks = Record<'iss' | 'aud' | 'exp', boolean>
