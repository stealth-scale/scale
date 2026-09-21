# @stealthscale/component-actions

## 0.2.0

### Minor Changes

- [#38](https://github.com/stealth-scale/scale/pull/38) [`c8b2f1e`](https://github.com/stealth-scale/scale/commit/c8b2f1ea3cd9f92a5e80a0c275c69d5f4d5da8fd) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-actions: draw the button's edge at the control's stroke width
  
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

### Patch Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - components: emit a rule for every status a component can be handed
  
  - Every recipe with a `status` axis now carries `statusEmitted()` under `staticCss`: `Button`,
    `Badge`, `Alert`, `Checkbox`, `Field`, `Fieldset`, `Input`, `Switch`, `Textarea`, `Card`,
    `Blockquote`, `Code`, `Kbd` and `Mark`.
  - The compiler emits a rule for a value it reads from a literal in an application's source. An
    application writes `status={row.status}` rather than `status="error"`, so the compiler read a name
    it could not follow. The runtime still wrote the class, and the component drew in its default
    palette while reporting an error.
  - Measured on the single-theme example, which writes `status="error"` and the other three nowhere:
    the stylesheet held a rule for `error` alone before, and for all four after, at 0.19 kB over the
    wire.
  - `recipe.emitted` in the theme's test kit reports a recipe that offers a status and lists none, so
    a new one cannot be written without it.
- Updated dependencies [[`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/hooks@0.2.0
  - @stealthscale/theme@0.4.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`c9f0233`](https://github.com/stealth-scale/config/commit/c9f0233e3357bed7c6161d6a7fd9a03fdab1da4e) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-actions: publish the button and the icon button
  
  - `Button` binds a `button` element through the compiler's factory with `type` defaulted to
    `button`, so a caller changes the element with `as`. `ButtonPropsProvider` sets the variants of
    every button below it.
  - The recipe offers the six looks and a glass look, the eight control sizes up to a hero's `4xl`,
    the four statuses, a square shape and the glow effect, each a layer style, a semantic scale step
    or a palette a theme moves.
  - A button takes an `elevation`, `raised` or `floating`, which lifts under a pointer and drops
    towards the page under a press, and a `ripple` beside the `glow`.
  - `IconButton` binds the same recipe with the square shape as its default, and its props require
    `aria-label` or `aria-labelledby`. A compound clears the inset a leading mark takes off it, so a
    square button holding one mark keeps the mark centred.
  - The preset under `./theme` registers the recipe.

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
