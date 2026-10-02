---
"@stealthscale/component-collections": minor
---

- Add `Table`: `Scroller`, `Root`, `ColumnGroup`, `Column`, `Caption`, `Header`, `Body`, `Footer`,
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
