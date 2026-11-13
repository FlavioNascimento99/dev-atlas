'use client'

import { useEffect, useState } from 'react'
import { BASE_TICK_MS } from './constants'
import type { LabPlayback, SimulationModel } from './types'

/**
 * Shared playback for every lab: owns the parameters and the simulation state, and advances the pure
 * `advance` function on a timer while playing. Changing a parameter restarts the simulation from it.
 */
export function useSimulation<Params, State>(model: SimulationModel<Params, State>, initialParams: Params) {
  const [store, setStore] = useState(() => ({ params: initialParams, state: model.create(initialParams) }))
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const finished = model.isFinished?.(store.state) ?? false
  const running = playing && !finished

  const step = () => setStore((current) => ({ ...current, state: model.advance(current.state, current.params) }))
  const reset = () => setStore((current) => ({ ...current, state: model.create(current.params) }))

  useEffect(() => {
    if (!running) return
    const timer = setInterval(
      () => setStore((current) => ({ ...current, state: model.advance(current.state, current.params) })),
      BASE_TICK_MS / speed,
    )
    return () => clearInterval(timer)
  }, [running, speed, model])

  const playback: LabPlayback = {
    playing: running,
    finished,
    speed,
    onPlay: () => {
      if (finished) reset()
      setPlaying(true)
    },
    onPause: () => setPlaying(false),
    onReset: () => {
      setPlaying(false)
      reset()
    },
    onStep: step,
    onSpeedChange: setSpeed,
  }

  const setParams = (params: Params) => setStore({ params, state: model.create(params) })

  return { params: store.params, state: store.state, setParams, playback }
}
