# @stealthscale/component-tables

## 0.2.0

### Minor Changes

- [#44](https://github.com/stealth-scale/scale/pull/44) [`0008edc`](https://github.com/stealth-scale/scale/commit/0008edc058e654cd3b75c9bfe31b6596a7eab027) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add the package over `@tanstack/react-table` 9.2.4 and `@tanstack/react-virtual` 3.14.13.
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

### Patch Changes

- Updated dependencies [[`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`c8b2f1e`](https://github.com/stealth-scale/scale/commit/c8b2f1ea3cd9f92a5e80a0c275c69d5f4d5da8fd), [`e4af4b0`](https://github.com/stealth-scale/scale/commit/e4af4b04bef831df838cd56ee3401ce8a7222204), [`8a79e78`](https://github.com/stealth-scale/scale/commit/8a79e7859434eddb7b0f9db73af2a0611c3aa716), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`85466a2`](https://github.com/stealth-scale/scale/commit/85466a26f86bfb00efc2695d7b57aaedb8c87b08), [`b4823f8`](https://github.com/stealth-scale/scale/commit/b4823f832c93d3a70fe2935c9026cea7c36746bc), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`8a79e78`](https://github.com/stealth-scale/scale/commit/8a79e7859434eddb7b0f9db73af2a0611c3aa716), [`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/component-collections@0.1.0
  - @stealthscale/component-data@0.2.0
  - @stealthscale/component-disclosure@0.2.0
  - @stealthscale/component-feedback@0.2.0
  - @stealthscale/component-forms@0.2.0
  - @stealthscale/component-navigation@0.2.0
  - @stealthscale/component-a11y@0.1.1
  - @stealthscale/component-actions@0.2.0
  - @stealthscale/component-primitives@0.2.0
  - @stealthscale/hooks@0.2.0
  - @stealthscale/theme@0.4.0
  - @stealthscale/provider-locale@0.1.0
