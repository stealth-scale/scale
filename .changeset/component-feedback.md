---
"@stealthscale/component-feedback": minor
---

- Add `Alert`: `Root`, `Indicator`, `Content`, `Title`, `Description`, `Aside`, `CloseTrigger`.
- `Alert` axes: `status`, `variant`, `size`, `layout`, `radius`, `motion`, `edge`.
- Add `live` to `Alert`: `assertive`, `polite` or `off`.
- Render skeletons on the neutral fills, and stop their motion once loaded.
- Size skeleton text bars to one line with a `0.5lh` gap.
- Breaking: `EmptyState.Root` sizes are `sm`, `md` and `lg`.
- Add `Spinner` with `size`, `palette`, `stroke`, `track` and `effect`.
- Add `Loader` and `LoaderOverlay`.
- Add `Progress` over `@zag-js/progress`, with `striped`, `animated` and indeterminate `null`.
- Add `ProgressCircle`.
- Add `Toast` over `@zag-js/toast`, with `createToaster` and `Region`.
- Add `Meter` on `Progress`.
- Add `Marker` and `Segment` to `Progress` and `Meter`.
- Outline alerts and loading skeletons under forced colors.
- Peer on `@stealthscale/hooks`.
- Add a specimen per component, with examples.
