import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import StartScreen from './components/StartScreen.jsx'
import PracticeArea from './components/PracticeArea.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'
import { useTypingSession } from './hooks/useTypingSession.js'
import { getSessionHistory, saveSessionToHistory } from './utils/sessionHistory.js'
import './styles/layout.css'
import './styles/practice.css'
import './styles/keyboard.css'
import './styles/results.css'

export default function App() {
  const session = useTypingSession()
  const { phase, metrics, completedDurationSeconds } = session

  const [history, setHistory] = useState(() => getSessionHistory())
  const [previousSession, setPreviousSession] = useState(null)
  const [confirmingEnd, setConfirmingEnd] = useState(false)

  // Persist the session once when it completes. The effect intentionally
  // depends only on the phase so it records the final snapshot exactly
  // once. The previous session (for a truthful improvement note) is read
  // from storage BEFORE the new record is written.
  useEffect(() => {
    if (phase === 'completed' && metrics.totalKeys > 0) {
      setPreviousSession(getSessionHistory()[0] ?? null)
      setHistory(
        saveSessionToHistory({
          keys: metrics.totalKeys,
          correct: metrics.correct,
          incorrect: metrics.incorrect,
          accuracy: metrics.accuracy,
          durationSeconds: completedDurationSeconds,
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const handleStart = useCallback(() => {
    session.startPractice()
  }, [session.startPractice])

  const handlePracticeAgain = useCallback(() => {
    session.startPractice()
  }, [session.startPractice])

  const handleHome = useCallback(() => {
    session.restartPractice()
  }, [session.restartPractice])

  const handleConfirmEnd = useCallback(() => {
    setConfirmingEnd(false)
    session.endSession()
  }, [session.endSession])

  const handleCancelEnd = useCallback(() => {
    setConfirmingEnd(false)
  }, [])

  return (
    <div className="app">
      <Header onHome={handleHome} />
      <div className="app-main">
        {phase === 'ready' && (
          <StartScreen onStart={handleStart} history={history} />
        )}
        {phase === 'practicing' && (
          <PracticeArea
            session={session}
            onEndRequest={() => setConfirmingEnd(true)}
            inputDisabled={confirmingEnd}
          />
        )}
        {phase === 'completed' && (
          <ResultScreen
            metrics={metrics}
            durationSeconds={completedDurationSeconds}
            onRestart={handlePracticeAgain}
            onHome={handleHome}
            previousSession={previousSession}
          />
        )}
      </div>
      <footer className="app-footer">
        <p>KeyFlow — build muscle memory. One key at a time.</p>
      </footer>
      {confirmingEnd && (
        <ConfirmDialog
          title="End this practice session?"
          message={`Your results so far: ${metrics.totalKeys} keys, ${metrics.accuracy.toFixed(1)}% accuracy.`}
          confirmLabel="End Session"
          cancelLabel="Cancel"
          onConfirm={handleConfirmEnd}
          onCancel={handleCancelEnd}
        />
      )}
    </div>
  )
}
