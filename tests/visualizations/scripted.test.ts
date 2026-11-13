import { describe, expect, it } from 'vitest'
import { scriptedModel } from '@/visualizations/scripted'

const model = scriptedModel((count: number) => Array.from({ length: count }, (_, step) => `step ${step + 1}`))

describe('scripted model', () => {
  it('starts before the first step, with the steps built from the parameters', () => {
    const state = model.create(3)
    expect(state).toEqual({ steps: ['step 1', 'step 2', 'step 3'], index: 0 })
    expect(model.isFinished?.(state)).toBe(false)
  })

  it('reveals one step per advance and finishes on the last one', () => {
    let state = model.create(2)
    state = model.advance(state, 2)
    expect(state.steps[state.index - 1]).toBe('step 1')
    expect(model.isFinished?.(state)).toBe(false)
    state = model.advance(state, 2)
    expect(state.steps[state.index - 1]).toBe('step 2')
    expect(model.isFinished?.(state)).toBe(true)
  })

  it('stays on the last step when advanced past the end', () => {
    const finished = model.advance(model.advance(model.create(1), 1), 1)
    expect(finished.index).toBe(1)
  })
})
