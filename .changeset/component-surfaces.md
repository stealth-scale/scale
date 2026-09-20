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
