import { TYPING_WINDOW } from '../utils/constants.js'
import '../styles/practice.css'

/**
 * The target sequence line. The sequence is a flat string of home-row
 * characters only; logical groups are rendered with a wider visual gap so
 * no space character is ever typed, shown, or highlighted.
 *
 * States: completed = muted, current = primary highlight, upcoming = normal.
 */
export default function TypingText({ sequence, groups, groupOffsets, position }) {
  const windowEnd = position + TYPING_WINDOW

  // First group that intersects the visible window.
  let startGroup = 0
  while (
    startGroup < groupOffsets.length - 1 &&
    groupOffsets[startGroup + 1] <= position
  ) {
    startGroup += 1
  }

  const visibleGroups = []
  for (let i = startGroup; i < groups.length; i += 1) {
    if (groupOffsets[i] >= windowEnd) break
    visibleGroups.push(i)
  }

  const nextKey = sequence[position] ?? sequence[0] ?? ''

  return (
    <div
      className="typing-text"
      role="img"
      aria-label={`Next key: ${nextKey}. Position ${position + 1} of ${sequence.length}.`}
    >
      <span className="typing-text__stream" aria-hidden="true">
        {visibleGroups.map((groupIndex) => {
          const groupStart = groupOffsets[groupIndex]
          const group = groups[groupIndex]
          const from = Math.max(groupStart, position - TYPING_WINDOW)
          const to = Math.min(groupStart + group.length, windowEnd)
          const chars = []
          for (let i = from; i < to; i += 1) {
            const char = sequence[i]
            let className = 'char'
            if (i < position) {
              className += i === position - 1 ? ' char--done char--last' : ' char--done'
            } else if (i === position) {
              className += ' char--current'
            } else {
              className += ' char--upcoming'
            }
            chars.push(
              <span key={i} className={className}>
                {char}
              </span>
            )
          }
          return (
            <span key={groupIndex} className="typing-text__group">
              {chars}
            </span>
          )
        })}
      </span>
    </div>
  )
}

/** Compact legend explaining the three character states. */
export function TypingLegend() {
  return (
    <div className="typing-legend" aria-hidden="true">
      <span className="typing-legend__item">
        <span className="typing-legend__chip typing-legend__chip--done" />
        typed
      </span>
      <span className="typing-legend__item">
        <span className="typing-legend__chip typing-legend__chip--current" />
        next
      </span>
      <span className="typing-legend__item">
        <span className="typing-legend__chip typing-legend__chip--upcoming" />
        upcoming
      </span>
    </div>
  )
}
