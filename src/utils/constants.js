/**
 * KeyFlow constants — the single source of truth for practice rules.
 */

/** The 8 home-row keys KeyFlow trains. */
export const HOME_ROW_KEYS = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';']

/** Session length in seconds (5 minutes). */
export const SESSION_DURATION_SECONDS = 300

/** Milliseconds a transient correct/incorrect feedback stays visible. */
export const FEEDBACK_DURATION_MS = 350

/** Cap for stored sessions in localStorage history. */
export const MAX_HISTORY_ENTRIES = 10

/** Characters of the sequence kept visible around the current target. */
export const TYPING_WINDOW = 48

/**
 * CPM needs a little elapsed time before it means anything: below this
 * many elapsed seconds the UI shows an em dash instead of a misleading
 * spike.
 */
export const CPM_MIN_ELAPSED_SECONDS = 10

/** Finger → key assignment used by the finger guide and keyboard hands. */
export const FINGER_BY_KEY = {
  a: 'Pinky',
  s: 'Ring',
  d: 'Middle',
  f: 'Index',
  j: 'Index',
  k: 'Middle',
  l: 'Ring',
  ';': 'Pinky',
}

/** Which hand each key belongs to. */
export const HAND_BY_KEY = {
  a: 'left',
  s: 'left',
  d: 'left',
  f: 'left',
  j: 'right',
  k: 'right',
  l: 'right',
  ';': 'right',
}

/** localStorage key for the persisted theme preference. */
export const STORAGE_KEY_THEME = 'keyflow.theme'

/** localStorage key for the feedback-sound preference. */
export const STORAGE_KEY_SOUND = 'keyflow.sound'

/** localStorage key for recent session history. */
export const STORAGE_KEY_HISTORY = 'keyflow.sessionHistory.v1'
