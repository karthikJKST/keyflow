import { HOME_ROW_KEYS } from '../utils/constants.js'
import '../styles/layout.css'

/** Small keyboard preview used on the start screen. */
function KeyPreview() {
  return (
    <div className="key-preview" aria-hidden="true">
      {HOME_ROW_KEYS.map((k) => (
        <span key={k} className="key-preview__key">
          {k}
        </span>
      ))}
    </div>
  )
}

const LEFT_HAND = [
  ['A', 'Pinky'],
  ['S', 'Ring'],
  ['D', 'Middle'],
  ['F', 'Index'],
]
const RIGHT_HAND = [
  ['J', 'Index'],
  ['K', 'Middle'],
  ['L', 'Ring'],
  [';', 'Pinky'],
]

function FingerList({ title, rows }) {
  return (
    <div className="start-fingers__col">
      <h3 className="start-fingers__title">{title}</h3>
      <ul className="start-fingers__list">
        {rows.map(([key, finger]) => (
          <li key={key}>
            <span className="start-fingers__key">{key}</span>
            <span className="start-fingers__arrow" aria-hidden="true">→</span>
            <span>{finger}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Landing screen: brand, pitch, key preview and primary CTA. */
export default function StartScreen({ onStart, history }) {
  return (
    <main className="start" aria-labelledby="start-title">
      <section className="start__hero card">
        <p className="start__eyebrow">Home-row touch-typing trainer</p>
        <h1 id="start-title" className="start__title">
          Build muscle memory.<br />
          One key at a time.
        </h1>
        <p className="start__lede">
          Practice the home row and build touch-typing muscle memory.
        </p>

        <KeyPreview />

        <p className="start__meta">5 minute focused practice</p>

        <button type="button" className="btn btn--primary btn--xl" onClick={onStart}>
          Start Practice
        </button>
      </section>

      <section className="start__grid">
        <div className="card start-fingers">
          <h2 className="card-title">Finger placement</h2>
          <p className="start-fingers__hint">
            Rest your fingers on the middle row — the “home row”. Each finger
            owns exactly one key.
          </p>
          <div className="start-fingers__cols">
            <FingerList title="Left hand" rows={LEFT_HAND} />
            <FingerList title="Right hand" rows={RIGHT_HAND} />
          </div>
        </div>

        <div className="card start-how">
          <h2 className="card-title">How a session works</h2>
          <ol className="start-how__list">
            <li>
              <strong>Watch the highlighted key</strong> — the next character is
              always called out in the text line and on the keyboard below.
            </li>
            <li>
              <strong>Type without looking down</strong> — mistakes count but
              never stop the session; just keep going.
            </li>
            <li>
              <strong>Track your accuracy live</strong> — time, keys and
              accuracy update as you type.
            </li>
          </ol>
        </div>
      </section>

      {history.length > 0 && (
        <section className="card start-history" aria-label="Recent practice">
          <h2 className="card-title">Recent practice</h2>
          <ul className="history-list">
            {history.slice(0, 3).map((s) => (
              <li key={s.id} className="history-item">
                <span className="history-item__date">
                  {new Date(s.finishedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span>{s.keys} keys</span>
                <span className="history-item__acc">{s.accuracy}% accuracy</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
