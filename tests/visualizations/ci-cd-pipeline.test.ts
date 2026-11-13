import { describe, expect, it } from 'vitest'
import { buildRun, holdsArtifact, STAGES, stageStatuses } from '@/visualizations/animations/ci-cd-pipeline/script'
import type { ArtifactLocation, PipelineParams } from '@/visualizations/animations/ci-cd-pipeline/types'

const LOCATIONS: ArtifactLocation[] = ['registry', 'staging', 'production']

function finalState(params: PipelineParams) {
  const steps = buildRun(params)
  const statuses = stageStatuses(steps, steps.length)
  return { steps, statuses, holders: LOCATIONS.filter((location) => holdsArtifact(statuses, location)) }
}

describe('deployment pipeline', () => {
  it('runs every stage in order and promotes the artifact to production when all tests pass', () => {
    const { steps, statuses, holders } = finalState({ failAt: null })
    expect(steps.map((step) => step.stage)).toEqual([...STAGES])
    expect(Object.values(statuses).every((status) => status === 'passed')).toBe(true)
    expect(holders).toEqual(LOCATIONS)
  })

  it('stops at the failed unit tests, blocks every later stage and builds no artifact', () => {
    const { steps, statuses, holders } = finalState({ failAt: 'unitTests' })
    expect(steps.at(-1)).toEqual({ id: 'unitTestsFailed', stage: 'unitTests', passed: false })
    expect(STAGES.map((stage) => statuses[stage])).toEqual([
      'passed',
      'passed',
      'failed',
      'blocked',
      'blocked',
      'blocked',
      'blocked',
      'blocked',
    ])
    expect(holders).toEqual([])
  })

  it('keeps the artifact in the registry and promotes it nowhere when acceptance tests fail', () => {
    const { statuses, holders } = finalState({ failAt: 'acceptance' })
    expect(statuses.acceptance).toBe('failed')
    expect(statuses.production).toBe('blocked')
    expect(holders).toEqual(['registry'])
  })

  it('builds the artifact once, after the unit tests, and never deploys before it exists', () => {
    const stages = buildRun({ failAt: null }).map((step) => step.stage)
    expect(stages.filter((stage) => stage === 'artifact')).toHaveLength(1)
    expect(stages.indexOf('unitTests')).toBeLessThan(stages.indexOf('artifact'))
    expect(stages.indexOf('artifact')).toBeLessThan(stages.indexOf('staging'))
  })

  it('reaches production only after staging and the approval', () => {
    const steps = buildRun({ failAt: null })
    for (let index = 0; index <= steps.length; index++) {
      const statuses = stageStatuses(steps, index)
      if (holdsArtifact(statuses, 'production')) {
        expect(holdsArtifact(statuses, 'staging')).toBe(true)
        expect(statuses.approval).toBe('passed')
      }
    }
  })

  it('leaves the stages that have not run yet pending while nothing has failed', () => {
    const steps = buildRun({ failAt: 'acceptance' })
    expect(stageStatuses(steps, 2).unitTests).toBe('pending')
    expect(stageStatuses(steps, 0).push).toBe('pending')
  })
})
