import { scriptedModel } from '../../scripted'
import type {
  ArtifactLocation,
  FailableStage,
  PipelineParams,
  PipelineStep,
  PipelineStepId,
  StageId,
  StageStatus,
} from './types'

export const STAGES = [
  'push',
  'build',
  'unitTests',
  'artifact',
  'acceptance',
  'staging',
  'approval',
  'production',
] as const satisfies readonly StageId[]

const FAILURE_STEP: Record<FailableStage, PipelineStepId> = {
  unitTests: 'unitTestsFailed',
  acceptance: 'acceptanceFailed',
}

/** Stage that puts the artifact in each place. It is built once and the same build is promoted afterwards. */
export const DELIVERED_BY: Record<ArtifactLocation, StageId> = {
  registry: 'artifact',
  staging: 'staging',
  production: 'production',
}

/** The stages run in order and the run ends at the first one that fails. */
export function buildRun({ failAt }: PipelineParams): PipelineStep[] {
  const stages = failAt ? STAGES.slice(0, STAGES.indexOf(failAt) + 1) : STAGES
  return stages.map((stage) =>
    stage === failAt ? { id: FAILURE_STEP[failAt], stage, passed: false } : { id: stage, stage, passed: true },
  )
}

/** Status of every stage after `index` steps: once a stage fails, the ones that did not run yet are blocked. */
export function stageStatuses(steps: PipelineStep[], index: number): Record<StageId, StageStatus> {
  const executed = steps.slice(0, index)
  const idle: StageStatus = executed.some((step) => !step.passed) ? 'blocked' : 'pending'
  const status = (stage: StageId): StageStatus => {
    const step = executed.find((candidate) => candidate.stage === stage)
    return step ? (step.passed ? 'passed' : 'failed') : idle
  }
  return {
    push: status('push'),
    build: status('build'),
    unitTests: status('unitTests'),
    artifact: status('artifact'),
    acceptance: status('acceptance'),
    staging: status('staging'),
    approval: status('approval'),
    production: status('production'),
  }
}

export function holdsArtifact(statuses: Record<StageId, StageStatus>, location: ArtifactLocation): boolean {
  return statuses[DELIVERED_BY[location]] === 'passed'
}

export const pipelineModel = scriptedModel(buildRun)
