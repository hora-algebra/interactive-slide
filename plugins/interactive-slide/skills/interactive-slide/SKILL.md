---
name: interactive-slide
description: Turn a finished talk (Beamer/LaTeX source, PDF slides, or a written outline) into a single-file interactive HTML slide deck with two semantic accent colors mapped to the talk's central dichotomy, playable SVG figures, build-time math, a screen-filling layout, and phone/offline support. Use whenever someone wants HTML or web slides, interactive or playable slides, a Beamer/PowerPoint/PDF deck converted to HTML, a widget or interactive figure added to a talk, or an existing HTML deck's layout, colors, navigation or QA fixed, even if they never say "interactive".
license: MIT
metadata:
  author: Ryuya Hora (hora-algebra)
  version: "0.1.0"
  homepage: https://github.com/hora-algebra/interactive-slide
---

# interactive-slide

Make a talk into one HTML file the audience can hold in their hands: it fills any screen, works offline, and lets people play with the figures. The method was developed for mathematics outreach talks (a category-theory bar night, a math café for high-school students) and generalizes to any talk with a central contrast and a few objects worth touching.

Three ideas do most of the work, and the rest of this skill exists to protect them:

1. **One dichotomy, two colors.** An audience remembers one contrast. Assign the talk's central pair of concepts to exactly two accent colors, use them for nothing else, and check the pair for color-vision deficiency.
2. **The speaker's words only.** Every sentence on a slide comes from the speaker's own material. You convert, cut, and arrange; you do not write.
3. **Figures you can play.** A few interactive SVG figures with a precise mathematical readout, placed where the speaker would say "try it".

## Workflow

Read the reference file named at each step when you reach it; they are short and hold the details and the reasons.

**0. Settle taste with the speaker before building.** Layout, colors, which figures become widgets, and where the deck will be published are decisions with several reasonable answers and a strong owner preference. Ask them in one short round (each with a recommended default), then do not ask again:
- the two concepts and their colors (propose a pair that passes `scripts/cvd-check.py`);
- which 2–4 figures become playable (see `references/interactions.md`);
- what is cut for the room (definitions to speech, footnotes to nothing);
- QR on the title / corner QR on every slide / neither, and the target URL;
- audience and device: projector only, or phones in hand.

**1. Inventory the source.** Frames, text, formulas, figures, overlays, color macros, citations, and the speaker's own edits between versions. `references/workflow-from-beamer.md` has the mapping table from Beamer constructs to markup. A written outline or a PDF is handled the same way: list the slides and their exact text first.

**2. Start from `assets/deck-template.html`.** It already contains the navigation (top dots grouped by section, place label, counter, edge zones, keys, swipe, hash deep links), the stage unit and per-slide screen fit, dark mode, print, reduced motion, and the widget guard. Rename the two accent tokens to their semantic meaning and keep the machinery below the slides intact. Do not start from a blank file or a framework.

**3. Put the text in.** Copy, do not compose. Cut what the speaker said is spoken. Delete per-slide names, dates and source lines. Give same-kind slides the same skeleton. `references/colors-and-words.md`.

**4. Figures and widgets.** Inline SVG with `viewBox`, accent tokens, label halos. Widgets are vanilla JS in the same file; the default state is the complete static figure; nothing moves except what the user changes; presets and reset; `data-widget` on the root; stop on `deck:change`. `references/interactions.md`.

**5. Build-time assets.** TeX → SVG with `scripts/tex2svg.mjs` (macros and `\color` names mapped to CSS variables). QR → inline SVG with `scripts/qr-svg.py`, only once the URL is final. Keep a build script; never hand-edit the built file. Layout sizes follow the stage unit table in `references/layout-and-navigation.md`.

**6. Verify on screens.** Serve the folder, run `scripts/qa-deck.cjs` (errors, offline, overflow, screen usage, label overlap, navigation at five viewports), look at the screenshots, and check every widget by hand. `references/qa.md` lists what counts as done and what to report.

**7. Hand over.** Give a local preview and the list of what changed. Publishing to a static host, generating the QR for the final URL, and announcing are separate steps that the speaker triggers; the deck being finished locally does not mean it is public.

## Non-negotiables, and why

- **Single self-contained file, no network at runtime.** Venue Wi-Fi fails; the deck must open from disk. TeX is rendered at build time; fonts are the system's.
- **Two accents, by meaning.** A third color or a decorative accent destroys the one thing the audience will remember. UI chrome stays in gray.
- **No invented prose.** The speaker's credibility is in their words; a plausible sentence you added is the one they will be asked about.
- **Fill the screen, at every screen.** Stage unit `--u` and per-slide `--fit`; verify at 375, 1440, 2000 and 3440 px wide.
- **Minimal chrome, position always visible.** Top dots + section name + `n / N`. No sidebars, no bottom toolbars, no progress bars, no reveals by default.
- **Layout stability.** Buttons and readouts never move when clicked. Reserve space for the largest state.
- **Verified on screens, structurally fixed.** A failing slide means a shared size or rule is wrong; fix the rule.

## Small edits to an existing deck

Keep its conventions: the same tokens, the same navigation, the same build. Change the slide asked for, then re-check that slide at three widths and rerun the overlap script. Do not migrate a working deck to this template unless asked.

## Files

| path | use |
|---|---|
| `assets/deck-template.html` | starting point for every new deck (CSS tokens, navigation, fit, print, widget guard) |
| `references/workflow-from-beamer.md` | inventory and the Beamer → HTML mapping table |
| `references/colors-and-words.md` | two accents, CVD check, the speaker's words, links |
| `references/interactions.md` | which figures to make playable and the widget design rules |
| `references/layout-and-navigation.md` | stage unit, fit, sizes table, dots/keys/swipe/hash, QR, dark, print |
| `references/qa.md` | what to check, how, what to report |
| `scripts/tex2svg.mjs` | TeX → inline SVG at build time (needs `mathjax-full`) |
| `scripts/qr-svg.py` | URL → inline SVG QR (needs `segno`) |
| `scripts/cvd-check.py` | accent pair check under color-vision deficiency and WCAG contrast |
| `scripts/svg-label-overlap.cjs` | figure text vs lines/fills/labels collision check (Playwright) |
| `scripts/qa-deck.cjs` | full headless verification at five viewports (Playwright) |

Worked examples (two full decks used in real talks, with their build notes) live in the repository: https://github.com/hora-algebra/interactive-slide/tree/main/examples
