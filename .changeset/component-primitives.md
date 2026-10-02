---
"@stealthscale/component-primitives": minor
---

- Add `ScrollArea` over `@zag-js/scroll-area`: `Root`, `Viewport`, `Content`, `Scrollbar`, `Thumb`,
  `Corner`.
- Axes: `variant`, `size`, `scrolls`, `inset`, `fade`, `maxHeight`.
- Make the viewport a focusable `region` while it overflows, and add `focusable={false}` and
  `focusable="none"`.
- Measure overflow before the first paint.
- Add `--scroll-area-ring-offset` and `--scroll-area-ring-style` for composing recipes.
- Publish the preset under `./theme`.
- Add a specimen per component.
