# Layout and navigation

The deck is one HTML file that fills whatever screen it is on, and the audience always knows where they are.

## Fill the screen: stage unit and per-slide fit

Fixed pixel sizes and `clamp()` upper bounds leave a 2000px projector with the content in the middle third. Use the stage unit instead:

```css
:root{--u0:min(1vw,1.7778vh);--fit:1;--u:calc(var(--u0)*var(--fit))}
.slide{--u:calc(var(--u0)*var(--fit))}
```

`--u0` is 1/100 of the width of the largest 16:9 stage that fits the screen (height 56.25 u0). Write every size as a multiple of `--u` with a floor for phones:

| element | size |
|---|---|
| h2 | `max(1.4rem, calc(var(--u)*4.2))`, line-height 1.3 |
| body | `max(1rem, calc(var(--u)*2.1))`, line-height 1.55 |
| formula | `max(1rem, calc(var(--u)*2.6))` |
| conclusion line | `max(1.1rem, calc(var(--u)*2.8))` |
| figure height | up to `calc(var(--u)*36)` (a heading, a figure and a two-line conclusion then fill 56 u) |
| column width | `min(100%, calc(var(--u0)*120))` (does not shrink with fit) |
| paddings | multiples of `--u0`, not `--u` (they should not scale with fit) |

The template's `fitSlide()` measures the content of the current slide on load and on resize and sets `--fit` (0.7–1.75) so a sparse slide grows and a dense one shrinks until nothing overflows. It runs only on load/resize, never on a click inside the slide, so widgets do not make the page jump. Below 650px width the fit is 1 and the slide scrolls internally.

Check at least 375×812, 1440×900, 2000×1000 and 3440×1440, light and dark. `scripts/qa-deck.cjs` measures the fraction of the viewport used by each slide and fails below 60% height / 70% width on desktop sizes.

## Layout stability

Anything the audience clicks must not move. Reserve space for the largest state of a widget (stack states in the same grid cell, fix the height of readouts, keep buttons in a fixed row). Reading a number that jumps around, or chasing a button that moves after each click, was the single most repeated complaint in practice.

## Navigation: minimal chrome, position always visible

- A row of small dots at the top, one per slide, grouped by section, with the current section name on the left and `n / N` on the right. That is the whole UI. Sidebars, bottom toolbars and progress bars compete with the slide.
- Invisible edge zones (left/right 3% of the screen) advance on click; ← → Space PageUp/Down Home/End on the keyboard; horizontal swipe on touch; `#12` and `#some-id` deep links (the hash is updated as you move, so a URL copied mid-talk opens that slide).
- Keys and swipes are ignored inside `input, button, a, select, textarea, [data-widget]`, so a widget can use arrow keys and drags without changing the slide.
- No step-by-step reveals by default. A `\pause` in Beamer is usually a speaker's crutch; the HTML slide shows everything and the speaker points. Use `data-steps="2"` only for an explicit question → answer beat.
- Section cover slides carry the section title and a figure, nothing else.

## QR codes and links

A QR on the title slide (and, for an audience with phones in hand, a small one in a corner of every slide) lets people open the deck on their own device and play with the widgets during a break. Generate it with `scripts/qr-svg.py` only after the final URL is known, keep it black-on-white, and do not tint it.

## Dark mode, print, motion

- `color-scheme: light dark` with both palettes; figures use `currentColor`, `var(--bg)` and the accent tokens so they follow.
- `@media print` lays the slides out one per page; hidden slides become visible.
- `prefers-reduced-motion` disables transitions and autoplay; every animation has a static final state.

## Files

One `index.html`, inline CSS and JS, SVG figures inline, images as local files next to it (or data URIs if the deck must be a single file). No CDN, no web fonts, no runtime math library: TeX is rendered to SVG at build time (`scripts/tex2svg.mjs`). Opening the file from disk must work.
