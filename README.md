# WordWeave

An accessible, bilingual (EN/DE) learning-game platform where games and the host app talk
through a typed `postMessage` bridge.

## Why

Learning games should adapt to the learner: font, spacing, language and pace. WordWeave is
built in the open, one small commit at a time, to explore how HTML5/JS game modules can be
embedded safely, configured for accessibility and shipped in English and German.

## What works today

- **Bridge:** a typed message protocol with runtime validation, origin checks and unit tests.
- **LetterLoop:** a playable word game (10 levels, scoring, stars, keyboard-friendly buttons).
- **Host app:** a React + TypeScript page that embeds the game in a sandboxed iframe and shows
  live progress (score, levels completed) from the game's messages.
- **CI:** lint, formatting, type check and tests run on every push.
- **Reading settings:** the host sends font, letter spacing, line height and reduced-motion settings to the game over the bridge (`SET_A11Y`), and the game applies them live.

## Architecture

- `packages/bridge`: typed protocol, validation and origin-checked send/listen helpers
- `games/letterloop`: HTML5/TypeScript game module that talks to the host only through the bridge
- `apps/host`: React shell that embeds games and shows progress

### Messages

| Direction    | Message          | Purpose                        |
| ------------ | ---------------- | ------------------------------ |
| Game to host | `GAME_READY`     | The game has loaded            |
| Game to host | `SCORE_UPDATE`   | Total score changed            |
| Game to host | `LEVEL_COMPLETE` | A level was finished           |
| Host to game | `SET_A11Y`       | Reading settings (works today) |
| Host to game | `SET_LANGUAGE`   | Language (EN or DE)            |
| Host to game | `SET_THEME`      | Colour theme (planned)         |

Every message travels in an envelope (`protocol`, `version`, `message`). The receiver checks
the sender's origin and window, then validates the message shape before acting on it. Anything
unknown or malformed is ignored.

## Run it locally

Requires Node 20 or newer. Run the game and the host in two terminals:

```bash
npm install
npm run dev -w games/letterloop   # http://localhost:5173
npm run dev -w apps/host          # http://localhost:5180
```

Open the host at http://localhost:5180.

```bash
npm test        # unit tests
npm run lint    # ESLint
```

## Roadmap

- [x] Monorepo setup, linting and formatting
- [x] Bridge: typed protocol, validation and tests
- [x] First game: LetterLoop (build a word from scrambled letters)
- [x] Host app: iframe embedding and progress panel
- [x] CI: lint and tests on every push
- [x] Host reading settings that control the game (font, spacing, line height, reduced motion)
- [x] Lighthouse accessibility audit on the game: score 100
- [x] Host language setting (EN/DE) that switches the game
- [x] i18n: EN/DE for the game's texts and word lists (the host panel is still English)
- [ ] Host setting for the colour theme
- [ ] Accessibility: a dedicated dyslexia-friendly font file and colour themes
- [ ] Word lists by difficulty (EN/DE) and an endless mode
- [ ] Touch & Say: tap a body part, hear its name in EN/DE, with an illustrated character
- [ ] More games: SoundMatch, SyllableSnap
- [ ] Accessibility audit with axe and a WCAG checklist
