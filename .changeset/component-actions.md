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

component-actions: mark a solid button that is on

- A solid button that is pressed or on the current page carries a line inside its own edge. The
  pressed treatment covered the quiet and the filled looks and excluded solid, so a solid button at
  `aria-pressed=true` was identical to one at `false` in background, ink, border, weight and shadow.

component-actions: keep a clipboard's lone trigger at a button's width

- The clipboard's root aligns its parts at the start and the control row stretches back across it,
  so a trigger on its own keeps a button's width. A column that stretched every part drew the
  trigger the width of the card.

component-actions: add a breathing glow to the button's effect axis

- `effect="pulse"` animates the glow between nothing and its full spread, through the theme's
  `pulse-glow` animation style. It states `boxShadowColor` rather than layering `glow.md`, because
  the keyframe writes the whole `box-shadow` and would overwrite a static one.
- Both effects read `colorPalette.solid/50`, so a status or a theme moves them.
- The moving border is deliberately not offered. `border.moving` paints the panel colour across the
  padding box to mask the conic gradient inside the edge, so it replaces whatever fill the look
  painted and leaves a solid button drawing its contrast ink on a panel. Drawing the ring without
  touching the fill needs a pseudo-element, and a button has neither left: the ripple holds
  `::after` and the touch target holds `::before`. The reason is recorded on the axis.

component-actions: split the clipboard root's props over a copy

- `Clipboard.Root` splits its props through `splitEnumerable` from `@stealthscale/hooks`. Rendered
  with a `key`, it logged React's `key is not a prop` warning and spread `key` onto its element in
  development.

component-actions: import omitUndefined from the hooks package

- The clipboard machine takes `omitUndefined` from `@stealthscale/hooks`. The package's private
  copy, `stated`, is removed.

component-actions: replace the button's status axis with a palette axis

- Breaking: `Button` and `IconButton` take `palette` in place of `status`. Replace `status="error"`
  with `palette="error"`.
- `palette` offers `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning` and
  `error` through `paletteVariants` from `@stealthscale/theme/authoring`. `status` offered the four
  statuses and `neutral`.
- `staticCss` emits every palette, so a value set through `ButtonPropsProvider` has a class in the
  stylesheet when no page sets it as a prop.
- The clipboard specimen sets `palette` on its caller-built button and renders `CopyIcon` and
  `CheckIcon` from `lucide-react` in place of hand-drawn SVG paths.

component-actions: render the button scenes from examples

- The button specimen renders each scene from a file under `button/examples/` and shows that file as
  its source. The pressed and disabled scenes pass their first-cell props through `Scene.props`.
- `src/examples.spec.ts` runs axe on every example of the package.

component-actions: take the clipboard trigger's names as label props

- Breaking: `Clipboard.Root` no longer takes `translations`. `Clipboard.Trigger` takes `label`,
  default "Copy to clipboard", and `copiedLabel`, default "Copied to clipboard", and sets its
  `aria-label` from them by the copied state. Replace `translations={{ triggerLabel }}` on the root
  with the two props on the trigger.
- A trigger with visible text passes that text as `label`. The specimen's "Copy the link" button was
  named "Copy to clipboard", which fails WCAG 2.5.3. axe `label-content-name-mismatch` reports no
  violation on the page.

component-actions: render the clipboard scenes from examples

- The clipboard specimen renders each scene from a file under `clipboard/examples/`. The size scene
  renders the three sizes itself, and the field and the rows take a phone's width.
- Docblocks, case names, the README section and the scene text are rewritten in the house register.

component-actions: zero the inline padding of every square button

- The `squared` compound sets `paddingInline: 0` on every `shape="square"` button. It applied only
  to a square whose first child is an `svg`, so `Clipboard.Trigger`, which wraps its icon in
  `Clipboard.Indicator`, kept the size's padding. At `md`, 16px each side left a 6px content box for
  a 16px icon, and the content measured 43px in a 40px box.
- The `shape` variant sets only `aspectRatio`. The compiler emits the size axis after it, so its
  padding never applied.
