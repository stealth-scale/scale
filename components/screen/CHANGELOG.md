# @stealthscale/component-screen

## 0.1.0

### Minor Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add `AppShell`, `Page`, `Section`, `Sidebar`, `Switcher` and `Toolbar`.
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

### Patch Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Turn on `barrels: true` in the conformance check.
  - Add a spec for every barrel.
- Updated dependencies [[`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`c8b2f1e`](https://github.com/stealth-scale/scale/commit/c8b2f1ea3cd9f92a5e80a0c275c69d5f4d5da8fd), [`8a79e78`](https://github.com/stealth-scale/scale/commit/8a79e7859434eddb7b0f9db73af2a0611c3aa716), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`b4823f8`](https://github.com/stealth-scale/scale/commit/b4823f832c93d3a70fe2935c9026cea7c36746bc), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`8a79e78`](https://github.com/stealth-scale/scale/commit/8a79e7859434eddb7b0f9db73af2a0611c3aa716), [`d577ce3`](https://github.com/stealth-scale/scale/commit/d577ce3a013b0af1f6cd2dce358f496382a58616), [`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/component-data@0.2.0
  - @stealthscale/component-disclosure@0.2.0
  - @stealthscale/component-forms@0.2.0
  - @stealthscale/component-modals@0.1.0
  - @stealthscale/component-navigation@0.2.0
  - @stealthscale/component-a11y@0.1.1
  - @stealthscale/component-actions@0.2.0
  - @stealthscale/component-layout@0.2.0
  - @stealthscale/component-primitives@0.2.0
  - @stealthscale/component-typography@0.2.0
  - @stealthscale/hooks@0.2.0
  - @stealthscale/provider-viewport@0.2.0
  - @stealthscale/theme@0.4.0

## 0.0.1

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
