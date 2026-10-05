/**
 * Session history — a tiny localStorage-backed store for recent practice
 * sessions. Optional feature: fails silently in private-mode / blocked
 * storage so it can never break the core typing experience.
 */
import { MAX_HISTORY_ENTRIES, STORAGE_KEY_HISTORY } from './constants.js'

function readStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_HISTORY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStore(entries) {
  try {
    window.localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(entries))
  } catch {
    /* storage unavailable (private mode / quota) — history is optional */
  }
}

/** @returns {Array} Most recent sessions, newest first. */
export function getSessionHistory() {
  return readStore()
}

/**
 * Persist a completed session. Returns the updated list (newest first).
 * @param {{ keys: number, correct: number, incorrect: number, accuracy: number, durationSeconds: number }} summary
 */
export function saveSessionToHistory(summary) {
  const entries = readStore()
  const record = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    finishedAt: new Date().toISOString(),
    ...summary,
  }
  const next = [record, ...entries].slice(0, MAX_HISTORY_ENTRIES)
  writeStore(next)
  return next
}
