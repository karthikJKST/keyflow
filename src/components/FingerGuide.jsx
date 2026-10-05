import { FINGER_BY_KEY } from '../utils/constants.js'
import '../styles/practice.css'

const LEFT_ORDER = ['a', 's', 'd', 'f']
const RIGHT_ORDER = ['j', 'k', 'l', ';']

function FingerRow({ keys }) {
  return (
    <ul className="finger-guide__list">
      {keys.map((keyChar) => (
        <li key={keyChar} className="finger-guide__row">
          <span className="finger-guide__key">{keyChar.toUpperCase()}</span>
          <span className="finger-guide__arrow" aria-hidden="true">→</span>
          <span className="finger-guide__finger">{FINGER_BY_KEY[keyChar]}</span>
        </li>
      ))}
    </ul>
  )
}

/** Compact finger-assignment guide (secondary to the practice area). */
export default function FingerGuide({ compact = false }) {
  return (
    <aside
      className={`finger-guide${compact ? ' finger-guide--compact' : ''}`}
      aria-label="Finger placement guide"
    >
      <div className="finger-guide__col">
        <h3 className="finger-guide__title">Left hand</h3>
        <FingerRow keys={LEFT_ORDER} />
      </div>
      <div className="finger-guide__col">
        <h3 className="finger-guide__title">Right hand</h3>
        <FingerRow keys={RIGHT_ORDER} />
      </div>
    </aside>
  )
}
