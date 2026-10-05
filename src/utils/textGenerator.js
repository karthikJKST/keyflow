/**
 * Practice content generator for KeyFlow.
 *
 * The generator produces an array of logical GROUPS of characters drawn
 * from four pattern families (single keys, digraphs, 4-key runs, paired
 * hand groups). The flattened sequence contains ONLY the eight home-row
 * characters `asdfjkl;` — there are no separator characters anywhere in
 * the data. Grouping is purely visual: the renderer draws a larger gap
 * between groups, so the user never has to press Space and the cursor can
 * never rest on a non-practice character.
 */
import { HOME_ROW_KEYS } from './constants.js'

/** 4-key "words" built from strict home-row runs. */
const RUNS = ['asdf', 'jkl;', 'fdsa', ';lkj']

/** Two-key digraphs that train adjacent-key movement. */
const DIGRAPHS = ['as', 'sd', 'df', 'fj', 'jk', 'kl', 'l;']

/** Paired hand groups: one left-hand run + one right-hand run. */
const PAIR_GROUPS = [
  ['asdf', 'jkl;'],
  ['fdsa', ';lkj'],
  ['asdf', 'fdsa'],
  ['jkl;', ';lkj'],
]

/** Mirrored alternating-hands drills, split into two visual groups. */
const MIRRORED_PAIRS = [
  ['fjd', 'ksa'],
  ['jfd', 'ksa'],
  ['fjk', 'dsa'],
  ['dks', 'fal'],
]

/** Default seed length: comfortably more than a fast 5-minute typist. */
const DEFAULT_TARGET_CHARS = 2000

/** How many characters one auto-extension adds during a session. */
const EXTEND_CHARS = 240

/** Pick a random element from an array. */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

/** Inclusive random integer in [min, max]. */
const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1))

/**
 * Build one practice chunk: 1–2 logical groups covering the four pattern
 * families. Every group contains only home-row characters.
 * @returns {string[]} non-empty group strings (no spaces, ever)
 */
function generateChunkGroups() {
  const roll = Math.random()

  if (roll < 0.2) {
    // Family 1: single-key drill, e.g. "asdj" (3–5 keys).
    const count = randomInt(3, 5)
    let group = ''
    for (let i = 0; i < count; i += 1) group += pick(HOME_ROW_KEYS)
    return [group]
  }

  if (roll < 0.45) {
    // Family 2: adjacent-key digraphs, e.g. "asdfjkl" (2–3 digraphs).
    const count = randomInt(2, 3)
    let group = ''
    for (let i = 0; i < count; i += 1) group += pick(DIGRAPHS)
    return [group]
  }

  if (roll < 0.7) {
    // Family 3: a single 4-key run, e.g. "fdsa".
    return [pick(RUNS)]
  }

  if (roll < 0.88) {
    // Family 4: paired hand groups — two adjacent visual groups,
    // e.g. "asdf" then "jkl;".
    return pick(PAIR_GROUPS)
  }

  // Mirrored alternating-hands drill split into two groups: e.g. "fjd" "ksa".
  return pick(MIRRORED_PAIRS)
}

/**
 * Generate practice groups until at least targetChars characters exist.
 * @param {number} [targetChars] Minimum number of characters to produce.
 * @returns {string[]} groups whose joined length is >= targetChars.
 */
export function generatePracticeGroups(targetChars = DEFAULT_TARGET_CHARS) {
  const groups = []
  let length = 0
  while (length < targetChars) {
    const chunk = generateChunkGroups()
    for (const group of chunk) {
      groups.push(group)
      length += group.length
    }
  }
  return groups
}

/**
 * Extend an existing sequence (used when a fast typist approaches the end
 * of the current text mid-session).
 * @param {number} [chars] How many additional characters to generate.
 * @returns {string[]} fresh groups to append.
 */
export function extendPracticeGroups(chars = EXTEND_CHARS) {
  return generatePracticeGroups(chars)
}
