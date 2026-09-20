---
"@stealthscale/testing-theme": minor
---

testing-theme: hold a theme to the ladders and the ratios it is drawn to

- The thresholds gain `tertiary` at 4.5, `label` at 4.5, `hairline` at 1.45 and `identity` at 30
  degrees, and `distinct` rises from 0.01 to 0.02.
- `contrast.text` measures `fg.subtle` on every surface at the tertiary ratio, each palette's
  `contrast` on its solid and its hover at the label ratio, and each palette's `fg` on the page, the
  raised surfaces and its fills. `contrast.boundary` measures `border.emphasized` on the page, the
  panel, the popover and the first well, `border` on the page and the panel at the hairline ratio,
  and each palette's solid and lines on the page and the panel.
- `distinct.surfaces` pairs the page with the panel and with the first well, the raised surfaces
  with the first well, and each well with the next. `distinct.fills` drops the ink pair, whose role
  left the palette, and adds the resting fill against the page, the panel and the popover.
- `status.distinct` holds each status apart from the primary and the neutral as well as from the
  other statuses. `status.identity` reports a status solid more than thirty degrees of hue from the
  canonical hue of its status, or a grey.
- `recipe.subtle` is gone. `fg.subtle` is tertiary text at AA.
- The palette fixture is drawn from the foundation's blue over the foundation's pages, and a case
  that follows a reference through a role states the reference itself.

testing-theme: report a status the compiler emits no rule for

- `recipe.emitted` reports a recipe that offers a `status` axis without listing it under
  `staticCss`. The compiler emits a rule for a value it reads from a literal in an application's
  source, and a status is the one axis an application usually does not write: it hands over what a
  record, a validator or a server said. The class is written on the element with no rule behind it,
  and a component reporting an error draws in its default palette.
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

testing-theme: read a recipe's styles from the styles rather than from every key

- The walker descends a variant's axis and value by name rather than as styles. A value is free to
  be called anything, and some of those names are also properties the compiler resolves. A highlight
  called `fill` read as the SVG property of that name, so `outlineStyle: "solid"` under it was
  reported as a color token no theme defines.
- A recipe may name a CSS system color. A forced-color mode replaces every color an author writes,
  so a recipe naming one is the only way a marked row or a switch's thumb is still seen there.
