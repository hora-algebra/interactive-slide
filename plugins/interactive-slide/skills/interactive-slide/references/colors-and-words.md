# Colors and words

Two rules carry most of the effect of an interactive deck: color means one thing, and the words are the speaker's own.

## Exactly two accent colors, tied to the talk's central dichotomy

An outreach audience cannot take home a theory. It can take home one contrast: play forward vs analyze backward, operation vs invariant, discrete vs continuous, differentiation vs integration. Put that contrast in the two accent colors and keep it consistent from the title to the last slide, in prose, formulas, figures and widgets.

- Name the tokens after the meaning, not the hue: `--play` / `--analyze`, not `--green` / `--orange`. Define them once as aliases of `--a` / `--b` in the template and use only the aliases.
- Everything that is neither side stays in ink and gray. A functor between the two sides is black. A third concept does not get a third color; it gets a shape, a label, or a position.
- Do not use an accent for decoration, emphasis or UI chrome. If a button or a heading is blue, the audience will read it as "the play side". Emphasis is weight, size or a box.
- Formulas follow the same tokens: convert `\color{A}{...}` to `fill:var(--a)` at build time (`scripts/tex2svg.mjs --colors`). A formula whose `∂` is not the differentiation color contradicts the slide it sits on.
- Dark mode lightens the accents (they must read on a dark paper) but keeps the assignment.

### Check the pair for color vision deficiency

About 1 in 12 men cannot rely on a red/green or green/orange contrast. Run `scripts/cvd-check.py A B --dark A' B'` before committing to a pair: it simulates protanopia, deuteranopia and tritanopia and requires ΔE ≥ 40 in each, plus contrast ≥ 3 on both papers. Blue/orange and teal/orange pass comfortably; green/orange typically fails for protanopia. Redundant coding helps too: the two sides can also differ in arrow direction, position (left/right, up/down) or line style.

## The words are the speaker's

- Take the text from what the speaker already wrote or said: the Beamer source, the abstract, notes, transcripts of past talks. Copying a sentence is better than paraphrasing it. A sanity check used in practice: every fragment of 5+ characters in the deck should occur in the source material.
- Do not invent explanatory prose, captions, jokes, summaries or "friendly" transitions. If a slide seems to need a sentence that does not exist, leave a visible placeholder and ask; do not fill it.
- Delete words that carry nothing on screen: per-slide author names and dates, "Part N" stamps, source lines, footnote-sized caveats that are said aloud anyway. The speaker talks; the slide shows.
- Keep what makes a theorem a theorem: hypotheses, attribution, and the exact statement. Simplifying for a general audience means dropping symbols, not weakening claims. Ask before changing any mathematical content.
- Cite with links that resolve: DOI for papers, the publisher or author page for books, the official page for people, events and software. A link that goes to a search result is worse than no link.

## Consistency over local fixes

When the same kind of slide appears several times (six worked examples, three "definition + picture" slides), give them one skeleton so the analogy is visible. Fix problems in the shared CSS or the shared markup, not slide by slide; a deck patched page by page drifts within an hour.
