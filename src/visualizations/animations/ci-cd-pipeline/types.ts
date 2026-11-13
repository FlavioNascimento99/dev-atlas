export type StageId = 'push' | 'build' | 'unitTests' | 'artifact' | 'acceptance' | 'staging' | 'approval' | 'production'

/** Stages whose checks can be made to fail in the lab. */
export type FailableStage = 'unitTests' | 'acceptance'

export type PipelineParams = {
  failAt: FailableStage | null
}

export type PipelineStepId = StageId | 'unitTestsFailed' | 'acceptanceFailed'

/** One stage executed by the pipeline. A failed stage is the last step of the run. */
export type PipelineStep = {
  id: PipelineStepId
  stage: StageId
  passed: boolean
}

/** `blocked`: the stage will not run because an earlier one failed. */
export type StageStatus = 'pending' | 'passed' | 'failed' | 'blocked'

/** Places that can hold the artifact built from the commit. */
export type ArtifactLocation = 'registry' | 'staging' | 'production'
