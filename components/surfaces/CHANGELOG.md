# @stealthscale/component-surfaces

## 0.1.0

### Minor Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`18e2d59`](https://github.com/stealth-scale/scale/commit/18e2d59bc110b9ab7f8f945e9ecc2a0bb1b48531) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-surfaces: rule a divided card with hairlines
  
  - The rules between a card's bands read `borderWidths.hairline` rather than the reference width
    `sm`, and the card's own edge reads the hairline the `surface()` helper draws.
  
  component-surfaces: publish Card
  
  - `Card` draws a panel a reader takes in on its own. Nine parts under one namespace: `Root`,
    `Media`, `Header`, `Indicator`, `Title`, `Description`, `Aside`, `Content` and `Footer`.
  - The root is an `article`, which a screen reader announces and lets a reader move between. It
    carries no name of its own, so point `aria-labelledby` at the title's `id` or state `aria-label`.
    A card that is part of its surroundings takes `as="div"`.
  - The header is a grid of three columns rather than a row of stacks. The indicator spans both lines
    of the title block, the title and the description take the middle column, and the aside sits
    against the end. A column with nothing in it is zero wide, so a card with no indicator needs no
    other arrangement.
  - `Media` takes back the room the root leaves, so a picture meets the card's edges and the root
    clips its corners. Which edges it meets follows `orientation`.
  - The root states its own inset as `--card-inset`, which the media reads back as a negative margin
    and the divided bands read as the room between a rule and the words. Both would otherwise be a
    length per step, which is a compound for every pair of `size` and the axis beside it.
  - Nine axes. `variant` runs over `elevated`, `outline`, `subtle` and `glass`, and `size` over four
    steps. `orientation`, `radius`, `justify` for the footer's spread, `status`, `motion`, `divided`
    and `interactive` are the other seven.
  - `interactive` draws the root's focus ring from `:focus-within`, so the whole card shows the focus
    while the thing a keyboard reaches is the link in the title. A press handler on the root would
    leave the card reachable by pointer alone.
  - Two named compounds: `toned` draws the palette edge where a status meets a look that shows one,
    and `lifted` deepens the shadow where an interactive card is elevated.
  
  component-surfaces: stretch the title's link over an interactive card
  
  - `interactive` draws a pseudo-element from the link in `Card.Title` over the root, which is the
    card's positioned ancestor. A press anywhere on the card follows the link, while the link alone
    holds the focus and the name. The card showed a pointer cursor before this and followed nothing
    outside the title.
  
  component-surfaces: show every component
  
  - One specimen per component, each scene drawing every value of every axis the recipe offers, with
    the words read through the catalogue's `specimen` namespace from `locales/en/specimen/`.
  
  component-surfaces: ring an interactive card from the link in its title
  
  - The card draws its ring when the link in its title takes focus. The compiler's focus utility
    nested under a descendant condition asks the card itself to be focus-visible, which a div never
    is, so the card drew no ring. A supplementary control still rings itself alone.
  
  component-surfaces: draw a card with no panel
  
  - `variant="plain"` draws no fill, no edge and no shadow, so a card lays its bands out and states
    its inset while what it holds stands on whatever is behind it.
  - An interactive `Card` rings itself in `colorPalette.focusRing` rather than through a chain of
    custom properties ending in a hard-coded `#005FCC`. The fallback was unreachable, and the root
    declared the ring colour twice.
  - `Card`'s `size` and `variant` list their values in the scale's and the looks' order rather than
    alphabetically. The styles each value draws are unchanged.
  - `Card` takes a `backdrop` axis: `aurora`, `checker`, `dots`, `grid`, `noise`, `spotlight`,
    `stars`, `stripes` and `vignette`. Each is a layer style the theme already drew and no component
    could reach. A pattern paints the root's background image and leaves its fill alone, so it
    composes with every look. `aurora` carries the drift animation that moves it.
  - `Card` takes an `effect` axis with `glow`, which reads `glow.lg`. The button takes the smaller
    glow; a spread measured against a control reads as a smudge round something the size of a card.

### Patch Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - components: hold every package to the barrel rule its ADR already states
  
  - ADR-0018 puts a specification beside every source file, the barrels included, and records that the
    conformance suite holds a package to it "where the package asks with `barrels: true`, which every
    component package does". Ten of the sixteen asked for nothing, so the rule was written down and
    enforced nowhere in them.
  - `collections`, `content`, `data`, `disclosure`, `feedback`, `forms`, `modals`, `navigation`,
    `screen` and `surfaces` now ask. The check reported thirteen barrels with no specification beside
    them, each now written: the package barrel of nine of those ten, `screen`'s folding and focus
    barrels, and `collections`' collection barrel.
  - A barrel specification names every export as a sorted list and asserts that neither a recipe nor a
    binding is among them, which is what catches a leaked binding and a dropped export.
  - Forty-three barrels under `foundations/` and `packages/` still have no specification. The ADR's
    decision covers them and its enforcement note does not, so they are left for a pass of their own.

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
- Updated dependencies [[`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/theme@0.4.0

## 0.0.1

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
