# WordWeave

An accessible, bilingual (EN/DE) learning-game platform where games and the host app talk
through a typed `postMessage` bridge.

## Why

Learning games should adapt to the learner: font, spacing, language and pace. WordWeave is
built in the open, one small commit at a time, to explore how HTML5/JS game modules can be
embedded safely, configured for accessibility and shipped in English and German.

## Architecture

- `packages/bridge`: typed message protocol with origin and message validation
- `games/*`: HTML5/JS learning-game modules that talk to the host only through the bridge
- `apps/host`: React + TypeScript shell that embeds games and shows progress and settings

## Roadmap

- [x] Monorepo setup, linting and formatting
- [x] Bridge: typed protocol, validation and tests
- [x] First game: LetterLoop (build a word from scrambled letters)
- [ ] Host app: iframe embedding and progress panel
- [x] CI: lint and tests on every push
- [ ] Accessibility: keyboard control, dyslexia-friendly font, spacing, themes, reduced motion
- [ ] i18n: EN/DE for UI text and word lists
- [ ] Touch & Say: tap a body part, hear its name in EN/DE, with an illustrated character with selectable skin tone
- [ ] More games: SoundMatch, SyllableSnap
- [ ] Accessibility audit with axe and a WCAG checklist

## Development

```bash
npm install
npm run lint
```
