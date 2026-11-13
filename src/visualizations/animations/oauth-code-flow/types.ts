import type { SequenceEvent } from '../../types'

export type OAuthActor = 'browser' | 'client' | 'authorizationServer' | 'resourceServer'

/** Values whose path through the flow is what makes it safe or unsafe. */
export type OAuthArtifact = 'challenge' | 'state' | 'code' | 'verifier' | 'accessToken'

export type OAuthLabel =
  | 'pkce'
  | 'redirect'
  | 'authorizationRequest'
  | 'storeChallenge'
  | 'consent'
  | 'codeRedirect'
  | 'callback'
  | 'stateCheck'
  | 'tokenRequest'
  | 'verifyChallenge'
  | 'tokens'
  | 'apiCall'
  | 'validateToken'
  | 'data'

export type OAuthStepId =
  | 'prepare'
  | 'redirect'
  | 'authorizationRequest'
  | 'consent'
  | 'redirectBack'
  | 'callback'
  | 'tokenRequest'
  | 'tokenResponse'
  | 'apiCall'
  | 'apiResponse'

export type OAuthEvent = SequenceEvent<OAuthActor, OAuthLabel> & {
  /** Artifacts this message exposes to its sender, its receiver and the channel between them. */
  carries?: OAuthArtifact[]
}

export type OAuthStep = {
  id: OAuthStepId
  events: OAuthEvent[]
}
