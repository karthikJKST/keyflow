import { useEffect, useRef } from 'react'

/**
 * Hidden but focused input that captures keystrokes during practice.
 *
 * A real <input> is used (instead of a raw window keydown listener) so
 * mobile keyboards open, screen readers get a text field, and browser
 * shortcuts keep working. Evaluation happens ONLY in onChange (the single
 * source of inserted characters) — onKeyDown is used solely to neutralise
 * keys we never want reaching the field (Backspace/Tab/Enter). The value is
 * wiped after every evaluation, so already-judged characters can never be
 * edited and Backspace cannot undo mistakes.
 */
export default function TypingInput({ onKey, disabled }) {
  const inputRef = useRef(null)

  // Focus once when the practice phase mounts; typing starts immediately.
  useEffect(() => {
    if (!disabled) inputRef.current?.focus()
  }, [disabled])

  const handleChange = (event) => {
    const { value } = event.target
    // Evaluate every character the keyboard inserted, then wipe the field.
    for (const char of value) onKey(char)
    event.target.value = ''
  }

  const handleBlur = (event) => {
    if (disabled) return
    // Don't fight other interactive elements (e.g. the End Session dialog)
    // for focus — only reclaim focus when nothing else was chosen.
    const next = event.relatedTarget
    if (next && typeof next.closest === 'function' && next.closest('button, a, [role="dialog"]')) {
      return
    }
    window.setTimeout(() => {
      const active = document.activeElement
      const busy =
        active &&
        (active.tagName === 'BUTTON' ||
          active.tagName === 'A' ||
          active.closest?.('[role="dialog"]'))
      if (!busy) inputRef.current?.focus()
    }, 0)
  }

  return (
    <div className="typing-input">
      <input
        ref={inputRef}
        type="text"
        className="typing-input__field"
        aria-label="Typing area — type the highlighted home-row key"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        disabled={disabled}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={(event) => {
          const { key } = event
          // Never let editing/navigation keys reach the field: no undoing
          // evaluated input, no form submission, no focus traversal.
          if (key === 'Backspace' || key === 'Enter' || key === 'Tab') {
            event.preventDefault()
          }
        }}
      />
      <div className="typing-input__hint" aria-live="polite">
        Type the highlighted key — every press counts instantly.
      </div>
    </div>
  )
}
