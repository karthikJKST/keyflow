import { useEffect, useState } from 'react'
import { STORAGE_KEY_SOUND } from '../utils/constants.js'
import { setSoundEnabled } from '../utils/sound.js'

const SOUND_ON_ICON = (
  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
    <path
      d="M4 9.5v5h3.2L12 18.6V5.4L7.2 9.5H4Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="M15.4 9.4a4 4 0 0 1 0 5.2M17.8 7.2a7 7 0 0 1 0 9.6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
)

const SOUND_OFF_ICON = (
  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
    <path
      d="M4 9.5v5h3.2L12 18.6V5.4L7.2 9.5H4Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="M15.5 9.8l4.2 4.4M19.7 9.8l-4.2 4.4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
)

function readInitialPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY_SOUND) !== 'off'
  } catch {
    return true
  }
}

/**
 * Compact header toggle for keystroke feedback sounds. Default is on (the
 * preference persists); sounds only ever play in response to typing, never
 * on load.
 */
export default function SoundToggle() {
  const [enabled, setEnabled] = useState(readInitialPreference)

  useEffect(() => {
    setSoundEnabled(enabled)
  }, [enabled])

  const toggle = () => {
    const next = !enabled
    setEnabled(next)
    try {
      localStorage.setItem(STORAGE_KEY_SOUND, next ? 'on' : 'off')
    } catch {
      /* preference simply won't persist */
    }
  }

  return (
    <button
      type="button"
      className={`icon-btn${enabled ? '' : ' icon-btn--muted'}`}
      onClick={toggle}
      aria-label={enabled ? 'Turn sound off' : 'Turn sound on'}
      aria-pressed={enabled}
      title={enabled ? 'Sound on' : 'Sound off'}
    >
      {enabled ? SOUND_ON_ICON : SOUND_OFF_ICON}
    </button>
  )
}
