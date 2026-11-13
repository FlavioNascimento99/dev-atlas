'use client'

import { useLocale } from '@/lib/i18n/use-locale'
import { ChoiceParameter } from '../../primitives/choice-parameter'
import { SequenceDiagram } from '../../primitives/sequence-diagram'
import { useSimulation } from '../../use-simulation'
import { VisualLab } from '../../visual-lab'
import { DNS_ACTORS, dnsModel } from './script'
import { texts } from './texts'

/** Type B lab: one name resolved by a recursive resolver, with an empty cache and with a warm one. */
export function DnsResolution() {
  const t = texts[useLocale()]
  const { params, state, setParams, playback } = useSimulation(dnsModel, { warmCache: false })
  const step = state.steps[state.index - 1]

  return (
    <VisualLab
      title={t.title}
      description={t.description}
      fidelity="conceptual"
      playback={playback}
      explanation={step ? t.steps[step.id] : params.warmCache ? t.startWarm : t.startCold}
      parameters={
        <ChoiceParameter
          label={t.cache}
          value={params.warmCache ? 'warm' : 'cold'}
          options={[
            { value: 'cold', label: t.cold },
            { value: 'warm', label: t.warm },
          ]}
          onChange={(cache) => setParams({ warmCache: cache === 'warm' })}
        />
      }
    >
      <SequenceDiagram
        title={t.svgTitle}
        description={t.svgDescription}
        actors={DNS_ACTORS}
        actorLabels={t.actors}
        labels={t.labels}
        steps={state.steps}
        current={state.index}
      />
    </VisualLab>
  )
}
