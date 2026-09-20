---
"@stealthscale/testing-theme": minor
---

testing-theme: report a status the compiler emits no rule for

- `recipe.emitted` reports a recipe that offers a `status` axis without listing it under
  `staticCss`. The compiler emits a rule for a value it reads from a literal in an application's
  source, and a status is the one axis an application usually does not write: it hands over what a
  record, a validator or a server said. The class lands on the element with no rule behind it, and a
  component reporting an error draws in its default palette.
- Measured on the single-theme example, which writes three of the four statuses nowhere: the
  stylesheet emitted no rule for `success`, `warning` or `info` before, and all four after, at a
  cost of 0.19 kB over the wire.
- The check accepts `*` for a whole recipe and a list of values for one axis. It refuses `true`,
  which the compiler's own types offer for an axis and its compiler ignores, because a recipe
  written that way type-checks, emits nothing, and reads as though it had been handled.

testing-theme: add the distinctness, status and ramp checks and the report

- `distinct.surfaces`, `distinct.inks`, `distinct.lines` and `distinct.fills` report two consecutive
  steps closer than 0.01 in OKLab lightness, in either mode. The pairs of a palette are a quiet fill
  and the next, the solid and its hover, the ink and the muted one, and the line and its hover.
- `status.distinct` reports two status solids closer than 0.05 in OKLab.
- `ramp.monotonic` reports a ramp under `tokens.colors` whose lightness turns back between two
  steps, and `ramp.hue` a step that drifts more than 45 degrees from the ramp's median hue.
- `options.thresholds` takes `distinct`, `status` and `hue` beside the three ratios.
- `report(theme, options)` measures the margins of each class of pair, the lightness between
  consecutive steps, the distance between the statuses for typical vision and under protanopia,
  deuteranopia and tritanopia, and the steps outside sRGB. `formatReport` writes it as Markdown.
- `colorAt`, `rampsOf`, `outsideGamut`, `gamut`, `statusPairs`, `distance`, `distanceFor`,
  `simulated`, `written` and `DEFICIENCIES` are readers a theme specification can build its own
  cases on.

testing-theme: check the code family

- `contract.roles` reports a `code` family that leaves one of its ten kinds out, beside the three
  families it checked before.
