---
"@stealthscale/component-a11y": patch
---

- Type `RovingFocus.Item`'s `ref` as `Ref<HTMLElement>`.
- Write an `id` on a roving item only when the caller passes one.
- Mark the item with the tab stop `data-stop` instead of `data-active`.
- Fix the focused position of `SkipNav.Link` and `VisuallyHidden focusable`.
- Throw a named error for `RovingFocus.Item` outside `RovingFocus.Root`.
- Add a specimen per component.
