import { FINGER_BY_KEY, HAND_BY_KEY } from '../utils/constants.js'
import '../styles/keyboard.css'

/** One physical-looking key cap. */
export default function KeyboardKey({ keyChar, isActive, wasHit }) {
  const upper = keyChar.toUpperCase()
  const finger = FINGER_BY_KEY[keyChar]
  const hand = HAND_BY_KEY[keyChar]

  const classes = ['key']
  if (isActive) classes.push('key--active')
  if (wasHit) classes.push('key--hit')

  return (
    <button
      type="button"
      className={classes.join(' ')}
      data-hand={hand}
      tabIndex={-1}
      aria-label={`${upper} key — ${finger} finger, ${hand} hand${
        isActive ? ' (next key)' : ''
      }`}
    >
      <span className="key__cap">{upper}</span>
      <span className="key__finger" aria-hidden="true">
        {finger}
      </span>
    </button>
  )
}
