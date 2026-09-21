# @stealthscale/component-layout

## 0.2.0

### Minor Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-layout: pull an attached group's neighbours back by the control's stroke
  
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

### Patch Changes

- Updated dependencies [[`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/theme@0.4.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`6f479a7`](https://github.com/stealth-scale/config/commit/6f479a76b7c34c879d840e82f709af32749f236f) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-layout: publish the six components that arrange a page
  
  - `Stack` lays its children out along one direction a semantic gap apart, `Grid` lays its entries
    out in columns as `Grid.Root` holding `Grid.Item`, `Container` holds a page to one measure,
    `Frame` holds a picture to one shape, `Divider` draws one line between things and `Spacer` takes
    the room a stack has left over.
  - A layout responds to the room it is in rather than to the width of the window. A grid's
    `columns="fit-sm"` draws as many columns of that measure as there is space for and wraps the rest,
    and a column narrows rather than overflowing where the grid is narrower than the measure. Nothing
    here reads a breakpoint.
  - `Divider` is an `hr`, which a browser gives the separator role, and `Spacer` is hidden from
    assistive technology.
  - The preset under `./theme` registers all six recipes.

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
