import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTimer } from './useTimer.js'
import {
  FEEDBACK_DURATION_MS,
  SESSION_DURATION_SECONDS,
} from '../utils/constants.js'
import {
  extendPracticeGroups,
  generatePracticeGroups,
} from '../utils/textGenerator.js'
import { classifyKey, computeAccuracy, computeCpm } from '../utils/typingMetrics.js'
import { playCorrectSound, playIncorrectSound } from '../utils/sound.js'

/** When fewer than this many untyped chars remain, extend the sequence. */
const EXTEND_THRESHOLD = 60

/** How long the "not a home-row key" hint stays visible. */
const UNSUPPORTED_HINT_MS = 2500

/**
 * Owns the entire typing session: generated groups, current position,
 * counters, feedback and the 5-minute timer. App.jsx stays a thin shell.
 *
 * The sequence is an array of GROUPS of home-row characters only — no
 * separator characters exist in the data, so the cursor always rests on a
 * real practice key and Space is never a target.
 *
 * @returns session object consumed by the practice UI and results screen.
 */
export function useTypingSession() {
  const [phase, setPhase] = useState('ready') // ready | practicing | completed
  const [groups, setGroups] = useState(() => generatePracticeGroups())
  const [position, setPosition] = useState(0)
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 })
  const [feedback, setFeedback] = useState(null) // { type: 'correct'|'incorrect', key }
  const [lastUnsupported, setLastUnsupported] = useState(null)
  const [endedEarly, setEndedEarly] = useState(false)

  const feedbackTimerRef = useRef(null)
  const hintTimerRef = useRef(null)
  const positionRef = useRef(0)
  positionRef.current = position

  /** Flat sequence: only `asdfjkl;` characters, no spaces. */
  const sequence = useMemo(() => groups.join(''), [groups])

  /** Start index of each group inside the flat sequence (for rendering). */
  const groupOffsets = useMemo(() => {
    const offsets = []
    let cursor = 0
    for (const group of groups) {
      offsets.push(cursor)
      cursor += group.length
    }
    return offsets
  }, [groups])

  const sequenceRef = useRef(sequence)
  sequenceRef.current = sequence

  const finishSession = useCallback(() => {
    setPhase((current) => (current === 'practicing' ? 'completed' : current))
  }, [])

  const timer = useTimer(SESSION_DURATION_SECONDS, {
    onComplete: finishSession,
  })

  // Clear pending feedback/hint timeouts; never leak them across mounts.
  useEffect(() => {
    return () => {
      clearTimeout(feedbackTimerRef.current)
      clearTimeout(hintTimerRef.current)
    }
  }, [])

  const startPractice = useCallback(() => {
    setGroups(generatePracticeGroups())
    setPosition(0)
    setStats({ correct: 0, incorrect: 0 })
    setFeedback(null)
    setLastUnsupported(null)
    setEndedEarly(false)
    timer.start()
    setPhase('practicing')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.start])

  const restartPractice = useCallback(() => {
    timer.stop()
    setPhase('ready')
  }, [timer.stop])

  const endSession = useCallback(() => {
    timer.stop()
    setEndedEarly(true)
    finishSession()
  }, [finishSession, timer.stop])

  /** Evaluate one key press. Unsupported keys are ignored entirely. */
  const handleKeyEvent = useCallback(
    (key) => {
      if (phase !== 'practicing') return

      const kind = classifyKey(key)
      if (kind !== 'supported' && kind !== 'letter') return

      if (kind === 'letter') {
        setLastUnsupported(key.toLowerCase())
        clearTimeout(hintTimerRef.current)
        hintTimerRef.current = setTimeout(
          () => setLastUnsupported(null),
          UNSUPPORTED_HINT_MS
        )
        return
      }

      // --- supported key: evaluate immediately ---
      // The sequence contains only practice keys, so the expected
      // character is always one of a s d f j k l ; — never a blank.
      const expected = sequenceRef.current[positionRef.current]
      if (expected == null) return

      const isCorrect = key.toLowerCase() === expected
      setStats((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      }))

      const nextPosition = positionRef.current + 1
      positionRef.current = nextPosition
      setPosition(nextPosition)
      setFeedback({ type: isCorrect ? 'correct' : 'incorrect', key: expected })

      if (isCorrect) playCorrectSound()
      else playIncorrectSound()

      clearTimeout(feedbackTimerRef.current)
      feedbackTimerRef.current = setTimeout(
        () => setFeedback(null),
        FEEDBACK_DURATION_MS
      )
    },
    [phase]
  )

  // Keep the sequence ahead of the typist: extend when running low.
  useEffect(() => {
    if (phase !== 'practicing') return
    if (position > 0 && sequence.length - position < EXTEND_THRESHOLD) {
      setGroups((prev) => [...prev, ...extendPracticeGroups()])
    }
  }, [phase, position, sequence])

  const total = stats.correct + stats.incorrect

  const metrics = useMemo(
    () => ({
      totalKeys: total,
      correct: stats.correct,
      incorrect: stats.incorrect,
      accuracy: computeAccuracy({ correct: stats.correct, total }),
    }),
    [stats, total]
  )

  // Characters per minute from real input; null until there is enough
  // elapsed time for the number to be meaningful.
  const cpm = computeCpm(total, timer.elapsedSeconds)

  const completedDurationSeconds = endedEarly
    ? timer.elapsedSeconds
    : SESSION_DURATION_SECONDS

  return {
    phase,
    sequence,
    groups,
    groupOffsets,
    position,
    metrics,
    cpm,
    feedback,
    lastUnsupported,
    timer,
    completedDurationSeconds,
    startPractice,
    restartPractice,
    endSession,
    handleKeyEvent,
  }
}
