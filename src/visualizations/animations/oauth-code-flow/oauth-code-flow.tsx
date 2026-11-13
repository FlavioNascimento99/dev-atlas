'use client'

import { useLocale } from '@/lib/i18n/use-locale'
import { SequenceDiagram } from '../../primitives/sequence-diagram'
import { useSimulation } from '../../use-simulation'
import { VisualLab } from '../../visual-lab'
import { OAUTH_ACTORS, oauthModel } from './script'
import { texts } from './texts'

/** Type B lab: the authorization code grant with PKCE, from the authorization request to the API call. */
export function OAuthCodeFlow() {
  const t = texts[useLocale()]
  const { state, playback } = useSimulation(oauthModel, undefined)
  const step = state.steps[state.index - 1]

  return (
    <VisualLab
      title={t.title}
      description={t.description}
      fidelity="faithful"
      playback={playback}
      explanation={step ? t.steps[step.id] : t.start}
    >
      <SequenceDiagram
        title={t.svgTitle}
        description={t.svgDescription}
        actors={OAUTH_ACTORS}
        actorLabels={t.actors}
        labels={t.labels}
        steps={state.steps}
        current={state.index}
      />
    </VisualLab>
  )
}
