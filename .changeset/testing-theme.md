---
"@stealthscale/testing-theme": minor
---

- Find a slot by its class before its `data-part` in `slotElement`.
- Add thresholds `tertiary`, `label`, `hairline` and `identity`, and raise `distinct` to 0.02.
- Add the `distinct`, `status`, `ramp` and `series` checks.
- Add `report(theme, options)` and `formatReport`.
- Export `colorAt`, `rampsOf`, `outsideGamut`, `gamut`, `statusPairs`, `distance`, `distanceFor`,
  `simulated`, `written` and `DEFICIENCIES`.
- Add `recipe.emitted` and `recipe.order`.
- Check the `code` family, the `chart` role and the `series` family in `contract.roles`.
- Accept CSS system colors, `contrast-color(var(--x))` and `series.1` to `series.8` in
  `recipe.colors`.
- Breaking: remove `recipe.subtle`.
- Reword three messages.
