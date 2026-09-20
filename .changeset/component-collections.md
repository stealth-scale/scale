---
"@stealthscale/component-collections": minor
---

component-collections: rule the table with hairlines and stripe it in the first well

- Every rule of the table reads `borderWidths.hairline`, so a theme moves them with every other
  hairline. The stripe is `bg.subtle`, the shallowest well, so a hovered row on the muted fill still
  stands from it.

component-collections: publish Listbox, useListCollection and useFilter

- `Listbox` draws a list of rows a person picks from, with the keys the ARIA pattern calls for. Ten
  parts under one namespace. It binds Zag's listbox machine, which writes every role, every
  identifier and every key.
- Every part is a `div`. A listbox is a grouping for a screen reader rather than a list of items,
  and drawing it as one nested an `li` with `role="option"` inside an `li` with `role="group"`,
  which axe reports as `aria-allowed-role`.
- `highlight` marks the row the keys are on rather than the row that has focus, because a listbox
  driven from a field never moves focus off the field. `highlightVariants` now takes the condition
  to write against, so this reads `_highlighted` while a navigation reads `_currentPage`.
- Four axes: `highlight`, `radius`, `size` and `variant`.
- Rows go in through `collection`, so the component holds no matching of its own.

- `useListCollection` holds the rows a list draws and the text typed, and answers what is left of
  them. A caller passes a predicate to match on the words a reader sees or on anything else the row
  holds, and `narrow("")` restores every row.
- `useFilter` answers `contains`, `startsWith` and `endsWith` over `Intl.Collator`, so `Jose`
  matches `José` and `strasse` matches `Straße`. The default sensitivity ignores case and accents,
  which is what a person typing into a search field expects.
- `ListCollection` is re-exported from the engine rather than retyped, so a consumer naming it in a
  declaration file resolves it without declaring the engine themselves.

component-collections: publish Table

- `Table` draws a table of records. Thirteen parts under one namespace: `Scroller`, `Root`,
  `ColumnGroup`, `Column`, `Caption`, `Header`, `Body`, `Footer`, `Row`, `ColumnHeader`, `Sorter`,
  `RowHeader` and `Cell`. Every part binds the element a browser already gives the meaning to.
- `Scroller` is the box a wide table scrolls inside, and it holds `tabIndex` at zero. WCAG 2.1.1
  fails a region a pointer can scroll and a keyboard cannot, and it is the failure a table component
  is most often reported for.
- `ColumnHeader` states `scope="col"` and `RowHeader` states `scope="row"`. A `th` without a scope
  is guessed at, and the guess is wrong on any table carrying both.
- `Sorter` draws the control that sorts a column, as a button inside the header rather than a
  pressable `th`. The header keeps `aria-sort`. Sorting, filtering and pagination stay with the
  page: a component that filters has an opinion about the data it shows.
- `ColumnGroup` and `Column` declare the table's columns, so a fixed layout states its widths once
  rather than on the first cell of every row.
- Ten axes: `variant`, `size`, `align`, `layout`, `radius`, `striped`, `ruled`, `interactive`,
  `stickyHeader` and `stickyColumn`.
- `interactive` lights a row under the keyboard as well as the pointer, through focus within it. A
  `tr` holds no role a reader can act on, so the link in a cell carries the behaviour.
- `stickyColumn` holds the row's own name still while the table scrolls sideways. Set beside
  `stickyHeader`, a compound pins the corner cell to both edges above them.
- A cell of figures states `data-numeric`, which sets it in tabular figures against its end. It is
  an attribute rather than an axis, because a slot recipe resolves its variants once at the root.
- Every value is a semantic token or a helper's. The stripe and the hover reach the body's own rows
  rather than every row of the table, since `:nth-of-type` counts within a parent.

component-collections: show every component

- One specimen per component, each scene drawing every value of every axis the recipe offers, with
  the words read through the catalogue's `specimen` namespace from `locales/en/specimen/`.
- The README's listbox example passes `item` to `Listbox.ItemText` and `Listbox.ItemIndicator`,
  which both require it, and its axis table lists the two looks the recipe offers. An `outline` look
  was listed that no recipe drew.

component-collections: paint a sticky header on the cells that move

- The sticky surface is on the column headers and the corner cell rather than on the section. A
  `thead` does not move, so its fill scrolled away and the body's values showed through the header's
  labels.

component-collections: draw the listbox's narrowing field as a band across the list

- The field stands in a `control` band that carries the rule under it, the room round it and the
  focus within it. A boxed field there drew a second border inside the list's and the ring a field
  carries drew a third on focus, so the band takes the flushed treatment instead: one rule
  underneath, which changes colour while anything inside the band has focus.
- `Listbox.Input` takes `clearIndicator` and `clearLabel` and draws a `clearTrigger` that empties
  the field. The control belongs to this recipe rather than coming from the search field in
  `component-forms`, which keeps this package off every other component package. A field from
  elsewhere brings a box of its own, and the box and the band both want the width the rule reaches.
- The label above the list, the summary below it and the group labels within it keep the inset a row
  keeps, so every word on the list starts on one line.

component-collections: publish the listbox parts a list is actually built from

- `Listbox.Empty` says a list holds nothing and draws nothing while it holds something.
  `Listbox.SelectAll` turns the whole list on from a row above it and reports how much of it is on
  through `aria-pressed`, `mixed` included. `Listbox.ItemCheckbox`, `Listbox.ItemDescription` and
  `Listbox.ItemLines` draw a row's box, the line under its name, and the column holding the two
  lines together.
- Three axes join the four: `columns` lays the rows out as tiles, `orientation` runs them along a
  line, and `selected` marks a picked row. `selected="none"` draws nothing at all, for a list whose
  rows each carry a box that says the same thing.
- `useGridCollection` holds the rows a list draws in columns. A grid collection is what changes the
  keys: all four arrows move the highlight, so a reader crosses the tiles the way they see them.
- `useListCollection` takes `isItemDisabled`, so a caller says which rows cannot be picked.
- The list publishes one row's height as `--listbox-row`, written from the same two values a row is
  written from, for whatever counts rows into a measure.

component-collections: draw a whole listbox from props

- `Listbox.Simple` draws the list almost every caller wants. It takes `label`, `empty`, `summary`,
  `selectAll`, `narrowing`, `description`, `icon`, `groupBy`, `groupLabel` and `tall` beside
  everything the root takes. A list that wants something else composes the parts it is built from.
- `Listbox.Row` draws a row out of those parts. The root states the row's shape once, through
  `boxed` and the two marks. A list therefore cannot end up with a box on some rows and a check on
  others. A boxed list leaves its picked rows unfilled unless a caller says otherwise, because the
  box already says the row is in the set.
- `Listbox.Window` draws only the rows near enough to be seen and holds the room the rest would
  take. It measures one row rather than being told a height. It scrolls to the nearest edge the way
  a browser does. The machine is told how to scroll only while a window says how. Left alone it
  scrolls the highlighted row into view itself, which is right for every list that draws all its
  rows.
- `tall` on `Listbox.Simple` does both jobs. A list told how many rows it stands draws only those
  and holds itself to their height.

component-collections: publish Transfer

- `Transfer` moves rows between two lists, for a set a person builds out of a longer one. One
  component rather than a namespace: what it draws is fixed, and a caller who wants something else
  composes two listboxes.
- Both sides keep the same width and the same height. Neither moves as rows cross between them. The
  floor under that height is the room every row would take, counted off the row height each list
  publishes.
- The two controls are off while nothing on their side is picked, so neither ever does nothing. They
  are the one element a transfer adds, drawn from this recipe rather than from the button package.
- Picking is cleared on the side a row leaves. A row that crossed over while still counted as picked
  would be taken straight back by the next press of the other control.
