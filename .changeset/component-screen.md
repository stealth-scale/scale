---
"@stealthscale/component-screen": minor
---

- Add `AppShell`, `Page`, `Section`, `Sidebar`, `Switcher` and `Toolbar`.
- Fold every screen component on its own width through `data-narrow`.
- Add `AppShell` panels with `collapse` and `folds`, and `useAppShellPanel`, `useNearestPanel` and
  `useOverlaid`.
- `AppShell` axes: `scroll`, `variant`, `divided`.
- Add `AppShell.Rail`, `AppShell.Section`, panel `width` and `railWidth`, `foldsBelow`, and
  `WINDOW_HEIGHT`.
- Add `AppShell.Status`, a status bar at the foot of the shell.
- Add `when` to `AppShell.Footer`, and render `AppShell.Trigger` as the library's button.
- Scroll `AppShell.Body`, `AppShell.Main`, panels and `Sidebar.Content` in `ScrollArea`.
- Breaking: `AppShell.Body` and `Sidebar.Content` take no `as`.
- Add `Page.Breadcrumbs`, `Page.TabList`, `Page.Tab`, `Page.When`, `Page.Picker` and `Page.Aside`.
- `Page` axes: `align`, `divided`, `gutter`, `measure`, `size`.
- Lay a page's body beside `Page.Aside`, with `folds` and `sticky`.
- `Section` axes: `annotated`, `size`, `variant`, and add `Section.Body bleed`.
- Fold actions into a More menu by priority in `Toolbar`, `Page.Actions` and `Section.Actions`.
- Breaking: remove `Toolbar.Folded`, `Page.Folded` and `Section.Folded`. `Toolbar.Action` takes no
  `as`.
- Add `Toolbar.Link` and `Toolbar.Group`.
- Render `SearchInput` in `Toolbar.Search` and `Sidebar.Search`.
- Breaking: `Toolbar.Search` takes no `opened` and no children.
- Filter a sidebar from `Sidebar.Search`, and add `Sidebar.Empty`.
- Add `variant="subtle"` to `Sidebar`, and derive a sidebar's rail and size from its panel.
- Render `Switcher` from `items`, with `placement`, the button's looks and the eight palettes.
- Breaking: remove `Switcher.Content`, `Switcher.Option` and `Switcher.Check`. Compose `Menu` parts
  instead.
- Breaking: `Switcher` `placement` defaults to `alone` and `variant` to `ghost`.
- Add `ActionBar`.
- Add `Splitter` over `@zag-js/splitter`.
- Add `FloatingPanel` over `@zag-js/floating-panel`.
- Read `sizes.sidebar`, `sizes.aside`, `sizes.rail` and `borderWidths.hairline` from the theme.
- Peer on `component-data`, `component-forms`, `component-modals` and `component-primitives`.
- Add a specimen per component.
