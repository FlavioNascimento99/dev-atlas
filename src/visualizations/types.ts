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
  /** Omit for a static diagram: the frame renders no playback controls. */
  playback?: LabPlayback
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

/** State of a scripted lab: a fixed sequence of steps and how many of them were already revealed. */
export type ScriptedState<Step> = {
  steps: Step[]
  index: number
}

/** One row of a sequence diagram. `Label` is a key of the lab texts, so scripts stay free of display strings. */
export type SequenceEvent<Actor extends string, Label extends string> =
  | {
      kind: 'message'
      from: Actor
      to: Actor
      label: Label
      /** Drawn dashed: a response to an earlier message. */
      reply?: boolean
      /** The message dies halfway and never reaches its destination. */
      lost?: boolean
    }
  | { kind: 'note'; at: Actor; label: Label }

/** The events a scripted step adds to a sequence diagram. */
export type SequenceStep<Actor extends string, Label extends string> = {
  events: SequenceEvent<Actor, Label>[]
}
