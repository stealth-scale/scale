# @stealthscale/component-modals

## 0.1.0

### Minor Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add `Command`: `Root`, `Input`, `List`, `Empty`, with actions passed as data.
  - `Command` axes: `size`, `palette`.
  - Highlight the first match as the reader types.
  - Scroll the palette's rows in the listbox's scroll area.
  - Add `Dialog` over `@zag-js/dialog`: `Root`, `Trigger`, `Backdrop`, `Positioner`, `Content`,
    `Header`, `Title`, `Description`, `Body`, `Footer`, `CloseTrigger`, `ActionTrigger`.
  - `Dialog` axes: `size`, `placement`, `scrollBehavior`, `variant`.
  - Render the dialog body in a `ScrollArea`.
  - Add `Drawer` on the dialog machine with `placement`, `size` and `contained`.
  - Add `Tour` over `@zag-js/tour`: `useTour`, `Root` and thirteen parts.
  - `Tour` axes: `size`, `variant`, `palette`.
  - Add `createOverlay(Component)`, which opens a dialog or a drawer from code and resolves with its
    result.
  - Peer on `@stealthscale/component-primitives`.
  - Add a specimen per component.

### Patch Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Turn on `barrels: true` in the conformance check.
  - Add a spec for every barrel.
- Updated dependencies [[`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf), [`e4af4b0`](https://github.com/stealth-scale/scale/commit/e4af4b04bef831df838cd56ee3401ce8a7222204), [`8a79e78`](https://github.com/stealth-scale/scale/commit/8a79e7859434eddb7b0f9db73af2a0611c3aa716), [`699ee75`](https://github.com/stealth-scale/scale/commit/699ee7513a1df84d019c9310a8131a6700ba5bd4), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/component-collections@0.1.0
  - @stealthscale/component-primitives@0.2.0
  - @stealthscale/hooks@0.2.0
  - @stealthscale/theme@0.4.0

## 0.0.1

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
