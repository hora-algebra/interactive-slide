# Changelog

## 0.1.1 — 2026-09-26

- template: the top navigation never moves. The bar is a three-column grid (section | dots | `n / N`); on phones it is two columns and the page count has a fixed width. `qa-deck.cjs` checks this (`nav-stable`, `nav-clash`)
- template: inline math sits on the text baseline (MathJax's own `vertical-align` is no longer overridden by flex centring)
- template: size rules for `.math` and `.fig` apply only to the outer `<svg>`, so MathJax's nested SVGs (stretchy braces, figure labels) keep their size

## 0.1.0 — 2026-09-18

First public version. Extracted from the private skills used to build the September 2026 talks
(category-theory night, math café) and rewritten to be independent of language, agent, author and host:

- SKILL.md with the workflow, the non-negotiables and their reasons
- deck template (tokens, top-dot navigation with section label, stage unit and per-slide fit, dark mode, print, widget guard)
- references: colors and words, interactions, layout and navigation, workflow from Beamer, QA
- scripts: tex2svg, qr-svg, cvd-check, svg-label-overlap, qa-deck
- examples: the two decks as presented
