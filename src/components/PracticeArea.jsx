import { FINGER_BY_KEY, HAND_BY_KEY, SESSION_DURATION_SECONDS } from '../utils/constants.js'
import Timer from './Timer.jsx'
import Stats from './Stats.jsx'
import TypingText, { TypingLegend } from './TypingText.jsx'
import TypingInput from './TypingInput.jsx'
import VirtualKeyboard from './VirtualKeyboard.jsx'
import FingerGuide from './FingerGuide.jsx'
import '../styles/practice.css'

const CAPTURE = (word) => word.charAt(0).toUpperCase() + word.slice(1)

/**
 * The core practice experience, ordered by importance:
 * timer → current key → typing sequence → keyboard → statistics.
 * The "Type this next" key is the strongest visual element on screen.
 */
export default function PracticeArea({ session, onEndRequest, inputDisabled = false }) {
  const {
    sequence,
    groups,
    groupOffsets,
    position,
    metrics,
    cpm,
    feedback,
    lastUnsupported,
    timer,
    handleKeyEvent,
  } = session

  // The sequence only contains home-row characters, so the next key is
  // always one of a s d f j k l ; — never empty, never a space.
  const nextKey = sequence[position] ?? sequence[0]
  const fingerLabel = `${CAPTURE(HAND_BY_KEY[nextKey])} ${FINGER_BY_KEY[nextKey]} Finger`
  const progress =
    ((SESSION_DURATION_SECONDS - timer.remainingSeconds) /
      SESSION_DURATION_SECONDS) *
    100

  return (
    <section className="practice" aria-label="Practice session">
      <div className="practice__topbar">
        <span className="session-status session-status--active">
          <span className="session-status__dot" aria-hidden="true" />
          Practicing
        </span>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={onEndRequest}
        >
          End Session
        </button>
      </div>

      <div className="stats-row">
        <Timer remainingSeconds={timer.remainingSeconds} />
        <Stats
          keys={metrics.totalKeys}
          accuracy={metrics.accuracy}
          correct={metrics.correct}
          incorrect={metrics.incorrect}
          cpm={cpm}
        />
        <div className="session-progress" aria-hidden="true">
          <span
            className="session-progress__fill"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      </div>

      <div className="practice__stage card">
        <div className="practice__prompt">
          <span className="practice__prompt-label">Type this next</span>
          <span
            key={nextKey}
            className={`practice__prompt-key practice__prompt-key--${feedback?.type ?? 'idle'}`}
          >
            {nextKey.toUpperCase()}
          </span>
          <span className="practice__prompt-finger">{fingerLabel}</span>
          <span className="visually-hidden">{`Next key: ${nextKey}`}</span>
          {lastUnsupported && (
            <span className="practice__unsupported" role="status">
              “{lastUnsupported.key}” is not a home-row key — practice only the
              highlighted keys.
            </span>
          )}
        </div>

        <TypingText
          sequence={sequence}
          groups={groups}
          groupOffsets={groupOffsets}
          position={position}
        />
        <TypingLegend />

        <TypingInput onKey={handleKeyEvent} disabled={inputDisabled} />

        <VirtualKeyboard
          nextKey={nextKey}
          lastHitKey={feedback?.type === 'correct' ? feedback.key : null}
        />
      </div>

      <FingerGuide compact />
    </section>
  )
}
