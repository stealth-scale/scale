---
"@stealthscale/component-collections": minor
---

component-collections: restyle table headers and split the look and rule axes

- Column headers use the muted foreground at the label role, one size below the values, closed by a
  heavier rule. A background fill was rejected: it has to be painted per cell once the header
  sticks, and it competes with the stripe.
- A sorted column takes the full foreground, so the sort target is visible. Row headers use the body
  weight, so the first column reads as data rather than as a second header.
- `variant` is now `plain` or `surface`, and rules move to their own `rules` axis with `rows`, `all`
  and `none`. The two concerns shared one axis, so `line` and `outline` duplicated rules and a boxed
  table needed a second boolean to rule its columns. The `ruled` boolean is removed.
- The footer is separated from the body by a rule above it, drawn whatever `rules` is set to.
- Cell padding is derived from two scales instead of one. The medium size produced a 46px row,
  roughly half the achievable density.
- `stickyHeader` sets `overflow-y` on the scroller. Without it the header had no scroll container to
  stick within.

component-collections: add Table.Simple

- `Table.Simple` takes `columns`, `rows`, `rowToKey`, `caption`, `total` and `onSort` alongside the
  scroller's props. Each column's label, width, numeric flag, row-header flag and accessor are
  declared once. Hand-written markup repeated them in four places: the column declarations, the
  header cell, and `data-numeric` on both the header and every body cell.
- A column containing columns spans them. The span, the second header row and the `colgroup` scope
  are computed from the shape, because a `col` scope on a spanning header applies to the cells
  directly below it, which is the second header row rather than the data.
- A column's `width` is emitted into `ColumnGroup`, which is what both a fixed layout and a sticky
  column need. Declarations are emitted only when at least one column sets a width.
- Sorting and filtering stay with the caller. A column declares its direction and its control label,
  the header emits `aria-sort`, and presses are reported through `onSort`.
- `groupBy` and `groupLabel` render one `tbody` per group with a `scope="rowgroup"` heading row.
- `empty` renders a single cell spanning the table when there are no rows. Previously an empty table
  rendered an empty `tbody`, which reads as still loading.
- Every cell and header emits `data-row` and `data-column`, which is the pair `useMatrixCrosshair`
  queries, so a wide grid gets a crosshair without per-cell attributes from the caller.
- The parts are exported alongside it and are what it composes, for tables that need a different
  shape.

component-collections: separate table borders and fix the rule system

- All rules use one border colour. The header and footer rules differ by weight, not colour. Two
  colours read as two unrelated systems. `control` and `hairline` resolve to the same width, so the
  weight never actually changed and the colour was the only difference.
- Borders are separated rather than collapsed, and each cell draws only its end border on each axis.
  A collapsed border belongs to the table, not the cell, so a sticky header cell scrolled away from
  its own rule. A separated border moves with its cell, and the end-only rule stops adjacent cells
  drawing two lines on the same edge.
- Column rules are drawn on every cell except `:last-child` rather than `:last-of-type`. A row with
  one `th` and several `td` made the `th` the last of its own type, leaving the first column
  unruled.
- The last body row before a `tfoot` drops its bottom border, because the footer draws its own top
  border and the two rendered a line 1px above the total.
- A sticky column's header cell is sticky too. Without it, readers saw a column of row names under
  whichever header had scrolled into place.
- Header rows sit above sticky columns rather than beside them. Both are positioned, and equal
  z-index is resolved by document order, so a row header painted over its own column header.
- `radius` offers the three layer radii and not the pill. A box rounded to its own height clipped
  the first and last rows into an arc.
- The caption uses the same inset as a cell, so its text aligns with the first column, and it is set
  in the subtlest foreground one size down.

component-collections: make the table scroller focusable and a region only when it scrolls

- The scroller measures itself and takes `tabIndex` only while there is something to scroll. Every
  table on a page was previously a tab stop that went nowhere.
- It takes `role="region"` with the tab stop. A focusable `div` with a name and no role is announced
  as the name alone. The role is conditional rather than permanent, because a landmark per table
  makes the landmark list unusable.
- It is re-measured on resize, on row changes and after fonts load, through `useIsOverflowing`.
- The box draws a focus ring. It was reachable and showed nothing, which fails WCAG 2.4.7.

component-collections: use hairline tokens for table rules and bg.subtle for stripes

- Every table rule reads `borderWidths.hairline`, so a theme moves them with every other hairline.
  The stripe is `bg.subtle`, the shallowest fill, so a hovered row on the muted fill is still
  distinguishable.

component-collections: add Listbox, useListCollection and useFilter

- `Listbox` renders a selectable list with the keyboard behaviour the ARIA pattern requires. Ten
  parts under one namespace, over Zag's listbox machine, which emits every role, id and key handler.
- Every part is a `div`. A listbox is a grouping rather than a list of items, and rendering it with
  `li` nested an `role="option"` inside an `role="group"`, which axe reports as `aria-allowed-role`.
- `highlight` styles the row the keyboard is on rather than the focused row, because a listbox
  driven from a field never moves DOM focus. `highlightVariants` now takes the condition to write
  against, so this uses `_highlighted` while a navigation uses `_currentPage`.
- Four axes: `highlight`, `radius`, `size` and `variant`.
- Rows are supplied through `collection`, so the component does no matching of its own.
- `useListCollection` holds the rows and the query and returns the remaining rows. Callers supply a
  predicate to match on the visible text or anything else the row holds, and `narrow("")` restores
  every row.
- `useFilter` returns `contains`, `startsWith` and `endsWith` backed by `Intl.Collator`, so `Jose`
  matches `José` and `strasse` matches `Straße`. The default sensitivity ignores case and accents.
- `ListCollection` is re-exported from the engine rather than redeclared, so consumers naming it in
  a declaration file resolve it without declaring the engine themselves.

component-collections: add Table

- `Table` renders a table of records. Thirteen parts under one namespace: `Scroller`, `Root`,
  `ColumnGroup`, `Column`, `Caption`, `Header`, `Body`, `Footer`, `Row`, `ColumnHeader`, `Sorter`,
  `RowHeader` and `Cell`. Each part binds the element that already carries the semantics.
- `Scroller` is the scroll container for a wide table and is keyboard reachable while it has
  something to scroll. WCAG 2.1.1 fails a region a pointer can scroll and a keyboard cannot.
- `ColumnHeader` sets `scope="col"` and `RowHeader` sets `scope="row"`. A browser guesses the scope
  of an unscoped `th`, and it guesses wrong on any table carrying both.
- `Sorter` renders the sort control as a button inside the header rather than making the `th`
  pressable. The header keeps `aria-sort`. Sorting, filtering and pagination stay with the caller.
- `ColumnGroup` and `Column` declare the table's columns, so a fixed layout states its widths once
  rather than on the first cell of every row.
- Ten axes: `variant`, `size`, `align`, `layout`, `radius`, `striped`, `rules`, `interactive`,
  `stickyHeader` and `stickyColumn`.
- `interactive` highlights a row on focus-within as well as hover. A `tr` carries no actionable
  role, so the link inside a cell drives it.
- `stickyColumn` pins row headers while the table scrolls horizontally. Combined with
  `stickyHeader`, a compound pins the corner cell to both edges.
- A numeric cell sets `data-numeric`, which right-aligns it and sets tabular figures. It is an
  attribute rather than an axis, because a slot recipe resolves its variants once at the root.
- Every value is a semantic token or comes from a helper. The stripe and hover target the body's own
  rows rather than every row, since `:nth-of-type` counts within a parent.

component-collections: add specimens for every component

- One specimen per component, each scene rendering every value of every axis the recipe offers, with
  words read through the catalogue's `specimen` namespace from `locales/en/specimen/`.
- Fix the README's listbox example, which omitted the required `item` prop on `Listbox.ItemText` and
  `Listbox.ItemIndicator`, and its axis table, which listed an `outline` look no recipe implements.

component-collections: paint the sticky header background on the cells rather than the section

- A `thead` does not move when its rows stick, so a background on the section scrolled away and body
  content showed through the header labels. The background moves to the column headers and the
  corner cell.

component-collections: restructure the listbox filter field as a band

- The field is wrapped in a `control` band that carries the rule below it, the surrounding padding
  and the focus state. A bordered field drew a second border inside the list's, and its focus ring
  drew a third, so the band uses the flushed treatment: one rule underneath, which changes colour on
  focus-within.
- `Listbox.Input` takes `clearIndicator` and `clearLabel` and renders a `clearTrigger` that empties
  the field. The control belongs to this recipe rather than coming from `component-forms`, which
  keeps this package independent of every other component package. An external field brings its own
  box, and the box and the band compete for the width the rule spans.
- The label above the list, the summary below it and the group labels within it use the same inset
  as a row, so all text aligns on one line.

component-collections: add the remaining listbox parts

- `Listbox.Empty` renders only while the list is empty. `Listbox.SelectAll` toggles the whole list
  from a row above it and reports coverage through `aria-pressed`, including `mixed`.
  `Listbox.ItemCheckbox`, `Listbox.ItemDescription` and `Listbox.ItemLines` render a row's checkbox,
  its secondary line, and the column holding the two lines.
- Three axes join the four: `columns` lays rows out as tiles, `orientation` runs them along an axis,
  and `selected` styles a selected row. `selected="none"` renders no selection styling, for lists
  whose rows carry a checkbox that already says it.
- `useGridCollection` holds rows in columns and changes the key handling: all four arrows move the
  highlight, matching the visual layout.
- `useListCollection` takes `isItemDisabled`, so callers declare which rows cannot be selected.
- The list publishes one row's height as `--listbox-row`, derived from the same two values a row is,
  for anything that needs to convert a row count into a measurement.

component-collections: add Listbox.Simple, Listbox.Row and Listbox.Window

- `Listbox.Simple` takes `label`, `empty`, `summary`, `selectAll`, `narrowing`, `description`,
  `icon`, `groupBy`, `groupLabel` and `tall` alongside the root's props. Lists that need a different
  shape compose the parts it is built from.
- `Listbox.Row` renders a row from those parts. The root declares the row shape once, through
  `boxed` and the two indicator props, so a list cannot end up with a checkbox on some rows and a
  checkmark on others. A boxed list leaves selected rows unfilled by default, because the checkbox
  already indicates selection.
- `Listbox.Window` renders only the rows near the viewport and reserves the space for the rest. It
  measures one row rather than taking a height prop, and scrolls to the nearest edge the way a
  browser does. The machine is given a scroll handler only while a window is mounted. Without one it
  scrolls the highlighted row into view itself, which is correct for a fully rendered list.
- `tall` on `Listbox.Simple` does both jobs: it sets the window size and caps the list's height.

component-collections: add Transfer

- `Transfer` moves rows between two lists, for building a subset out of a longer list. One component
  rather than a namespace, because the layout is fixed. Callers needing a different shape compose
  two listboxes.
- Both sides keep the same width and height, so neither shifts as rows move between them. The
  minimum height is the space every row would occupy, derived from the row height each list
  publishes.
- Both controls are disabled while nothing on their side is selected. They are the only element a
  transfer adds and are drawn from this recipe rather than from the button package.
- Selection is cleared on the side a row leaves. A row that moved while still selected would be
  moved straight back by the next press of the opposite control.

component-collections: add StatusMatrix

- `StatusMatrix` renders a grid of status marks for one set of rows against one set of columns, such
  as services by region or controls by environment. It is built from the table's parts, so the
  bands, rules, scopes and scroll behaviour are the table's. It is one component rather than a
  namespace, because the layout is fixed.
- Required props are `rows`, `columns`, `cells`, `states` and `unmeasured`. Words are separate props
  (`caption`, `corner`, `rollup`, `legend`, `empty`, `cellLabel`) rather than a labels object,
  matching the rest of the package.
- Cells are sparse and indexed by row then column. A missing pair renders the `unmeasured` state
  instead of a blank cell, so an unrun check is not shown as a pass. Duplicate pairs resolve to the
  last entry, which is what an append-only export produces.
- The optional rollup column reduces each row to its worst state. Severity is derived from the
  state's tone, with a missing cell ranked above success and neutral and below warning.
- Every cell carries a screen-reader label from the state, or from `cellLabel` when the caller
  supplies one.
- Setting `onSelectCell` renders each cell as a button, including missing pairs. Without it the grid
  contains no focusable elements and adds no tab stops.
- Setting `legend` renders a labelled list of the states plus `unmeasured`.
- Hovering highlights the row and column under the pointer, including the rollup column, using
  `bg.subtle`. The highlight uses no palette, because the tone belongs to the mark.
- A state with no `mark` falls back to a filled dot, so two states sharing a tone are still
  rendered.
- The grid is sized to its content rather than the container and overflows the scroll box when it
  does not fit. Rows with `group` set are rendered as one `tbody` per heading.

component-collections: split the listbox root's props over a copy

- `Listbox.Root` splits its props through `splitEnumerable` from `@stealthscale/hooks`, the way
  every other root built on a state machine does, so a `key` React defines on its props in
  development never reaches the machine's splitter.
