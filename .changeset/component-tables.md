---
"@stealthscale/component-tables": minor
---

- Add the package over `@tanstack/react-table` 9.2.4 and `@tanstack/react-virtual` 3.14.13.
- Add `DataTable`: `useDataTable`, `createColumnHelper`, `Root` and `Table`.
- Register all 17 stock features of TanStack Table 9 with their row models, and every stock sort,
  filter and aggregation function: 6, 22 and 11.
- Add `selectColumn`, `expandColumn` and `pinColumn`.
- Sort from a column's header, with `aria-sort` on the sorted column and a polite announcement.
- Pin columns to the start and the end, and lay out a sized table at its columns' sizes.
- Resize a column by pointer and by keys through a separator in its header.
- Pin rows to the top and the bottom of the body.
- Render TanStack's cell spans across rows and columns.
- Render column footers, such as totals from `column.getAggregationValue()`.
- Render a row-header column without a footer as an empty data cell in the footer row.
- Drop the rule of a cell whose rows span ends on the body's last row before a footer.
- Add `DataTable.Search` over TanStack's global filter.
- Announce the count of matching rows after a change of the filters, through `filteredAnnouncement`.
- Add `columnActions` to `DataTable.Table`, the controls a column's header renders beside its name.
- Add `DataTable.ColumnFilter` with `text`, `select` and `range` filters from `meta.filter`, over
  TanStack's faceting.
- Add `DataTable.ColumnMenu` with the sort, grouping, pin and hide actions that change a column, and
  `actionIndicators` for each action's glyph.
- Add `DataTable.ColumnManager`, which orders, shows and hides columns in a `Sortable` list.
- Add `DataTable.Pagination` over the navigation `Pagination` and `DataTable.PageSize`.
- Export TanStack's `SortingState`, `PaginationState`, `ColumnFiltersState`, `ExpandedState` and
  `GroupingState` types.
- Add `windowed`, `estimateSize`, `overscan` and `onEndReached` to `DataTable.Table`, over
  `@tanstack/react-virtual`, with `aria-rowcount` and `aria-rowindex`.
- Move focus to a pin toggle's new place after its row moves.
- Keep a row with a detail button, a pin toggle, a row toggle or a checkbox as tall as a row of
  text.
- Keep a header with the select column's checkbox as tall as a header of text.
- Render a table that states `getSubRows` or groups its rows as a `treegrid` with `aria-level`,
  `aria-posinset`, `aria-setsize` and `aria-expanded` on each row.
- Move between the rows of a `treegrid` with the arrow keys, Home and End, and open and close a row
  with the arrows, Enter and Space.
- Add `expandIndicator`, `expandLabel`, `collapseLabel` and `loadingLabel` to `DataTable.Table`.
- Render a group row's value, toggle and record count, and its aggregated cells through
  `aggregatedCell`.
- Render a loader under an open row whose sub-rows have not arrived.
- Check a row's box while every row under it is selected, and partly check it while some are.
- Default `enableGrouping` to `false` in `useDataTable`.
- Add `DataTable.pivot`, which returns the columns, rows and row ids of a cross-tab of records for
  `useDataTable`.
- Aggregate a pivot's cells and totals from the records with `sum`, `average`, `min`, `max`, `count`
  or a function of the records.
- Export the `Pivot`, `PivotOptions`, `PivotAggregate`, `PivotAggregator`, `PivotCell`,
  `PivotColumn`, `PivotField` and `PivotRow` types.
- Add `grid` to `DataTable.Table`, which renders a `grid` over TanStack's cell selection with one
  tab stop.
- Move and extend a grid's selection with the arrow keys, Home, End, Page Up, Page Down, Control or
  Meta with A, and Escape.
- Copy a grid's selected cells as tab-separated text.
- Edit a grid's cells in place through a column's `meta.edit`, with `editor` and `validate`.
- Add `onCellEdit`, `editLabel`, `unsaved` and `unsavedLabel` to `DataTable.Table`.
- Export the `CellEdit`, `EditorProps` and `CellEditEvent` types.
- Default `autoResetCellSelection` to `false` in `useDataTable`.
- Leave the select, expand and pin columns out of a grid's cell selection.
- Take no tab stop on the scroller of a grid or a `treegrid`.
- Add a specimen with examples.
