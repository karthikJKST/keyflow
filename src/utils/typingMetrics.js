/**
 * Typing metrics — pure functions for validation and statistics.
 */
import { CPM_MIN_ELAPSED_SECONDS, HOME_ROW_KEYS } from './constants.js'

/** O(1) lookup for the supported practice keys. */
const SUPPORTED_KEYS = new Set(HOME_ROW_KEYS)

/**
 * Format seconds as M:SS (e.g. 300 -> "5:00", 277 -> "4:37").
 * Clamps at 0 so the timer can never display a negative value.
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatClock(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

/**
 * Format seconds as MM:SS with a zero-padded minute field, matching the
 * session countdown convention (300 -> "05:00", 59 -> "00:59").
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatTimer(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/**
 * Classify a KeyboardEvent key press.
 * @param {string} key value from the keyboard event.
 * @returns {'supported'|'letter'|'control'|'other'}
 *   supported — one of the 8 home-row keys
 *   letter    — an unsupported alphabetic key
 *   control   — modifier/navigation/editing keys (Shift, Backspace, arrows…)
 *   other     — any other non-practice character (space, punctuation…)
 */
export function classifyKey(key) {
  if (typeof key !== 'string' || key.length === 0) return 'other'
  const lower = key.toLowerCase()
  if (SUPPORTED_KEYS.has(lower)) return 'supported'
  if (key.length === 1 && /[a-z]/i.test(key)) return 'letter'
  if (key.length > 1) return 'control'
  return 'other'
}

/**
 * Accuracy in percent from raw counters.
 * No valid keys pressed -> 100% (nothing attempted yet, nothing wrong).
 * @param {{ correct: number, total: number }} param0
 * @returns {number} Accuracy 0–100 rounded to one decimal place.
 */
export function computeAccuracy({ correct, total }) {
  if (!total || total <= 0) return 100
  return Math.round((correct / total) * 1000) / 10
}

/**
 * Characters per minute from real input: valid keys typed divided by the
 * elapsed practice minutes. Returns null while there is not yet enough
 * elapsed time for the number to be meaningful (callers render "—").
 * @param {number} totalKeys valid keys typed so far
 * @param {number} elapsedSeconds actual elapsed session time
 * @returns {number|null} CPM rounded to an integer, or null too early.
 */
export function computeCpm(totalKeys, elapsedSeconds) {
  if (!Number.isFinite(elapsedSeconds) || elapsedSeconds < CPM_MIN_ELAPSED_SECONDS) {
    return null
  }
  return Math.round((totalKeys / elapsedSeconds) * 60)
}
