import '../styles/practice.css'

/**
 * Compact live statistics: KEYS · ACCURACY · CPM, with correct/incorrect
 * as smaller secondary information below the row.
 */
export default function Stats({ keys, accuracy, correct, incorrect, cpm }) {
  return (
    <>
      <div className="stat">
        <span className="stat__label">Keys</span>
        <span className="stat__value">{keys}</span>
        <span className="visually-hidden">{`${keys} keys pressed`}</span>
      </div>
      <div className="stat">
        <span className="stat__label">Accuracy</span>
        <span className="stat__value">{`${accuracy.toFixed(1)}%`}</span>
      </div>
      <div className="stat">
        <span className="stat__label">CPM</span>
        <span className="stat__value">{cpm == null ? '—' : cpm}</span>
        <span className="visually-hidden">characters per minute</span>
      </div>
      <div className="stats__secondary">
        <span className="stats__ok">✓ {correct} correct</span>
        <span className="stats__err">✕ {incorrect} incorrect</span>
        <span className="visually-hidden">
          {`${correct} correct and ${incorrect} incorrect of ${keys} keys`}
        </span>
      </div>
    </>
  )
}
