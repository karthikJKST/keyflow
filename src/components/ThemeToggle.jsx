import { useEffect, useState } from 'react'
import { STORAGE_KEY_THEME } from '../utils/constants.js'

const MOON_ICON = (
  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
    <path
      d="M20 13.5A8.2 8.2 0 0 1 10.5 4 8.5 8.5 0 1 0 20 13.5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
)

const SUN_ICON = (
  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="M12 3.2v2.2M12 18.6v2.2M3.2 12h2.2M18.6 12h2.2M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
)

function readInitialTheme() {
  const fromDom = document.documentElement.getAttribute('data-theme')
  if (fromDom === 'dark' || fromDom === 'light') return fromDom
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/**
 * Compact header toggle. The initial theme is resolved before first paint
 * by a tiny inline script in index.html (saved preference, else system
 * prefers-color-scheme); this component keeps React state in sync with the
 * DOM, persists explicit choices, and follows the system theme until the
 * user picks one.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState(readInitialTheme)

  // Follow system changes only while the user has no explicit preference.
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!media?.addEventListener) return undefined

    const handleChange = (event) => {
      try {
        if (localStorage.getItem(STORAGE_KEY_THEME)) return
      } catch {
        /* storage unavailable — still follow the system */
      }
      const next = event.matches ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', next)
      setTheme(next)
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    setTheme(next)
    try {
      localStorage.setItem(STORAGE_KEY_THEME, next)
    } catch {
      /* preference simply won't persist */
    }
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light theme' : 'Dark theme'}
    >
      {isDark ? SUN_ICON : MOON_ICON}
    </button>
  )
}
