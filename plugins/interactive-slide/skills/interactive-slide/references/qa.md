# Verification

A deck is checked on screens, not in the source. Do the whole list for a new deck or a change to shared CSS/JS; for a one-slide edit, check that slide at three widths and rerun the overlap script.

## Automated (`scripts/qa-deck.cjs`)

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory site &
DECK_URL=http://127.0.0.1:8000/ node scripts/qa-deck.cjs --shots qa/shots --report qa/report.json
```

Per slide and viewport (375×812, 1440×900, 2000×1000, 3440×1440, 1440×900 dark):

- no page errors, no `console.error`
- no request leaving the deck's origin (offline guarantee; CDN fonts and scripts fail this)
- no horizontal overflow; no vertical overflow on desktop sizes
- content uses ≥ 60% of the height and ≥ 70% of the width on desktop sizes (see layout-and-navigation.md; if one slide fails, fix the shared sizes, not that slide)
- no figure label touching a line, a fill or another label (`svg-label-overlap.cjs`)
- keyboard, hash deep link and edge click navigation work

Needs Playwright (`npm i -D playwright && npx playwright install chromium`, or `PLAYWRIGHT_MODULE=/path/to/node_modules/playwright`).

## By eye (the screenshots from `--shots`)

- Line breaks in headings: no single word or two characters dropped to a new line (wrap-control spans `.w`).
- Figures read at 375px; nothing important is below the fold that a phone user would not scroll to.
- Dark mode: every figure, formula and photo border follows the palette; nothing is black on black.
- Each widget: default state is meaningful; presets and reset work; readouts do not shift the layout; keys inside the widget do not change the slide; it stops when you leave the slide.
- Every link opens the intended page.

## Content

- Every sentence on a slide comes from the speaker's material; diff the text against the source if in doubt.
- Mathematical statements unchanged from the source unless the speaker asked.
- Attribution present for every third-party image; nothing embedded that cannot be redistributed with the deck.

## Report

State what was checked and at which sizes, the QA numbers (min usage per viewport, overlaps, errors), and what was not checked (real projector, a specific phone). Local completion and publication are different states; say which one you reached.
