---
"@stealthscale/component-modals": minor
---

- Add `Command`: `Root`, `Input`, `List`, `Empty`, with actions passed as data.
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
