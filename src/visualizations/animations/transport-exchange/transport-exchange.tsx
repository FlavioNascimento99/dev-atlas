'use client'

import { format } from '@/lib/i18n/dictionary'
import { useLocale } from '@/lib/i18n/use-locale'
import { ChoiceParameter } from '../../primitives/choice-parameter'
import { SequenceDiagram } from '../../primitives/sequence-diagram'
import { useSimulation } from '../../use-simulation'
import { VisualLab } from '../../visual-lab'
import { TRANSPORT_ACTORS, transportModel } from './script'
import { texts } from './texts'

/** Type B lab: the same three packets over TCP and over UDP, with and without losing the second one. */
export function TransportExchange() {
  const locale = useLocale()
  const t = texts[locale]
  const { params, state, setParams, playback } = useSimulation(transportModel, { protocol: 'tcp', loss: true })
  const step = state.steps[state.index - 1]
  const delivered = step?.delivered ?? []

  return (
    <VisualLab
      title={t.title}
      description={t.description}
      fidelity="conceptual"
      playback={playback}
      explanation={
        <>
          <p>{step ? t.steps[step.id] : t.start[params.protocol]}</p>
          <p className="mt-1 font-mono text-muted-foreground">
            {format(t.delivered, {
              packets: delivered.length > 0 ? new Intl.ListFormat(locale, { type: 'unit' }).format(delivered.map(String)) : t.nothing,
            })}
          </p>
        </>
      }
      parameters={
        <div className="grid gap-4 sm:grid-cols-2">
          <ChoiceParameter
            label={t.protocol}
            value={params.protocol}
            options={[
              { value: 'tcp', label: 'TCP' },
              { value: 'udp', label: 'UDP' },
            ]}
            onChange={(protocol) => setParams({ ...params, protocol })}
          />
          <ChoiceParameter
            label={t.loss}
            value={params.loss ? 'lost' : 'arrives'}
            options={[
              { value: 'arrives', label: t.arrives },
              { value: 'lost', label: t.isLost },
            ]}
            onChange={(loss) => setParams({ ...params, loss: loss === 'lost' })}
          />
        </div>
      }
    >
      <SequenceDiagram
        title={t.svgTitle}
        description={t.svgDescription}
        actors={TRANSPORT_ACTORS}
        actorLabels={t.actors}
        labels={t.labels}
        steps={state.steps}
        current={state.index}
      />
    </VisualLab>
  )
}
