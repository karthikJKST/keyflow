import { computeCpm, formatClock } from '../utils/typingMetrics.js'
import '../styles/results.css'

/** Circular accuracy meter (SVG, no external deps). */
function AccuracyRing({ percent }) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, percent))
  const dash = (clamped / 100) * circumference

  return (
    <svg
      className="accuracy-ring"
      viewBox="0 0 120 120"
      role="img"
      aria-label={`Accuracy ${percent.toFixed(1)} percent`}
    >
      <circle className="accuracy-ring__track" cx="60" cy="60" r={radius} />
      <circle
        className="accuracy-ring__value"
        cx="60"
        cy="60"
        r={radius}
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
      />
      <text x="60" y="56" className="accuracy-ring__number">
        {percent.toFixed(1)}%
      </text>
      <text x="60" y="75" className="accuracy-ring__unit">
        accuracy
      </text>
    </svg>
  )
}

function ResultStat({ label, value, tone }) {
  return (
    <div className={`result-stat${tone ? ` result-stat--${tone}` : ''}`}>
      <span className="result-stat__label">{label}</span>
      <span className="result-stat__value">{value}</span>
    </div>
  )
}

/**
 * Final screen after the timer expires or the session is ended early.
 * Accuracy is the primary result; improvement is only ever claimed when a
 * real previous session exists and accuracy genuinely went up.
 */
export default function ResultScreen({
  metrics,
  durationSeconds,
  onRestart,
  onHome,
  previousSession,
}) {
  const cpm = computeCpm(metrics.totalKeys, durationSeconds)
  const delta =
    previousSession != null && metrics.totalKeys > 0
      ? metrics.accuracy - previousSession.accuracy
      : null
  const improved = delta != null && delta > 0

  return (
    <main className="results" aria-labelledby="results-title">
      <section className="card results__card">
        <h1 id="results-title" className="results__status">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path
              d="M2.5 8.5l3.4 3.4 7.6-7.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Session complete
        </h1>

        <AccuracyRing percent={metrics.accuracy} />

        <p className="results__lede">
          Great work. You completed your practice session.
        </p>

        <div className="results__grid">
          <ResultStat label="Keys pressed" value={metrics.totalKeys} />
          <ResultStat label="Correct" value={metrics.correct} tone="ok" />
          <ResultStat label="Errors" value={metrics.incorrect} tone="err" />
          <ResultStat label="CPM" value={cpm == null ? '—' : cpm} />
        </div>

        <p className="results__duration">
          Time practiced {formatClock(durationSeconds)}
        </p>

        {improved && (
          <p className="results__note">
            ↑ {delta.toFixed(1)}% from your previous session
          </p>
        )}

        <div className="results__actions">
          <button type="button" className="btn btn--primary btn--xl" onClick={onRestart}>
            Practice Again
          </button>
          <button type="button" className="btn btn--ghost" onClick={onHome}>
            Back to Home
          </button>
        </div>
      </section>
    </main>
  )
}
