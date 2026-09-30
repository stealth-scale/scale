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
- Scroll `Table.Scroller` in `ScrollArea`, and add `focusable`.
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
- Depend on `component-actions`, and peer on `component-primitives` and `react-dom`.
- Add a specimen per component.
