---
"@stealthscale/theme": minor
---

theme: publish statusEmitted

- `statusEmitted()` writes the `staticCss` entry a recipe with a `status` axis carries, so every
  status reaches an application's stylesheet whether the application writes one or not. Without it a
  component handed a status from a record, a validator or a server carries a class the compiler
  emitted no rule for.
- The values are listed rather than asked for with `true`, which the compiler's own types offer for
  an axis and its compiler ignores. They are read from `STATUSES`, so adding a status to the
  vocabulary reaches every recipe without one of them being edited.

theme: publish the safe-area spacing, the reading measure, and a condition for the highlight axis

- `spacing.safe.{top,right,bottom,left}` is the room a device keeps for a home indicator, a notch or
  a rounded corner. Only the browser knows how much, so these read `env()` and answer zero on every
  device that reserves nothing. Anything a page fixes to an edge of the screen reads them, because a
  recipe may not write `env()` itself.
- `sizes.prose` is the measure body text is read at, stated in characters rather than in rems. The
  line a reader follows without losing their place is counted in characters, so a measure in `ch`
  stays right at every type size a theme sets.
- `highlightVariants(highlights, when)` takes the condition to write the mark against. A listbox
  marks `_highlighted`, which is the row the keys are on, and a navigation marks `_currentPage`,
  which is the condition `aria-current="page"` sets. The helper wrote `_highlighted` alone before
  this, so a navigation restated the whole axis to change one selector.

theme: publish the field looks as layer styles and open a control's insets

- `layerStyles.field` names `outline` on `bg.panel`, `subtle` on `bg.muted`, and `flushed` with its
  bottom edge alone. A field recipe wrote those colours itself before this, so a theme that restated
  `fill.subtle` moved every control but a field.
- `fieldVariants()` writes the `variant` axis from those layer styles, beside `lookVariants()` and
  `flatVariants()`. It takes the looks a recipe names, or offers all three.
- `fieldStatusVariants()` writes the `status` axis of a field: the palette of the status, and the
  edge in the line family's member of the same name. It draws `border.error` for the error status,
  which is the token `field()`'s `_invalid` already draws, so the axis and the attribute agree.
- `field()` sets `minBlockSize` to `control.md` under `_touch`. A field is a replaced element and no
  pseudo-element renders on one, so the coarse-pointer target is the height rather than the box
  `touchTarget()` grows.
- `field()` sets the same `transitionProperty`, `transitionDuration` and `transitionTimingFunction`
  as `interactive()`, so a field and a button in one row settle together rather than one snapping.
- `controlSizes()` writes each inline inset through a custom property with the step as the fallback:
  `paddingInlineStart: var(--control-inset-start, {spacing.inset.<size>})`, and the same for the
  end. `CONTROL_INSET_START` and `CONTROL_INSET_END` name the two.
- A component that places something inside a control opens the side it needs by setting a property
  rather than by writing padding of its own. The control's own recipe stays the one rule writing its
  padding, so the two never race for the property and a theme that restyles the control keeps the
  room. Every recipe reading `controlSizes()` is groupable through this.
- Nothing moves for a control outside such a component. The property is unset and the fallback is
  the step the helper wrote before.

theme: add role tables for a ramp keyed by its own steps

- `paletteRoles(ramp, steps, darkRamp)` takes a table naming a step for each role in each mode, or a
  color stated outright, and reads the dark steps from a second ramp where a theme draws one.
  `ROLE_STEPS` is the foundation's own table.
- `foregrounds(ramp, steps, darkRamp)` and `borders(ramp, steps, darkRamp)` take a table the same
  way, with `FOREGROUND_STEPS` and `BORDER_STEPS` as the foundation's.
- `surfaces(ramp, steps, darkRamp)` draws the `bg` family from steps of a neutral ramp, for a theme
  whose surfaces sit on its own scale rather than at a distance from the page.
- `ramp(keys, values)` keys a transcribed ramp by its own step names, and
  `stepped(ramp, light, dark, darkRamp)` writes one color as a reference into a step in each mode.
- `contrast()` and `luminance()` read an OKLCH color whose hue is `none`.
- `linear(color)` converts a color to linear sRGB and `oklab(color)` to OKLab, unclamped, for a
  check that measures a distance rather than a ratio.
- `Application.themes` is optional. An application that states no theme draws the foundation alone.
- A bound element carries `data-recipe` only where `process.env.NODE_ENV` is not `production`, so a
  production page carries no attribute the testing kit alone reads.

theme: publish filledColumns

- `filledColumns()` writes the `columns` axis keyed `fill-<measure>`, beside `fittedColumns()`. The
  template is `repeat(auto-fill, …)`, so a row with fewer entries than columns keeps the empty
  columns and an entry alone on a row keeps its measure.

theme: publish SystemStyleObject from the authoring entry

- A recipe that builds a value by hand names the type from `@stealthscale/theme/authoring`, without
  importing the runtime entry. A preset loaded by the compiler runs without a browser, and the
  runtime entry pulls the provider and React behind it.

theme: publish inked, drawn, hues, scaleOf, stepOf, mixed and stated from the authoring entry

- `inked()` draws the three families from a page and an ink stated for each mode: every surface a
  fixed distance from the page in the page's own tint, every line the page mixed towards the ink,
  and every faded ink the ink mixed towards the page. A theme drawn from a palette adds no grey of
  its own.
- `drawn()` draws a hue palette from one color over those pages, for both modes or one color per
  mode: the solid is the color, every quiet fill is the page tinted towards it and held a least
  distance from the page, the ink, the line and the ring are the color pushed towards the mode's ink
  until each stands far enough from the page, the text on the solid is whichever of the ink and the
  page reads better on it, and the hovers are lifted towards that text. A fill read from a ramp can
  land darker than a dark page the palette puts at a third of the way up, and read as a stain. A
  fill tinted from the page stays on the page whatever the page is.
- `hues()` draws every hue palette that way: each hue the theme states from its color, the grey from
  the ink, and every other from the foundation's hue at the steps the foundation places its solids
  on.
- `scaleOf()` draws a ramp in the hue and at the chroma of a color, `stepOf()` writes one step of a
  ramp, `mixed()` mixes two colors in OKLab, and `stated()` writes a color outright in both modes.
