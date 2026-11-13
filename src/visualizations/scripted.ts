import type { ScriptedState, SimulationModel } from './types'

/**
 * Model for labs that are a fixed sequence of steps instead of a simulation: `build` returns every step for the
 * given parameters and the shared playback reveals them one at a time. The current step is `steps[index - 1]`.
 */
export function scriptedModel<Params, Step>(build: (params: Params) => Step[]): SimulationModel<Params, ScriptedState<Step>> {
  return {
    create: (params) => ({ steps: build(params), index: 0 }),
    advance: (state) => ({ ...state, index: Math.min(state.index + 1, state.steps.length) }),
    isFinished: (state) => state.index >= state.steps.length,
  }
}
