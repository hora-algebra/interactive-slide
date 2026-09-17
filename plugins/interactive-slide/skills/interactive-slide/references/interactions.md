# Interactions

A widget earns its place when doing it teaches something that watching it would not. Otherwise it is a toy that costs stage time.

## What to make playable

Look for the moments in the talk where the speaker would say "try it": a game to play, a recursion to run backwards, an identity to test on your own input, a construction to vary. Typical patterns, each with a precise mathematical readout:

- **Play forward.** The audience makes moves (take stones from a heap, apply an operation) and a quantity is displayed after every move: the invariant, the sign, the count. The lesson is "this number does not change" or "this number never increases".
- **Analyze backward.** A recursively defined value is filled in from the base cases up, one click per node, with the current computation spelled out (`mex({0,2}) = 1`). The lesson is the shape of the recursion.
- **Check an identity.** Two input sets or parameters, both sides of an equation computed and compared live. The lesson is that the identity is not a typo.
- **Vary a parameter.** `n = 1 … 12` with everything on the slide recomputed; the family of cases becomes one object.
- **Sync two views.** The same state drawn in two ways (a word and a path, a set and a diagram) that move together.

Skip interactivity for: definitions, theorem statements, photos, references, anything where the point is a sentence.

## Design rules learned the hard way

1. **The static state must already be the slide.** Someone who never clicks sees a complete, correct figure with a sensible default configuration. Interaction adds, never reveals.
2. **Nothing moves except the thing being changed.** Fixed control rows, fixed readout widths (`font-variant-numeric: tabular-nums`, `min-width`), states stacked in one grid cell. See layout-and-navigation.md.
3. **Show the quantity, in the accent color of its side.** A move counter, a sum, a sign, a perimeter: the number is the argument.
4. **Provide presets and a reset.** Three or four interesting starting positions as small buttons; a reset that restores the default. Free configuration is optional, presets are not.
5. **One click = one step.** Do not require drag-and-drop or multi-key gestures. Touch targets ≥ 44px. Keyboard: Enter/Space on focused elements, arrow keys inside a `[data-widget]` if useful.
6. **Guard the deck.** Put `data-widget` on the widget root so the deck ignores keys and swipes inside it. Stop timers and animations when the slide is hidden (`deck:change` event) and honor `prefers-reduced-motion` by jumping to the final state.
7. **Draw in SVG with `viewBox`,** sized by the stage unit; text in `<text>` with the accent tokens; halos (`rect.halo`) behind labels that sit on lines. Run `scripts/svg-label-overlap.cjs` after any coordinate change.
8. **Phones count.** The audience will open the deck on a phone during the break. Widgets must work with touch and inside a scrolling slide.
9. **Budget the effort.** Three good widgets beat eight half-done ones. Build the ones nearest the talk's main claim first; the last section can stay static.

## Timing in the room

Reported experience: a playable figure gets more visible reaction than the same content as formulas, and the reaction makes pacing easier, not harder. Plan a break or a pause after the widget-heavy stretch so people can try things on their own devices, and do not force the audience through every widget live.
