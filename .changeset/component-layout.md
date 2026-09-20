---
"@stealthscale/component-layout": minor
---

component-layout: pull an attached group's neighbours back by the control's stroke

- An attached group overlaps its children by `borderWidths.control`, which is the width every
  control draws its edge at, rather than by the reference width `sm`. The divider reads the theme's
  hairline through the `divider()` helper.

component-layout: publish Group

- `Group` lays controls along one direction, a semantic gap apart or attached into one control with
  several parts.
- `attached` squares the corners between neighbours and draws the border between them once, so three
  buttons read as one control with three parts. It also stops the group wrapping and closes the gap,
  because a row that wrapped would leave a squared corner at the end of a line and a gap would show
  the seam the squared corners are there to hide.
- Six axes: `align`, `attached`, `gap`, `grow`, `justify` and `orientation`.
- The element is a `div` and says nothing about what it holds. Name the set with `role="group"` and
  `aria-label` where the children are one choice, and use a fieldset where they are form controls.

component-layout: add fill-<measure> to the grid's columns axis

- `Grid.Root columns="fill-xs"` draws as many columns of the measure as fit and keeps the ones a
  short row leaves empty, so one card in a group of one keeps the measure every other card has. The
  `fit-<measure>` values still drop the empty columns and stretch the entries across the row.

component-layout: take a grid entry's span on the entry

- `Grid.Item span="8"` reaches across eight columns, as the README has said. The span was read from
  the root, which gave every entry of a grid one span, so an article beside an aside could not be
  written. The entry provides the recipe's variants itself, which is how a part of a slot recipe
  takes an axis of its own.

component-layout: read a stated alignment on a row

- `Stack align="flex-start" direction="row"` places the children at the start, as the README has
  said. The compiler writes the axes in an order of its own with `align` before `direction`, and a
  rule written later wins, so the row's centring beat every stated place. The centring is now
  written in the base, which sits in a layer below every variant, so a stated `align` overrides it
  and a row with none stated still centres.

component-layout: show every component

- One specimen per component, each scene drawing every value of every axis the recipe offers, with
  the words read through the catalogue's `specimen` namespace from `locales/en/specimen/`.

component-layout: attach a group by position among its children

- An attached group joins its children by position among the children rather than among siblings of
  one tag. A group of a button, a link and a button gave the middle item all four corners back and
  lost its overlap.

component-layout: show the grid's alignment and the stack's wrap in a narrow room

- The grid's alignment scene draws four columns with each entry as a tile, so the note wraps and the
  entry stretches. The stack's wrap scene stands each row in the first cell of a grid of four, so
  the seven days pass its end. Both read the same in every value before.
