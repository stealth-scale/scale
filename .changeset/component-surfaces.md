---
"@stealthscale/component-surfaces": minor
---

component-surfaces: rule a divided card with hairlines

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

component-surfaces: add Card.Section, Card.Overlay and the palette, scrim and disabled axes

- Breaking: `Card` no longer takes `backdrop`. The theme's `backdrop.*` layer styles are unchanged.
- Breaking: `Card` takes `palette` in place of `status`. Replace `status="error"` with
  `palette="error"`. `palette` offers the eight palettes from `paletteVariants`, and `staticCss`
  emits every one. An `outline` card sets its border to `colorPalette.border`, and a `subtle` card
  also fills with `colorPalette.subtle`.
- `Card.Section` renders a band that extends to the card's side edges, keeps its content at the
  inset, and has a hairline to each band beside it. Two adjacent sections share one rule.
- Every rule in a card spans its full width with the inset above and below it: 16px at `md`. The
  lower band of each boundary renders the rule. `divided` rules the band after the header and the
  footer this way. Its rules ran inside the padding, with the inset above the header's rule and the
  gap below it.
- `Card.Overlay` renders a layer over `Card.Media` for a badge or a caption, at the bottom-start
  corner. `scrim` darkens the lower half of the picture with `blackAlpha.700` and renders the
  overlay in the dark color scheme.
- `disabled` renders the card at `opacity: disabled` with no pointer events, and `Card.Root` sets
  `aria-disabled`.
- `Card.Media` extends to the top edge only as the first band and to the bottom edge only as the
  last. It extended to the top edge wherever it stood. In the horizontal orientation it covers the
  leading third at full height, and the other bands stack in one column beside it. Each band
  rendered as a column of its own.
- The indicator and the aside span the title and description rows and are centred on them. The aside
  rendered on the description row. Both are spaced from the header's text by 8, 12, 16 and 16px from
  `sm` to `xl`, where both took 6px at every size. An `img` in the indicator renders as a round
  avatar of 32 to 56px by size, and a direct `svg` takes the icon size of the card's size.
- `--card-inset` and the new `--card-gap` contain the density-scaled lengths. Under a density of 0.9
  the media bled 10% past the padding.
- In an interactive card every other link and button is positioned over the title's stretched link
  and takes its own clicks.
