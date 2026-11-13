export type ObserverId = 'chart' | 'totals' | 'autosave'

/** Where the subject is in one change: untouched, value stored, calling observers, or back in the caller. */
export type ObserverPhase = 'idle' | 'changed' | 'notifying' | 'returned'

export type ObserverState = {
  /** Value held by the subject. */
  value: number
  /** Subscribed observers, in the order they subscribed. */
  listeners: ObserverId[]
  /** Value each observer received in its last notification. */
  seen: Record<ObserverId, number>
  phase: ObserverPhase
  /** Copy of the list taken when the notification started, with the observers still to be called. */
  queue: ObserverId[]
  /** Observer being called in this step. */
  current: ObserverId | null
}
