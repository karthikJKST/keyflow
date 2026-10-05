import { formatTimer } from '../utils/typingMetrics.js'
import '../styles/practice.css'

/**
 * The TIME cell of the compact statistics row (countdown format 05:00).
 */
export default function Timer({ remainingSeconds }) {
  return (
    <div
      className="stat stat--time"
      role="timer"
      aria-live="off"
      aria-label={`Time remaining: ${formatTimer(remainingSeconds)}`}
    >
      <span className="stat__label">Time</span>
      <span className="stat__value">{formatTimer(remainingSeconds)}</span>
    </div>
  )
}
