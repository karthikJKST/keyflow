import ThemeToggle from './ThemeToggle.jsx'
import SoundToggle from './SoundToggle.jsx'
import '../styles/layout.css'

/**
 * Original KeyFlow brand symbol: eight dots — the home-row keys — rising
 * left to right to suggest typing progression; the F and J dots are
 * accent-coloured like the homing bumps on a physical keyboard.
 */
function BrandSymbol() {
  const xs = [2.5, 6.5, 10.5, 14.5, 21.5, 25.5, 29.5, 33.5]
  const ys = [13, 11.6, 10.2, 8.8, 7.4, 6, 4.6, 3.2]
  return (
    <svg className="brand__symbol" viewBox="0 0 36 16" aria-hidden="true">
      {xs.map((x, i) => (
        <circle
          key={x}
          cx={x}
          cy={ys[i]}
          r={i === 3 || i === 4 ? 2 : 1.7}
          className={i === 3 || i === 4 ? 'brand__dot brand__dot--accent' : 'brand__dot'}
        />
      ))}
    </svg>
  )
}

/** Persistent app header with brand, sound toggle and theme toggle. */
export default function Header({ onHome }) {
  return (
    <header className="app-header">
      <button
        type="button"
        className="brand"
        onClick={onHome}
        aria-label="KeyFlow home"
      >
        <BrandSymbol />
        <span className="brand-name">KEYFLOW</span>
      </button>

      <div className="header-actions">
        <SoundToggle />
        <ThemeToggle />
        <nav className="header-nav" aria-label="Primary">
          <a
            className="header-link"
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
          >
            About
          </a>
        </nav>
      </div>
    </header>
  )
}
