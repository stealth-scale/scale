---
"@stealthscale/component-actions": minor
---

component-actions: draw the button's edge at the control's stroke width

- The button's border reads `borderWidths.control` rather than the reference width `sm`, so a theme
  with a heavier hand moves every button's edge with every input's.

component-actions: fill a pressed toggle button

- The recipe fills a button while `aria-pressed` is true: `colorPalette.subtle` behind the palette's
  ink, with the palette's edge. A toggle is therefore a button with `aria-pressed`, and the fill and
  what a screen reader announces cannot disagree.
- The button's specimen reads every axis off the recipe and crosses each with every look: the sizes,
  the statuses, both elevations, the effects, the square that holds one glyph, the pressed state and
  the disabled state, each scene under its own word. The words come from the catalogue under
  `button`, and each scene is documented.

component-actions: ripple under every press and hold the box still

- Every button carries the ripple layer style. A press spreads a ripple from the middle of the box
  and the release fades it. The `effect` axis keeps the glow alone, so `effect="ripple"` is gone.
- The box no longer scales to 98 percent under a press. The press is read from the look's pressed
  fill, the ripple and the elevation dropping, and a box that shrinks under the pointer read as
  flinching.

component-actions: fill a button that is on in a compound over the looks

- A button that is on, through `aria-pressed="true"` or `aria-current="page"`, takes the palette's
  subtle fill in the ghost, glass, outline and plain looks and the muted fill in the subtle and
  surface looks, set semibold where it names the page being read. The solid look is left as it is.
- The fill is written in two named compounds, `on` and `on-deeper`, rather than in the base. The
  compiler emits a look's own fill in a later cascade layer than the base, and the browser applies
  the later layer whatever the selector's specificity, so the base rule never applied. Measured on
  the ghost look: the pressed fill computed transparent.

component-actions: add the neutral value to the button's status axis

- `Button status="neutral"` points the palette at the neutral one, for a control in a bar that reads
  in the ink of the words beside it. The value is emitted whether or not a page writes it, beside
  the four statuses, because a bar sets it through a provider.

component-actions: add the clipboard over the clipboard machine

- `Clipboard.Root` runs `@zag-js/clipboard` and holds the value. `Trigger` copies it, `Indicator`
  swaps its glyph while the copy is fresh, `Label` names the value, `Input` shows it read-only,
  `ValueText` writes it, and `Consumer` hands the machine's `copied`, `value` and `copy` to a
  function of the page's own.
- The machine names the trigger for a screen reader and `translations` on the root replaces the
  words. `timeout` defaults to 3000 milliseconds.
- The trigger draws no control look. A page draws it as `Button` or `IconButton` through `as` and
  sets their variants through `ButtonPropsProvider`. The recipe offers `size` at `sm`, `md` and
  `lg`, which steps the label and the gaps.
- The package peers on `@stealthscale/hooks` and depends on `@zag-js/clipboard`, `@zag-js/react`,
  `@zag-js/types` and `@zag-js/utils`.
