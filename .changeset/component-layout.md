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

- `Stack align="flex-start" direction="row"` places the children at the start. The compiler emits
  `align` before `direction`, so the row's `alignItems: center` overrode every stated `align`. The
  base now centres a row. The base is in a lower cascade layer than every variant, so a stated
  `align` overrides it, and a row without `align` still centres its children.

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
- `Frame` takes a `blur` axis on the three blurs the theme draws, applied to what the frame holds
  rather than to the frame. They were reachable from no component.
- `Group` takes a `dim` switch, which recedes the children the pointer is not resting on. The rule
  reads the hovered child of the element it is set on, so a group of peers is where it works.

component-layout: set justify-items from the grid's justify axis

- Breaking: `Grid.Root justify` sets `justify-items` and offers `start`, `center` and `end`.
  `between`, `around` and `evenly` are removed. Every column template ends in `1fr`, so
  `justify-content` had no free space to distribute and each value rendered the same grid.

component-layout: remove column flow from the grid

- Breaking: `Grid.Root flow` offers `row` and `dense`. `column` is removed. The recipe does not set
  a row template, so column flow placed every item in the first row and added one implicit column
  per item.

component-layout: set aria-orientation on the divider

- `Divider` sets `aria-orientation` from `orientation`, whether the prop or `DividerPropsProvider`
  sets it. A vertical divider rendered as a horizontal `separator` unless the caller also passed
  `aria-orientation`. An `aria-orientation` the caller passes takes precedence.
- `Group dim` also dims the siblings of a keyboard-focused or `aria-pressed="true"` child, through
  the theme's `dim.others` layer style.
