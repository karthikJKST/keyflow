# KeyFlow

**Build muscle memory. One key at a time.**

## Overview

KeyFlow is a focused touch-typing trainer designed to help beginners practice
the eight home-row keys: **A S D F J K L ;**

The core idea is simple: muscle memory comes from repetition with immediate
feedback. In every session the application highlights the next key to press,
shows where that key lives on the keyboard and which finger owns it, and
responds to every keystroke instantly — so learners can keep their eyes on the
target and their hands on the home row while the pattern becomes automatic.

Sessions are short and deliberate: a single five-minute practice window, one
lesson, no distractions.

## Features

- 5-minute focused practice sessions
- Home-row practice limited to `A S D F J K L ;`
- Real-time next-key guidance with the owning finger (e.g. *Right Middle Finger*)
- Visual keyboard with live highlighting of the expected key
- Finger placement guidance for both hands
- Correct/incorrect key tracking with instant visual feedback
- Accuracy calculation, live during the session
- Keys-pressed tracking
- CPM (characters per minute) as a secondary metric
- Session progress bar
- End-session flow with a confirmation dialog
- Results screen with an accuracy ring and real session counters
- Practice Again with a fresh practice sequence
- Light and dark theme with a compact header toggle
- Theme persistence (`localStorage`, with system `prefers-color-scheme` fallback)
- Optional keystroke feedback sounds with an on/off toggle
- Recent session history stored locally and shown on the start screen
- Responsive layout for desktop, tablet and mobile (down to 320 px)

## Why KeyFlow?

A beginner learning touch typing should not have to guess:

- **which key to press next** — the target character is always highlighted
- **where the key is located** — the visual keyboard lights it up
- **which finger should be used** — the prompt names the finger directly
- **whether they made a mistake** — feedback is immediate and non-blocking

KeyFlow combines:

> Next-key guidance **+** visual keyboard **+** finger guidance **+**
> immediate feedback **+** performance metrics

into one focused practice experience, so the learner can stay in the flow of
practice instead of stopping to interpret the interface.

## User Flow

1. Open KeyFlow
2. Review the home-row keys and finger placement
3. Start a 5-minute practice session
4. Observe the highlighted target key
5. Type the highlighted key
6. Receive immediate feedback
7. Monitor time, keys, accuracy and CPM
8. Complete or end the session
9. Review results
10. Practice again if desired

## Supported Keys

```
A  S  D  F      J  K  L  ;
```

These eight keys are the **only** practice characters in the current lesson.
Off-row letters are gently pointed out and never counted; control keys
(Shift, Enter, Backspace, arrows…) are ignored entirely.

The wider spacing you see between groups in the typing sequence is **visual
only**. It exists for readability — it is not a character, it is never
highlighted as a target, and Space is never required or counted.

## Accuracy Calculation

```
accuracy = (correct valid key presses / total valid key presses) × 100
```

- Only supported home-row key presses count as valid attempts.
- Unsupported letters, punctuation, Space and control keys are **not** counted
  as typing attempts — they neither raise nor lower accuracy.
- `total valid key presses = correct + incorrect`
- If no valid key has been pressed yet, accuracy defaults to **100%**
  (nothing has been attempted, so nothing is wrong).
- The result is rounded to one decimal place (e.g. `96.4%`).

Implemented in `computeAccuracy()` in `src/utils/typingMetrics.js`.

## CPM Calculation

```
CPM = valid keys typed / elapsed practice minutes
```

- CPM uses the **actual elapsed** session time, not the nominal 5 minutes, so
  ending a session early still produces an honest rate.
- Until 10 seconds of session time have elapsed, the interface displays `—`
  instead of an early, misleading number.
- CPM is shown as a secondary metric during practice and on the results
  screen, where it is computed from the real practiced duration.

Implemented in `computeCpm()` in `src/utils/typingMetrics.js`. No WPM metric
is currently implemented.

## Timer

- Sessions are built around a **5-minute practice window**.
- The countdown starts at **05:00** and the session ends when it reaches
  **00:00**, at which point input stops and the results screen appears.
- Timing is based on **elapsed timestamps** (`Date.now()`): each tick
  recomputes the remaining time from the wall clock rather than decrementing
  a counter, so background-tab throttling cannot make the timer drift.
- The remaining value is clamped at zero — the timer can never go negative.
- The interval lives inside a `useEffect` with proper cleanup, so only a
  single timer can ever be active and none survive unmount.

Implemented in `src/hooks/useTimer.js`.

## Technology Stack

- **React 18** — function components and Hooks only
- **JavaScript (ES6+)**
- **Vite 5** — development server and production bundler
- **CSS3** — custom properties, flexbox, grid, keyframe animations
- **Browser APIs**: `localStorage` (theme, sound preference, session history),
  `matchMedia` (system color-scheme detection), Web Audio API (keystroke
  feedback sounds)

No TypeScript, no Redux, and no third-party UI, state-management or animation
libraries — the application's only runtime dependencies are `react` and
`react-dom`.

## Project Structure

```
keyflow/
├── index.html               # document shell + pre-paint theme bootstrap
├── vite.config.js
├── package.json
├── public/
│   └── favicon.svg          # KeyFlow brand mark
└── src/
    ├── main.jsx             # entry point, imports global styles
    ├── App.jsx              # screen orchestration + session history persistence
    ├── components/
    │   ├── Header.jsx           # brand symbol, sound & theme toggles
    │   ├── ThemeToggle.jsx      # light/dark toggle (persisted)
    │   ├── SoundToggle.jsx      # feedback-sound toggle (persisted)
    │   ├── StartScreen.jsx      # ready screen
    │   ├── PracticeArea.jsx     # practice screen (composition root)
    │   ├── TypingText.jsx       # grouped sequence + current-key highlight
    │   ├── TypingInput.jsx      # keystroke capture
    │   ├── VirtualKeyboard.jsx  # 8-key visual keyboard
    │   ├── KeyboardKey.jsx      # single key cap
    │   ├── Timer.jsx            # countdown cell
    │   ├── Stats.jsx            # KEYS · ACCURACY · CPM row
    │   ├── FingerGuide.jsx      # finger placement guide
    │   ├── ResultScreen.jsx     # results screen
    │   └── ConfirmDialog.jsx    # end-session confirmation
    ├── hooks/
    │   ├── useTypingSession.js  # session state + typing validation
    │   └── useTimer.js          # timestamp-based countdown
    ├── utils/
    │   ├── constants.js       # keys, durations, finger map, storage keys
    │   ├── textGenerator.js   # practice sequence generator
    │   ├── typingMetrics.js   # classification, accuracy, CPM, time formats
    │   ├── sound.js           # Web Audio feedback sounds
    │   └── sessionHistory.js  # localStorage session history
    └── styles/
        ├── global.css         # design tokens (light/dark), reset, buttons
        ├── layout.css         # app shell, header, start screen
        ├── practice.css       # practice screen
        ├── keyboard.css       # visual keyboard
        └── results.css        # results screen + dialog
```

## Architecture

- **Component structure** — `App.jsx` is deliberately thin: it renders exactly
  one of three screens (`StartScreen`, `PracticeArea`, `ResultScreen`) based on
  the session phase, plus the shared `Header` and the end-session dialog. All
  components are presentational and receive plain props.

- **Session state** — a single custom hook, `useTypingSession`, owns the
  whole session: the generated practice groups, the current position, the
  correct/incorrect counters, the transient feedback and the phase. The flat
  sequence is derived from the groups with `useMemo`, and the visible window
  of text is derived again for rendering, so keystrokes stay cheap.

- **Timer handling** — `useTimer` stores a start timestamp and recomputes
  remaining time from the wall clock. It exposes `start`, `stop`, the
  remaining/elapsed seconds and a one-shot completion callback.

- **Typing validation** — every captured keystroke is classified
  (`supported` / off-row `letter` / `control` / `other`) in
  `typingMetrics.js`. Supported keys are compared with the expected character;
  both outcomes advance the cursor. Unsupported keys never touch the counters.

- **Practice sequence generation** — `textGenerator.js` builds an array of
  short groups from four pattern families (single keys, digraphs, 4-key runs,
  mirrored hand drills). The sequence contains only practice characters, and
  it automatically extends when the typist approaches its end, so a session
  can never run out of text.

- **Statistics calculation** — accuracy and CPM are pure functions in
  `typingMetrics.js`, computed from the live counters and elapsed time.

- **Theme management** — an inline script in `index.html` sets the
  `data-theme` attribute before first paint (saved preference first, system
  color scheme otherwise). `ThemeToggle` then keeps the attribute and
  `localStorage` in sync. All colors flow from CSS custom properties, so both
  themes share one stylesheet.

## Design Decisions

### Focused learning

The application intentionally focuses on the eight home-row keys rather than
introducing the full keyboard immediately. Beginners build a reliable foundation
first; additional lessons can come later.

### Visual reinforcement

The target key is represented twice — highlighted inside the typing sequence
and lit up on the visual keyboard — so learners can connect the character they
see with the physical key they are reaching for without breaking posture.

### Immediate feedback

Correct and incorrect inputs are reflected immediately: the prompt key flashes
green or red, counters update on the same keystroke, and a mistake never stops
or rewinds the session — the learner just keeps typing.

### No Space requirement

Spacing between groups is purely visual. The data model contains only
practice characters, so Space is never a target, never counted and never able
to produce an error.

### Simple state management

React Hooks are used because the application's state is local to a single
typing session and does not require a global state-management solution. One
custom hook holds the session; header preferences (theme, sound) are owned by
their small toggle components. Redux would add indirection without benefit.

## Responsive Design

The interface is designed for desktop, tablet and mobile:

- The layout works down to **320 px** without horizontal scrolling.
- Statistics move from a four-column row to a two-column grid on narrow
  screens while keeping labels readable.
- Keyboard key caps shrink with viewport width so the full home row always
  fits on screen.
- The finger guide collapses from two columns to one.
- The header hides its secondary link and keeps the sound/theme toggles
  reachable on small screens.
- Buttons remain comfortably tappable on touch devices.

## Accessibility

- All interactive controls are semantic `<button>` elements with visible
  focus states (`:focus-visible`).
- The practice flow is fully keyboard-usable; the confirmation dialog moves
  focus to its safe action, supports `Escape` to dismiss, and typing resumes
  automatically afterwards.
- Labels and live regions: `aria-label`s on the typing field and brand,
  `role="timer"` on the countdown, `role="status"` for the off-row hint, an
  accessible label on the typing sequence announcing the next key, and
  screen-reader-only text mirroring the visible statistics.
- Colors were chosen for readable contrast in both light and dark themes, and
  states are never conveyed by color alone (symbols such as ✓/✕ accompany
  them).
- `prefers-reduced-motion` is respected: animations and transitions are
  neutralized for users who request it.

## Getting Started

Requires **Node.js 18+** and npm.

```bash
npm install
npm run dev
```

The development server starts on `http://localhost:5173`. Typing works
immediately after pressing **Start Practice** — no extra clicking required.

## Production Build

```bash
npm run build
```

This produces a production-ready static frontend in the `dist/` folder
(minified, hashed asset filenames, relative asset paths). To verify the build
locally:

```bash
npm run preview
```

## Deployment

The build is a fully static site and deploys to any static host.

**Vercel**

1. Import the repository and select the Vite framework preset.
2. Build command: `npm run build` — output directory: `dist`.
3. Deploy.

**GitHub Pages**

`vite.config.js` sets `base: './'`, so the same build works from a project
subpath. Publish the contents of `dist/` to a `gh-pages` branch (for example
with the `gh-pages` npm package or a GitHub Actions workflow).

## Screenshots

<!-- Add application screenshots here -->
<!-- Suggested: start screen, practice screen (light), practice screen (dark), results screen -->

## Future Improvements

Future ideas — **not currently implemented**:

- Additional typing lessons (top row, bottom row, numbers)
- Progressive difficulty
- Personalized weak-key practice
- Richer session history and trends
- Keyboard heatmap of frequent mistakes
- Daily practice goals
- Additional keyboard layouts (e.g. Dvorak, Colemak)

## License

No license has been specified for this repository yet.
