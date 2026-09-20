---
"@stealthscale/theme": minor
---

theme: draw a theme from a statement

- `defineTheme` takes a statement on nine axes: `colors`, `faces`, `type`, `metrics`, `motion`,
  `shape`, `depth`, `looks` and the recipe extensions. A root theme states the page and the ink of
  each mode and a `primary`. It may also state the other intents and the code inks, ask for the hue
  palettes with `hues`, keep a solid as stated with `keep`, and restate the ratios it draws to with
  `ratios`. Every surface, ink, line, palette role and status is drawn from that. Every other axis
  is optional, and a token stated outright under `tokens` or `semanticTokens` is merged over what
  the axes drew. A derived theme states what differs over its parent.
- The engine is published for an application that draws a palette of its own: `drawColors`,
  `drawAxes`, `inked`, `drawn`, `intents`, `hues`, `coded`, `canonical`, `ladderOf`, `typeScale`,
  `metrics`, `shape`, `depth` and `faces`, with `FOUNDATION`, `PAGES`, `RATIOS`, `HAIRLINES`,
  `STATUS_HUES` and `RAMPS` beside them, and `lightened`, `polar`, `lightnessOf`, `inGamut` and
  `referenced` for a statement's own arithmetic. `drawAxes` typed over `RootAxes` returns
  `DrawnRoot`, in which every color the contract names is present, and the foundation's own preset
  is that statement drawn once.
- `axis(values, write)` writes an axis helper from every value an axis can take and the styles one
  value states: called with nothing it writes every value, called with a list it writes the values
  named. Every helper that offers a list is written with it, so a recipe author writes a helper of
  their own the same way.
- A derived theme states any part of an axis, `colors` included. The part is merged over its
  parent's statement and the axis is drawn again from the whole. A theme that restates one corner
  keeps its parent's other corners, one that restates the primary keeps its parent's pages, and one
  that restates the density scales its parent's bases. `Theme` carries the merged axes as `axes`,
  and `DerivedAxes` and `DerivedColors` type what a derived theme states.
- Every control, icon, tag, inset and gap a recipe reads is multiplied by the `--density` property,
  which the foundation registers at one and the `data-density` attribute sets to 0.9 for `compact`
  and 1.1 for `comfortable`. A subtree marked compact is drawn tighter inside any theme, over the
  theme's own density, and `touchTarget()` holds its area at a medium control's box or 24 CSS
  pixels, whichever is larger. `dense()` is published for a recipe reading a scaled length the
  helpers do not cover.
- A `motion` axis: `pace`, a multiplier on every pace, and the curves `press`, `enter`, `leave` and
  `move`. `tempo()` draws them into `durations.press/enter/leave/move` and the easings of the same
  names, `interactive()`, `row()` and `field()` transition at `press`, and every entering and
  leaving animation style reads `enter` or `leave`, so a theme that is snappier or eases differently
  restates one number or one curve.
- The `type` axis takes the roles: the `heading` role's `weight`, `tracking` and `leading`, the
  `label` role's `weight` and `tracking`, and the `body` role's `leading`, each over every step of
  the role. `roles()` draws the six text roles, `typeScale()` draws them beside the sizes, and
  `Type` extends `Roles`.
- The `shape` axis takes the ring and the corners: `ring.width` and `ring.offset` draw
  `borderWidths.ring` and `spacing.ring`, which the global styles write into the properties the
  focus utility reads, and `l1`, `l2` or `l3` stated outright takes that corner off the concentric
  ladder. The `metrics` axis takes `narrow`, `wide` and `prose`, the measures a page and a column of
  text are read at.
- `colors.keep` takes a list of intents beside `true`, so a theme keeps one solid as the brand drew
  it and lets the rest move. `colors.ratios` takes `hairline`, the ratio the structural line stands
  at. `colors.chroma` is the share of the page's chroma a raised surface and a well keep, for a
  theme whose page is saturated enough that every surface in its tint reads as one wall of color.
- A status a theme leaves unstated is drawn at the chroma of the brand's most saturated intent. That
  is the primary, or a stated accent, floored at 0.1. A muted brand's statuses no longer shout over
  it. A grey brand's still read as colors.
- The statuses are drawn in turn rather than each alone. One lands too close where it falls within
  0.05 of a solid already drawn, or within 0.12 of one of its own hue. Such a status moves in
  lightness until it clears. It may not bleach past half its chroma to get there. A red brand's
  error is now a different button from its primary. An error and a warning are no longer one badge.
- WCAG AA is a floor `colors.ratios` may raise and never lower. `FLOOR` fixes 4.5:1 for text, labels
  and the tertiary ink and 3:1 for a boundary, `ratiosOf()` holds a stated ratio at it, and the
  gate's `thresholdsOf` holds a specification's thresholds at the same numbers. A theme whose colors
  cannot reach the floor is reported rather than measured against a lower one.
- A solid's label falls back to black or white where neither the theme's ink nor its page carries
  it. The worse of those two clears 4.58:1 on any color there is, so a brand color no longer moves
  in lightness to carry a label and moves only to stand from the page. Measured on Dusk, whose
  primary label went from 3.01:1 to 5.32:1 with the coral untouched.
- A ratio is measured on the color a display shows. A linear channel outside sRGB is clipped before
  the luminance is weighted, the way a display clips it, so a pair can no longer clear a threshold
  in the engine and fail it on the screen. The colors themselves are written as stated, so a wider
  display still shows them.
- A color is refused with the value in the message where its fields are not numbers, where its hex
  is a length CSS never writes, or where it carries transparency. `oklch()` refuses a coordinate
  that is not finite. `lightened()` bounds its search. A malformed color now names itself in an
  error rather than hanging the build.
- The code inks are drawn to the text ratio on the page and the panel as well as to their distance
  from the page, and the gate measures every one of them. A keyword is text a reader reads, and a
  distance in lightness is not a contrast ratio.
- The `label` role takes `tracking`. A role is written into every size variant and the compiler
  layers variants over base, so tracking a theme wrote in a recipe extension's `base` never reached
  a control that has a size.
- The density is applied where a length is consumed rather than inside the token. `dense(length)`
  multiplies by `var(--density, 1)` and every size helper reads through it. A custom property
  inherits the value it computed where it was declared, so a token carrying the multiplier was fixed
  at the root's density and a subtree that set another density inherited the same length. Measured
  in Chromium: a medium button is 36px, 32.39px inside a compact subtree and 39.59px inside a
  comfortable one.
- A theme's rules stop at the nearest theme boundary. The scope selector excludes anything under a
  theme nested inside it, so a button inside Ink inside Regatta is drawn in Ink's weight, tracking
  and corners rather than keeping Regatta's capitals.
- A partial look is merged into what the axes drew rather than spread over it, at every level, so a
  theme restating one heading step keeps the seven its role drew for the siblings.
- `colors.keep` is honoured through the whole solver. A status the theme asked to keep is not moved
  to clear a collision either, and the gate reports what it collides with.
- The plain fill marks a press with a fill rather than by inking the text in the palette's solid,
  which dropped a pressed plain button from 11.78:1 to 3.27:1. The subtle field carries the
  control's boundary at its block end, because an empty one has no text and its fill stood at 1.39:1
  from the panel around it.
- `ladderOf(side, options)` takes the draw options rather than a ratio, `HAIRLINES` holds the two
  quiet lines alone, and `atChroma` is published beside `lightened`.
- The global styles draw a selection and a native control's own accent in the accent palette, so a
  theme that states an accent moves the text a reader drags over and the tick inside a checkbox the
  browser draws itself.
- `statusVariants()`, `fieldStatusVariants()` and `statusEmitted()` take the statuses a recipe
  offers, so a component that reports two of them emits rules for two. A theme's recipe extension
  refuses `defaultVariants`, `jsx` and `staticCss`, which the build cannot scope to one theme.
- Surfaces rise, wells sink and fills lift. `bg.panel` and `bg.popover` are lighter than the page in
  both modes, `bg.subtle`, `bg.muted` and `bg.emphasized` are darker than the page in both modes,
  and a palette's three fills step towards the ink and above the popover. Every palette's fills sit
  at one lightness and differ by hue alone. Each step goes only as far as a secondary ink still
  reads on it, and the three steps of a ladder compress together. The dark page of the foundation
  moves from 13 to 15 so three wells fit under it.
- The faded inks and the lines are drawn to ratios rather than to mix shares: `fg.muted` at 7:1 on
  every surface, `fg.subtle` at 4.5:1, `border` at 1.45:1, `border.emphasized` at 3:1, a palette's
  `fg` at 7:1 on the page and its fills, its `border` and `focusRing` at 3:1 on every surface, and
  its `contrast` at 4.5:1 on its solid and on its hover. Consecutive lines keep a step apart. A
  solid that fails to stand from the page or to carry its label moves in lightness with its hue and
  chroma kept, unless the theme says `keep`. A theme whose stated ink cannot reach a ratio states
  `ratios`.
- A hovered solid moves a step in lightness away from its label and a hovered line a step towards
  the ink, so a hover is seen on every solid and a label reads better under the pointer.
- The intents draw from colors rather than from hue names. `secondary` defaults to the canonical
  purple, `accent` to the primary by reference, `neutral` to the ink, and each status to the
  canonical hue of its name. `fg.link` and `border.focus` read the accent. The foundation's own
  `accent` is its primary and its `info` is cyan.
- The contract has ten roles: `bg` and `fg.muted` leave a palette, `bg.disabled` and `fg.disabled`
  leave the families, and the eleven hue palettes are optional. `ThemeColors` types them `Partial`
  and a theme draws them with `colors.hues`.
- Three semantic stroke widths and five layout sizes: `borderWidths.hairline`,
  `borderWidths.control` and `borderWidths.indicator`, and `sizes.sidebar`, `sizes.aside`,
  `sizes.rail`, `sizes.page.narrow` and `sizes.page.wide`. `field()` draws its edge in
  `border.emphasized` at the control's width and darkens it to `fg.subtle` under a pointer. The
  three field looks draw the same edge and restate the hover, invalid and read-only rules, because
  the compiler layers a recipe's variants over its base and a look that wrote its edge alone left
  the outlined input with the hairline, no hover and no red edge when invalid. `surface()`,
  `floating()` and `divider()` draw hairlines, the outlined and surface looks draw at the control's
  width, and the indicators at the indicator's. `toneVariants` offers `subtle`.
- `scales/` is `draw/`, the contrast measurement is in the same directory, and `RATIOS` for the
  aspect ratios is `ASPECT_RATIOS`. Leaving: `backgrounds`, `surfaces`, `foregrounds`, `borders`,
  `stepped`, `ramp`, `neutralFills`, `paletteRoles`, `paletteAlias`, `palettes`, `families`,
  `ROLE_STEPS`, `FOREGROUND_STEPS`, `BORDER_STEPS`, `PageLightness`, `Palettes`, `PaletteAliases`,
  `Coded`, `deepMerge`, `contract`, `ContractedVariant`, `RootThemeConfig`, `DerivedThemeConfig` and
  `ThemeConfig`. A theme transcribed from another system's steps states its tokens outright under
  `tokens` and `semanticTokens`.

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
  a rounded corner. Only the browser knows how much. These read `env()` and answer zero on every
  device that reserves nothing. A recipe may not write `env()` itself. Anything a page fixes to an
  edge of the screen reads these tokens instead.
- `sizes.prose` is the measure body text is read at, stated in characters rather than in rems. The
  line a reader follows without losing their place is counted in characters. A measure in `ch` stays
  right at every type size a theme sets.
- `highlightVariants(highlights, when)` takes the condition to write the mark against. A listbox
  marks `_highlighted`: the row the keys are on. A navigation marks `_currentPage`: the condition
  `aria-current="page"` sets. The helper wrote `_highlighted` alone before this. A navigation
  restated the whole axis to change one selector.

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
  pseudo-element renders on one. The coarse-pointer target is the height rather than the box
  `touchTarget()` grows.
- `field()` sets the same `transitionProperty`, `transitionDuration` and `transitionTimingFunction`
  as `interactive()`. A field and a button in one row settle together rather than one snapping.
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
  on. An orange and a yellow the theme does not state are drawn a step lighter by day, at 500 rather
  than 600. A warm hue at the step a blue is drawn at reads as brown, and a warning drawn in it read
  as earth.
- `scaleOf()` draws a ramp in the hue and at the chroma of a color, `stepOf()` writes one step of a
  ramp, `mixed()` mixes two colors in OKLab, and `stated()` writes a color outright in both modes.

theme: hold a control still under a press

- `interactive()` no longer scales the box to 98 percent under `_active`, and drops the rules that
  undid the scale for a disabled control and for a reader who asked for less motion. A press is read
  from the pressed fill, a ripple and an elevation dropping, and every control that shares the
  fragment holds its box still.

theme: set the headings, the surfaces and the highlight the way a page is read

- A heading role states its own leading and tracking: a section heading at the text's own leading
  and no tracking, a page heading a little closer, and a hero heading tight and tracked in. Every
  heading was set tight before this, which read as a hero at every size.
- The quiet surfaces step two, four and seven points below a light page, where they stepped two,
  seven and eleven, so a muted fill on paper is a light grey rather than a mid one. A dark page
  keeps its steps.
- The `tint` highlight is the muted fill rather than the subtle one, because a list is as often
  drawn on a subtle surface as on the page, and a subtle mark on a subtle surface marks nothing.
- `inked()` fades a muted ink two fifths of the way to the page and a subtle one nearly two thirds,
  and keeps every line closer to the page than before, so a theme drawn from a palette reads its
  secondary lines and hairlines the way the foundation does.

theme: add the code family and draw it with coded()

- `ThemeColors` gains `code`, ten inks a passage of code is set in: `keyword`, `string`, `number`,
  `function`, `type`, `tag`, `attr`, `comment`, `inserted` and `deleted`. `CODE` lists them and
  every theme states them.
- `coded(modes, colors)` draws the family from one color per kind, or from the foundation's hues
  where a theme names none, each pushed 0.58 in OKLab lightness from the page, and the comment from
  the muted ink. Every default ink measures at least seven to one against the foundation's pages in
  both modes.

theme: state a shadow's mode in its ink as light-dark()

- `shadows()` writes each shadow once, with `light-dark()` in the color position, so a shadow is
  cast in the mode of the element it falls under the way every color is compiled.
- `referenced()` is exported from the color scale, and the ink scale reads it rather than keeping a
  copy.

theme: reach every field state from the surface that draws it

- `wrappedField()` and `wrappedFieldVariants()` draw a field whose surface is a box around the
  control, reading each state from the control through it. `:read-only` matches every element that
  is not editable, a box among them, so an outlined textarea rested on the read-only fill whatever
  its control was doing and neither reddened when invalid nor dimmed when disabled.
- A highlighted row carries a line in the system's `Highlight` color where the display has replaced
  every fill. A forced-color mode paints every background from one palette, so a tint and a solid
  took the same color as the rows around them.
- The plain fill marks a press with a fill rather than by inking the text in the palette's solid,
  which dropped a pressed plain button to 3.27:1 at 12.6 pixels.
- The ripple is clipped to its own box rather than by hiding the control's overflow. Hiding it also
  clipped the pseudo-element a coarse pointer's target is drawn with, so an xs button declared a
  forty-pixel area around its thirty-two-pixel box and a press two pixels above the box reached
  nothing.

theme: light the rim of every raised surface after dark

- Every height of the shadow scale carries a one-pixel inset rim inside its edge, transparent by day
  and white at twelve percent after dark. A shadow cannot fall on a dark page, so a raised card, a
  menu and a popover had no edge to be told from the page by. The rim lights the edge from inside.
  The two inner shadows carry none.
