---
"@stealthscale/component-collections": minor
---

component-collections: set a table's column names back from its values

- A column name is drawn in the muted ink at the label role, one size smaller than the values it
  heads, and the band is closed by a rule heavier than the ones between the rows. A fill behind the
  names says the same thing louder, has to be painted on each cell once the header sticks, and
  fights the stripe where a table has one.
- A sorted column takes the full ink back, so a reader sees which column the table is in the order
  of. The row's own name is drawn at the body weight, so the first column reads as values rather
  than as a second header.
- `variant` is `plain` or `surface`, and the rules a table is drawn with move to `rules`: between
  the rows, between the columns as well, or none. The two were one axis, so `line` and `outline`
  wrote the same rules twice and a boxed table needed a second boolean to rule its columns. The
  `ruled` boolean is gone.
- A total is separated from the figures it sums by a rule over the footer, drawn whichever way the
  rows between them are ruled.
- A cell's room is drawn from two scales rather than one. The middle size came to a forty-six pixel
  row, which is a table read at half the density it could be.
- `stickyHeader` gives the scroller `overflow-y`, so a header sticks once a caller holds the box to
  a height. It stuck to nothing before.

component-collections: draw a whole table from one list of columns

- `Table.Simple` takes `columns`, `rows`, `rowToKey`, `caption`, `total` and `onSort` beside
  everything the scroller takes. A column's name, its width, whether it holds figures, whether it
  names the record and how to read it off one are stated once. Written into the markup they landed
  in four places: the column declarations, the name in the header, and `data-numeric` on the name
  and again on every cell of every row.
- A column holding columns spans them. The span, the second row of names and the `colgroup` scope
  are worked out from the shape, because a `col` scope on a spanning name says the cells directly
  under it answer to the name, which is the row beneath rather than the figures. A name with nothing
  under it takes as many rows as the deepest name has left.
- A width on a column reaches `ColumnGroup`, which is what a fixed layout and a held column both
  need. The declarations are drawn only where a column states a width.
- Sorting stays with the page. A column says which way it runs and what its control is called, the
  header states `aria-sort`, and the press is reported. What the order comes to is the caller's.
- `groupBy` and `groupLabel` gather the records into a section per heading. A section is a `tbody`
  of its own and its heading states `rowgroup` as its scope, so the rows under it answer to it
  rather than the columns. A row header spanning the table takes the column names' treatment, since
  drawn as a row's own name it reads as one more record.
- `empty` draws a line across the table's width where it holds no records. A table with none drew an
  empty body, which reads as a table still loading.
- Every cell and every name says which row and which column it belongs to, through `data-row` and
  `data-column`. That is the pair `useMatrixCrosshair` reads, so a grid wide enough to need one gets
  it without a caller writing an attribute per cell.
- The parts are published beside it and are what it is built from. A table that wants something else
  composes them, which is what a name spanning rows still needs.

component-collections: rule a table in one colour and two weights

- Every rule reads the one line colour. The rule under the names and the rule over the total are
  heavier rather than darker. Drawn in a second colour they read as two systems that happen to meet,
  which is what a reader sees before they see a hierarchy. `control` and `hairline` resolve to the
  same width, so the weight never changed and the colour was the only difference.
- The borders are separated rather than collapsed, and every cell rules its own end on each axis and
  never its start. A collapsed border belongs to the table rather than to the cell that asked for
  it, so a header cell held in view scrolled away from its rule and left the names sitting on
  nothing. A separated border is drawn by the cell itself and moves where the cell moves, and the
  one-end rule is what keeps two cells from drawing two lines on the edge between them.
- A column rule is drawn on every cell but the last child of its row rather than the last of its
  type. A row holding one `th` and several `td` made that `th` the last of its own type, so the
  first column drew no rule at all.
- The last row of a body a footer follows rules nothing, because the footer rules its own start and
  the two together drew a line a pixel above the total.
- The name over a held column is held with it. A column held without its own name left a reader
  looking at a column of names under whichever name had scrolled into its place.
- The held names are raised over the held column rather than beside it. Both are positioned, and two
  positioned elements on one layer are settled by document order, so a body row's own name painted
  over the name of its column.
- `radius` offers the three layer radii and not the pill. A table is a rectangle of rows, and a box
  rounded to its own height clipped the first and last of them into an arc.
- The caption takes the inset a cell takes, so its words start on the line the first column's words
  start on, and it is drawn in the subtlest ink at one size smaller. It sat flush against the box in
  the same ink as a muted value.

component-collections: take the table's tab stop back when nothing scrolls

- The scroller measures itself and holds `tabIndex` only while it has something to scroll. Every
  table on a page was a tab stop, and a stop that goes nowhere is one a reader presses through on
  the way to what they wanted.
- It is measured again as it resizes, as its rows change and once the fonts have loaded, through
  `useIsOverflowing`.
- The box draws a focus ring. It was reachable and showed nothing, which WCAG 2.4.7 fails.

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
- `Scroller` is the box a wide table scrolls inside, and it is reachable by a keyboard while it has
  something to scroll. WCAG 2.1.1 fails a region a pointer can scroll and a keyboard cannot, and it
  is the failure a table component is most often reported for.
- `ColumnHeader` states `scope="col"` and `RowHeader` states `scope="row"`. A `th` without a scope
  is guessed at, and the guess is wrong on any table carrying both.
- `Sorter` draws the control that sorts a column, as a button inside the header rather than a
  pressable `th`. The header keeps `aria-sort`. Sorting, filtering and pagination stay with the
  page: a component that filters has an opinion about the data it shows.
- `ColumnGroup` and `Column` declare the table's columns, so a fixed layout states its widths once
  rather than on the first cell of every row.
- Ten axes: `variant`, `size`, `align`, `layout`, `radius`, `striped`, `rules`, `interactive`,
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
