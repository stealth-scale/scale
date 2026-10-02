---
"@stealthscale/component-actions": minor
---

- Breaking: `Button` and `IconButton` take `palette` in place of `status`.
- Breaking: remove `effect="ripple"`. Every button ripples on press.
- Add `effect="pulse"`.
- Fill a button with `aria-pressed="true"` or `aria-current="page"`, in every look and under forced
  colors.
- Set the button's border width to `borderWidths.control`.
- Remove the press scale.
- Zero the inline padding of every `shape="square"` button.
- Add `Clipboard` over `@zag-js/clipboard`: `Root`, `Trigger`, `Indicator`, `Label`, `Input`,
  `ValueText`, `Consumer`.
- Breaking: `Clipboard.Root` takes no `translations`. `Clipboard.Trigger` takes `label` and
  `copiedLabel`.
- Add `DownloadTrigger` and `download` over `@zag-js/file-utils`.
- Add `ToggleGroup` over `@zag-js/toggle-group`, and depend on `component-layout`.
- Add `Swap` with `motion`, `lazyMount` and `unmountOnExit`.
- Add `ColorModeToggle`, and peer on `provider-color-mode`.
- Add a specimen per component, with examples.
