import type { ReactNode } from 'react'

/** Whether a lab is a didactic simplification or reproduces the real behavior faithfully (doc 02 §6.2). */
export type LabFidelity = 'conceptual' | 'faithful'

export type LabPlayback = {
  playing: boolean
  /** The simulation reached its last state; Play restarts it and Step is disabled. */
  finished: boolean
  speed: number
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  onStep: () => void
  onSpeedChange: (speed: number) => void
}

export type VisualLabProps = {
  title: string
  description: string
  fidelity: LabFidelity
  /** The visualization area (SVG, canvas or DOM). */
  children: ReactNode
  playback: LabPlayback
  parameters?: ReactNode
  /** Description of the current behavior; announced politely to assistive technology when it changes. */
  explanation: ReactNode
}

/** A pure, deterministic simulation driven by the shared playback hook. */
export type SimulationModel<Params, State> = {
  create: (params: Params) => State
  advance: (state: State, params: Params) => State
  /** Omit for simulations that run indefinitely. */
  isFinished?: (state: State) => boolean
}
