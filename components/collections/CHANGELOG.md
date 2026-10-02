# @stealthscale/component-collections

## 0.1.0

### Minor Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`e4af4b0`](https://github.com/stealth-scale/scale/commit/e4af4b04bef831df838cd56ee3401ce8a7222204) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add `Table`: `Scroller`, `Root`, `ColumnGroup`, `Column`, `Caption`, `Header`, `Body`, `Footer`,
    `Row`, `ColumnHeader`, `Sorter`, `RowHeader`, `Cell`.
  - `Table` axes: `variant`, `size`, `align`, `layout`, `radius`, `striped`, `rules`, `interactive`,
    `stickyHeader`, `stickyColumn`, `palette`.
  - Breaking: remove `ruled`, and split `variant` (`plain`, `surface`) from `rules` (`rows`, `all`,
    `none`).
  - Breaking: `align` takes `start`, `center` and `end`.
  - Add `Table.Simple`.
  - Scroll `Table.Scroller` in `ScrollArea`, and add `focusable` and `viewportRef`.
  - Add `Listbox` over `@zag-js/listbox`, with `useListCollection`, `useGridCollection` and
    `useFilter`.
  - `Listbox` axes: `highlight`, `radius`, `size`, `variant`, `columns`, `orientation`, `selected`,
    `palette`, `effect`.
  - Add `Listbox.Empty`, `SelectAll`, `ItemCheckbox`, `ItemDescription`, `ItemLines`, `Simple`, `Row`
    and `Window`.
  - Add `clearIndicator`, `clearLabel` and `autoHighlight` to `Listbox.Input`.
  - Scroll `Listbox.Content` in `ScrollArea`, with the viewport as the `listbox` element.
  - Breaking: `Listbox.Content` takes no `as`.
  - Fill a selected listbox row with `Highlight` under forced colors.
  - Add `Transfer` with `palette`.
  - Add `StatusMatrix`.
  - Add `DataList` with `orientation`, `size`, `variant` and `divided`.
  - Add `Timeline` with `rail`, `size`, `variant`, `palette` and `ongoing`.
  - Add `TreeView` over `@zag-js/tree-view`, and export `TreeCollection`.
  - Add `Sortable` over `@dnd-kit/react` 0.5.0: `Root`, `Board`, `List`, `Items`, `Item`, `Handle`,
    `ItemContent`, `Empty`, `useMove`.
  - `Sortable` axis: `variant` (`card`, `plain`).
  - Paint a table row's stripe, hover and selected fills from `--table-row-fill`, which a sticky row
    header paints over the panel.
  - Read a table row's rule ink from `--table-rule` and its rule width from `--table-rule-width`.
  - Pad a table cell inline by `--table-cell-inset`, which the size axis sets.
  - Leave a selected row out of a striped table's stripe.
  - Write a selected row's cells and rules in `HighlightText` under forced colors, and keep its
    `Highlight` under the pointer.
  - Add `SwipeActions`: `Root`, `Content`, `Actions`, `Action` and `settleSwipe`.
  - Depend on `component-actions`, and peer on `component-primitives` and `react-dom`.
  - Add a specimen per component.

### Patch Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Turn on `barrels: true` in the conformance check.
  - Add a spec for every barrel.
- Updated dependencies [[`c8b2f1e`](https://github.com/stealth-scale/scale/commit/c8b2f1ea3cd9f92a5e80a0c275c69d5f4d5da8fd), [`8a79e78`](https://github.com/stealth-scale/scale/commit/8a79e7859434eddb7b0f9db73af2a0611c3aa716), [`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/component-actions@0.2.0
  - @stealthscale/component-primitives@0.2.0
  - @stealthscale/hooks@0.2.0
  - @stealthscale/theme@0.4.0

## 0.0.1

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
