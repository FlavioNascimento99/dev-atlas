import type { ReactNode } from 'react'

/** Whether a lab is a didactic simplification or reproduces the real behavior faithfully (doc 02 §6.2). */
export type LabFidelity = 'conceptual' | 'faithful'

export type LabPlayback = {
  playing: boolean
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  /** Advances one step; omit for labs without discrete steps. */
  onStep?: () => void
}

export type VisualLabProps = {
  title: string
  description: string
  fidelity: LabFidelity
  /** The visualization area (SVG, canvas or DOM). */
  children: ReactNode
  playback?: LabPlayback
  parameters?: ReactNode
  /** Description of the current behavior; announced politely to assistive technology when it changes. */
  explanation: ReactNode
}
