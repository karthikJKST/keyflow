/**
 * KeyFlow feedback sounds — a tiny Web Audio helper with zero dependencies.
 *
 * Sounds only ever play in response to the user's own keystrokes (never on
 * page load), and the whole feature can be switched off from the header
 * toggle. If Web Audio is unavailable every call is a silent no-op.
 */

let audioContext = null
let enabled = true

function getContext() {
  if (typeof window === 'undefined') return null
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return null
  try {
    if (!audioContext) audioContext = new Ctx()
    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {})
    }
    return audioContext
  } catch {
    return null
  }
}

/** Enable or disable feedback audio (persisted preference lives in the UI). */
export function setSoundEnabled(value) {
  enabled = Boolean(value)
}

function blip({ frequency, endFrequency, duration, volume, type }) {
  if (!enabled) return
  const ctx = getContext()
  if (!ctx) return
  try {
    const start = ctx.currentTime
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, start)
    if (endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration)
    }

    // Short attack + quick exponential fade keeps clicks soft and brief.
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)

    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.start(start)
    oscillator.stop(start + duration + 0.02)
    oscillator.onended = () => {
      oscillator.disconnect()
      gain.disconnect()
    }
  } catch {
    /* audio is a nice-to-have — never let it break typing */
  }
}

/** Soft, short click for a correct key. */
export function playCorrectSound() {
  blip({ frequency: 680, duration: 0.05, volume: 0.04, type: 'sine' })
}

/** Low, subdued blip for an incorrect key. */
export function playIncorrectSound() {
  blip({
    frequency: 220,
    endFrequency: 165,
    duration: 0.13,
    volume: 0.05,
    type: 'triangle',
  })
}
