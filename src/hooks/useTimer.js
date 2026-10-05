import { useEffect, useRef, useState } from 'react'

/**
 * Timestamp-based countdown timer.
 *
 * Why timestamps: browsers throttle setInterval/setTimeout in background
 * tabs, so a naive "subtract 1 every tick" clock drifts badly. Here each
 * tick recomputes the remaining time from the wall-clock start time, so
 * the countdown stays accurate even when throttled — and the elapsed time
 * used in the results is measured the same way.
 *
 * The interval only ever fires once (single timer guarantee: every effect
 * cleanup clears the previous interval before a new one can start).
 *
 * @param {number} durationSeconds Total session length (300 for 5:00).
 * @param {{ onComplete?: (elapsedSeconds: number) => void }} handlers
 * @returns {{ remainingSeconds: number, elapsedSeconds: number, isRunning: boolean, start: () => void, stop: () => void }}
 */
export function useTimer(durationSeconds, { onComplete } = {}) {
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds)
  const [isRunning, setIsRunning] = useState(false)

  const startTimestampRef = useRef(null)
  const onSpill = useRef(onComplete)
  onSpill.current = onComplete

  const start = () => {
    if (startTimestampRef.current != null) return
    startTimestampRef.current = Date.now()
    setIsRunning(true)
    // Recompute immediately so the display flips from 5:00 to 4:59 in the
    // first second instead of appearing stuck for a full tick.
    setRemainingSeconds(computeRemaining())
  }

  const stop = () => {
    if (startTimestampRef.current == null) return
    setRemainingSeconds(computeRemaining())
    startTimestampRef.current = null
    setIsRunning(false)
  }

  function computeRemaining() {
    if (startTimestampRef.current == null) return durationSeconds
    const elapsedMs = Date.now() - startTimestampRef.current
    return Math.max(0, durationSeconds - Math.floor(elapsedMs / 1000))
  }

  useEffect(() => {
    if (!isRunning) return undefined

    const tick = () => {
      const remaining = computeRemaining()
      setRemainingSeconds(remaining)
      if (remaining <= 0) {
        startTimestampRef.current = null
        setIsRunning(false)
        if (onSpill.current) onSpill.current(durationSeconds)
      }
    }

    const intervalId = setInterval(tick, 250)
    return () => clearInterval(intervalId)
    // durationSeconds is fixed for a session; computeRemaining is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, durationSeconds])

  return {
    remainingSeconds,
    elapsedSeconds: durationSeconds - remainingSeconds,
    isRunning,
    start,
    stop,
  }
}
