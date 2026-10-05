import KeyboardKey from './KeyboardKey.jsx'
import { HOME_ROW_KEYS } from '../utils/constants.js'
import '../styles/keyboard.css'

const GAP_AFTER_F = 4

/**
 * Visual keyboard showing only the 8 home-row keys. The expected key gets
 * a persistent active state; the last pressed key flashes briefly.
 */
export default function VirtualKeyboard({ nextKey, lastHitKey }) {
  return (
    <div className="vkeyboard" role="group" aria-label="Visual keyboard">
      <div className="vkeyboard__row">
        {HOME_ROW_KEYS.map((keyChar, index) => (
          <div key={keyChar} className="vkeyboard__cell">
            {index === GAP_AFTER_F && <div className="vkeyboard__gap" aria-hidden="true" />}
            <KeyboardKey
              keyChar={keyChar}
              isActive={keyChar === nextKey}
              wasHit={keyChar === lastHitKey}
            />
          </div>
        ))}
      </div>
      <div className="vkeyboard__hands" aria-hidden="true">
        <span>left hand</span>
        <span>right hand</span>
      </div>
      <div className="vkeyboard__thumbs" aria-hidden="true" />
    </div>
  )
}
