# From a finished Beamer / PDF deck to an interactive deck

Start from something that already worked in a room. Building the HTML first tends to become messy; converting a stable Beamer deck keeps the argument and lets you spend the effort on figures and widgets.

## 1. Inventory the source

- List every frame: title, section, the text as written, formulas, figures (TikZ / images), overlays (`\pause`, `\only`), blocks (definition / theorem / example), citations. `grep -n 'frametitle\|\\section\|includegraphics\|pause' main.tex` is enough to start.
- Read the color macros. A deck with `\newcommand{\dcol}` / `\icol}` already has its two accents; keep the assignment, re-check the hues (colors-and-words.md).
- Note what the speaker changed between versions (git log, handwritten review PDFs). Those edits are the preferences to preserve.

## 2. Decide the structure with the speaker

Before writing markup, agree on:

- the two accents and what they mean;
- which figures become widgets (interactions.md), and which stay static;
- what is cut for the room: long definitions to the speaker's mouth, footnotes to nothing;
- navigation extras: QR on the title, corner QR on every slide, section covers;
- where the deck will live (a URL is needed before QR codes and before the "Slides" link on the event page).

These are taste decisions with several reasonable answers; a one-line question each is cheaper than a rebuild.

## 3. Map Beamer constructs

| Beamer | HTML |
|---|---|
| `\begin{frame}{Title}` | `<section class="slide" data-slide="n" data-id="short-id" data-section="Section title">` with `<h2>` |
| `\section` | `data-section` on each slide (drives the dot groups and the place label); optionally a cover slide |
| `\pause`, overlays | usually nothing (show all); `data-steps="2"` + `.s2` for question → answer only |
| `block` / `definition` / `theorem` | `<div class="block"><div class="bt">Definition (…)</div>…</div>` (left rule, no fill) |
| `columns` | `<div class="cols">` |
| `\dcol{x}` / `\icol{x}` | `<span class="a">x</span>` / `<span class="b">x</span>`; inside math, `\color{A}{x}` mapped to `var(--a)` by tex2svg |
| `$…$`, `\[…\]` | build-time SVG via `scripts/tex2svg.mjs`; wrap in `<span class="math">` / `<div class="formula">` |
| TikZ figure | redraw as inline SVG (preferred for anything a widget touches), or `pdftocairo -svg` a cropped page and replace colors with tokens |
| `\includegraphics` photo | local image, click to enlarge; large |
| `\footnote` | drop, or fold into the sentence |
| `\cite` | a link to the DOI / official page in place; a references slide at the end |
| `\note` | speaker notes are not part of the deck; keep them in the source |

## 4. Build

- Keep a build script (Node or Python) that assembles `site/index.html` from the template, a content file and the rendered formulas. Never hand-edit the built file.
- Formulas: collect every TeX string, render once with `tex2svg.mjs --macros --colors`, inline the SVG.
- Figures: one SVG per figure with a `viewBox`; labels via a small helper that adds halos; accents via tokens.
- Widgets: vanilla JS in the same file; state in JS, rendering in SVG/DOM; initial render equals the static figure.

## 5. Verify, then hand over

Follow qa.md. Then give the speaker a local preview URL and the list of slides changed; do not declare the talk ready. Publishing (a static host, a URL for the QR) is a separate, explicit step.
