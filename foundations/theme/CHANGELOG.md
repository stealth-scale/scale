# @stealthscale/theme

## 0.4.0

### Minor Changes

- [#32](https://github.com/stealth-scale/scale/pull/32) [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - theme: draw a theme from a statement
  
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
  
  theme: publish the breakpoints as the foundation states them
  
  - `breakpoints` maps each breakpoint above `base` to the length it starts at, `sm` to `40rem`, from
    the same statement the compiler builds its conditions from. A reader of the widths went through
    `token` before, and `token` keeps the whole token map in the bundle, 32 kB of values for the five
    a page reads. The catalogue's library chunk is 163 kB rather than 195, 50 kB rather than 57
    gzipped.

### Patch Changes

- Updated dependencies [[`66681c2`](https://github.com/stealth-scale/scale/commit/66681c2fa7e2c8a98a41090d225423ee0c8b04cb)]:
  - @stealthscale/pandacss-naming@0.2.1

## 0.3.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - theme: keep no value's class on a slot for a compound
  
  - A slot carries the variant classes of the values that style it, and no other. A compound keeps no
    value's class on the slot it styles, because the compiler emits its styles under the compound's
    own class, which the runtime writes where the selection matches. A small outline card with a
    compound on its content carried `card__content--outline` with no rule behind it.
  - `withContext` on a recipe binding takes a variant among its default props, so a component fixes
    one of the recipe's values: `withContext("button", { defaultProps: { shape: "square" } })`.
  - The semantic spacing states `marker`, the gutter a list leaves for the browser's marker, at two
    and a half ems, which is the gutter every browser leaves by default. A recipe writes
    `paddingInlineStart: "marker"`, and a theme moves it.
  - Every geometry scale runs from `xs` to `4xl`: `control` reaches twice its base at `4xl`, `icon`
    three times, `inset` three times and `gap` six times, so a hero's call to action, the mark beside
    it and the room around it grow together on the same names. The `label` role follows to `4xl`,
    growing slower than the control, the `heading` role gains `xs`, `3xl` and `4xl`, and the `body`
    role gains `xs` and `xl`.
  - The type scale gains `8xl` and `9xl`, and the heading role steps over two sizes above `2xl`: `3xl`
    reads at the `6xl` size and `4xl` at the `8xl`. A document heading and a hero heading are
    different things, and the size between them read as neither.
  - A control reads as pressed. `interactive` scales the box to 98 percent, held still for a reader
    who asked for reduced motion. A fill presses to the palette's `emphasized`, a solid fill to the
    ink it hovers to, and a plain one to the palette's solid. An outline fills in as it is hovered and
    further as it is pressed, rather than changing its line, which is the change a hover already
    makes.
  - An outline and a surface clip their background to the padding box, so a rounded corner is drawn as
    one antialiased curve. A fill running under the line laid a second curve over the first, and the
    corners read heavier than the edges they joined.
  - `controlSizes` leads with one step less inset where a mark opens the control, and `touchTarget`
    draws its area before the control's content rather than after it, which leaves the other
    pseudo-element to a look that draws one.
  - The vocabulary a recipe writes its axes from is stated once: `SCALE`, `WIDTHS`, `RATIOS`,
    `CORNERS`, `COUNTS`, `TONES`, `WEIGHTS`, `MOTIONS`, `LIFTED`, `ALIGNMENTS`, `DISTRIBUTIONS` and
    `ROLE_SIZES`, with a helper that writes each axis from it: `gapSizes`, `alignVariants`,
    `justifyVariants`, `columnCounts`, `spanCounts`, `fittedColumns`, `widthSizes`, `ratioVariants`,
    `cornerVariants`, `textSizes`, `toneVariants`, `weightVariants`, `truncate`, `motionVariants` and
    `liftVariants`. Each takes the whole scale where a recipe names no part of it, so no recipe writes
    a scale out and a scale that gains a step needs no edit to a recipe. `onSlot` lifts an axis onto
    one part of a slot recipe.
  - The per-slot pruning drops a class from a slot only where no value that styles the slot writes it.
    A grid drawing three columns and an entry spanning three write the same class on their own slots,
    and the root lost its columns to the entry's span.
  - The semantic sizes state `tag`, the height of something read beside a control rather than pressed:
    a badge, a chip or a pill. It grows on the control's own shares from a base of half the height, so
    a theme that stretches its controls stretches the tags beside them by the same amount.
  - `flatVariants` writes a `variant` axis that holds still, reading the `flat` layer styles: a look
    with a background and an ink and nothing a pointer changes. A badge drawn in a fill repaints
    whenever a pointer crosses it, which reads as a control a reader can press and then cannot. There
    is no flat ghost, because a look that never repaints is identical to plain.
  - `tagSizes` writes the `size` axis of a tag, its height on the tag scale and its inset, its gap and
    its label one step down, and `below` reads the step under the one it is given so a recipe drawing
    something lighter than a control states no order of its own.
  - The animation styles state `pulse`, which loops the keyframe of that name. The keyframe was
    already there and nothing named it, so a recipe that wanted a pulse wrote its own animation.
  - `insetSizes` writes the `size` axis of a padded box, the room inside it on the inset scale. A
    control reads `controlSizes`, which sets a height and pads the sides alone, and a panel, a well or
    an empty state needs every side padded and no height.
  - `onSlots` lifts one axis onto several parts at once, each part reading its own scale. A size axis
    moving four parts together is otherwise one object per step holding one entry per part, which is
    the shape a recipe author should never have to type.
  - `row` writes the base of a row in a list the reader chooses from: a full-width line holding a
    mark, a label and a hint side by side. It carries no focus ring and no press, because such a list
    keeps focus on the container and moves a highlight over its rows, and it draws the arrow pointer
    rather than the hand, which is what the menu pattern asks for.
  - `highlightVariants` writes the `highlight` axis of a list: `tint`, `fill` and `bar`, each a layer
    style under the highlighted condition. `bar` draws a line down the leading edge and tints the row
    behind it, so the row the reader is on is marked twice over. A menu, a select and a combobox all
    mark one row the same three ways, so a theme moves all of them by moving the layer styles.

## 0.2.0

### Minor Changes

- [#25](https://github.com/stealth-scale/config/pull/25) [`4d6bed5`](https://github.com/stealth-scale/config/commit/4d6bed5a3c60bb5518b7defac65cd812911e9f8c) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - theme: draw a variant's class on the slots the value styles alone, and a bare heading in its role
  
  - A slot carries the variant classes of the values that style it, through their own styles or
    through a compound matched on them, and no other. The runtime hands every slot the whole variant
    map, so a card's content carried `card__content--lg` with no rule behind it: fifteen such classes
    on one card.
  - A heading with no text style of its own reads in the heading role of its level, `heading.xl` for
    `h1` down to `heading.sm` for `h4` to `h6`, from the base layer. The compiler's reset had left it
    at the size and the weight of the text around it. A text style on the element still overrides the
    role.

### Patch Changes

- Updated dependencies [[`4d6bed5`](https://github.com/stealth-scale/config/commit/4d6bed5a3c60bb5518b7defac65cd812911e9f8c)]:
  - @stealthscale/pandacss-naming@0.2.0

## 0.1.1

### Patch Changes

- [#21](https://github.com/stealth-scale/config/pull/21) [`459eb8c`](https://github.com/stealth-scale/config/commit/459eb8cdeb48bea844b906098740c941aec22278) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - theme: name every compound in its recipe and read the sizes from the tokens
  
  - `defineRecipe` writes `className` on every compound from the axes it matches on, and
    `defineSlotRecipe` splits a compound into one per slot it styles, each named. The compiler emits a
    compound's styles under that class and the binding emits the same class at run time.
  - `compoundClassName(className, compound)` publishes the scheme from `./authoring`.
  - `typography()` writes each size as a reference to the `fontSizes` token of the same name.
  - `slide-fade.out` leaves towards the side the anchor is on: `top` to `slide-to-bottom`.
  - `Elevation` names the shadow step `surface()` takes. `Level` is the contrast level alone.
  - `THEME_ATTRIBUTE` and `COLOR_MODE_ATTRIBUTE` are defined once, in `attributes.ts`, and published
    from `./authoring` beside the entry, so a package that does not render reads them without loading
    the provider.
  - `switcher()` reads its threshold against the size scale where it is a name, as `simpleGrid()`
    reads its narrowest column, and switches at `md` when nothing is stated.
  - `RecipeExtension` and `SlotRecipeExtension` take `compoundVariants` as an open record of axes with
    the styles under `css`. The compiler's selection type refused the `css` key.
  - `definePreset` takes a `PresetConfig`, whose recipes are typed over the members every recipe and
    extension share, so a preset registers a recipe as `defineRecipe` returns it. The compiler's
    preset type refused one.
  - `families(pages, hue, chroma)` and `palettes(aliases)` fill the color contract in two calls. The
    foundation draws its own families and palettes with them.
  - `createRecipeContext` and `createSlotRecipeContext` return `RecipeBinding` and
    `SlotRecipeBinding`, whose factories are typed by `StyledComponent`. A package that exports a
    bound component emits a declaration that refers to this package alone.
  - `./authoring` publishes `Tokens`, `SemanticTokens`, `TextStyles`, `LayerStyles` and
    `AnimationStyles`, for a theme that states a category in a file of its own.
  - The `dark` and `light` conditions and the document's color scheme follow the operating system's
    preference where a page writes no color mode attribute, and the attribute where it does.
  - `ThemeProvider` writes the theme and the color mode onto the document root and removes what a page
    stops stating, and `useTheme()` reads them below it.
  - The foundation gains the candy. The layer styles `glow.{sm,md,lg}`, `border.moving`, `glass`,
    `text.gradient`, `text.shine` and `backdrop.{dots,grid,spotlight,aurora}` draw it. The animation
    styles `sweep`, `marquee`, `float`, `pulse-glow`, `aurora`, `meteor` and `spin` move it. The
    gradients `brand`, `shine` and `aurora` are semantic tokens, `--angle` is registered as an angle,
    and `ambientSlower` joins the durations.
  - The second round of candy adds the layer styles `blur.{sm,md,lg}`, `dim.others`,
    `mask.{bottom,edges,radial}`, `ripple` and `backdrop.{stripes,checker,noise,vignette}`, and the
    animation styles `rise`, `reveal`, `parallax`, `progress` and `twinkle`, the middle three driven
    by the scroll position. The `sticky` pattern joins the patterns, and the page scrolls smoothly
    unless the reader asked for less motion.
  - `bento(props)` and `bentoCell(props)` draw a dense grid of tiles that span columns and rows, each
    count responsive. A row defaults to `{sizes.32}`, written as a token reference because the
    compiler binds no scale to `gridAutoRows`.
  - The textured backdrops draw in the line color and the emphasized surface, the aurora drifts
    through the muted fills, and `text.shine` bands the emphasized fill in light mode and the solid in
    dark mode. The subtle line and the subtle surface are two points of lightness from a light page,
    so each of these was there in dark mode alone.
  - `Application` takes `presets`, the presets an application writes for recipes of its own, which the
    build plugin installs after every package's preset and before the themes.
  - `defineTheme` refuses a compound matched on a value a class name cannot carry, so the compiler
    never emits one that is compiled and never applied. The extension type admits a style object on an
    axis, which nothing refused.
  - `ThemeProvider` holds the pair it hands down across a render that changes neither, so a part that
    reads it redraws when the page switches and not when the provider's parent redraws. The published
    package carries no compiler, so nothing else held it.
  - `compoundSelection(compound)` writes the selection a compound matches on, in the scheme the
    compiler names it by, and returns nothing where a class name cannot carry a value.
    `compoundClassName` writes the class over it, and a reader that wants the name asks for the
    selection rather than taking a class apart.
  - `createSlotRecipeContext` stamps the recipe's name as `data-recipe` on the part that provides the
    variants, so a compound component is found by the same handle as one that draws a single element.
    The compiler's own option does nothing there, because it reads a name off the recipe a part is
    styled with and a part is styled with the slot's styles alone.
  - The document's color scheme is stated on the light attribute as well as the dark one, so a subtree
    switched to light inside a page drawn dark draws its form controls, its scrollbars and its
    selection in light. The colors a theme states still do not follow it there.
  - The preference half of the `dark` and `light` conditions is anchored to the document root. The
    compiler replaces the nesting selector with a theme's own and the default theme has none, so the
    half compiled to a bare negation that matched every element: a page switched to a theme under an
    operating system set to dark drew that theme on the element carrying the attribute and the default
    theme's dark values on everything below it.
  - `SEPARATOR`, published from `./authoring`, is the underscore the build plugin configures the
    compiler with between an axis and its value. `compoundClassName` writes it, so a compound the
    compiler names reads `button--compound__size_lg__variant_solid` before the plugin renames the
    stylesheet and the runtime. The package depends on `@stealthscale/pandacss-naming`, which its
    generated runtime imports, so a bound element's variant class reads `button--lg`.
  - The `meteor` keyframe falls by `--meteor-travel`, the viewport where the element states none, so a
    sky bounded by a box states the fall it needs. It fell 100vw at 35 degrees below the horizontal,
    which carried it out of a sky 128 pixels tall inside the first percent of the loop. The `meteor`
    animation style offsets each streak by `--stagger`, a share of the loop, as `twinkle` offsets each
    dot.
  - `backdrop.stars` tiles a field of nine dots drawn in `currentcolor`, in a tile twice as wide as it
    is tall. It is laid over a surface a recipe inverts, and the ink of that surface is the only color
    that follows it. A square tile repeats often enough across a wide sky to read as a rhythm, and its
    lower half falls outside a short one.
  - `backdrop.stripes` rules its diagonal a whole pixel wide. Half a pixel across a diagonal samples
    to a dashed line. `backdrop.grid` holds at half, because an upright line does not.
  - The aurora alternates the emphasized fill with the muted one, so it moves through lightness as
    well as hue, and it reads as the palette rather than as a haze. Every fill of one role sits at one
    lightness, and the muted fill is two points of chroma from the emphasized one.
  - A compound takes a `name`, and `defineRecipe` writes its class from it through
    `@stealthscale/pandacss-naming`, so a large solid button named `hero` carries `button--hero` and a
    slot compound `card__root--hero`. The name is removed once the class is written, because the
    compiler and the runtime read every other key as an axis. A compound without a name keeps the
    compiler's own class, which the testing kit reports.
  - The global styles declare the six properties the reset reads, the ink, the palette and the font on
    every element that switches a theme or a color mode, beside the root. A property set on the root
    is inherited as its computed value, so a subtree switched to another theme kept the root's font
    and ink while its own tokens said otherwise.
  - The ripple grows from the point of the press, which a component writes as `--ripple-x` and
    `--ripple-y` and which falls at the centre where it writes none, and it fades at full size over
    the release rather than shrinking back. It was a rounded rectangle cut to the control's outline.
    The press snapped it to nothing and the release grew it, so a reader pressing the control saw
    nothing until they let go. Its rim is soft, and it is tinted at the opacity a pressed state layer
    takes. `--ripple-scale` is how far it grows, as a multiple of its own width, and `--ripple-pace`
    scales every duration at once, which a reader who asked for less motion sets to zero.
- Updated dependencies [[`ef9c601`](https://github.com/stealth-scale/config/commit/ef9c601e8224b34d545be51eced2a47354fc2e16)]:
  - @stealthscale/pandacss-naming@0.1.0

## 0.1.0

### Minor Changes

- [#19](https://github.com/stealth-scale/config/pull/19) [`40e6dd7`](https://github.com/stealth-scale/config/commit/40e6dd71b061799fb2d2926d8a88f486275ffe3c) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - theme: add the design-system package
  
  - `./theme` publishes the foundation: nineteen token categories, the three color families and
    nineteen palettes of twelve roles, the compositions, the keyframes, the conditions and the global
    styles, held to 7:1 for text and 3:1 for lines.
  - `./authoring` publishes the definitions, the contract, the scales, the recipe helpers, the
    patterns and the contrast measurement.
  - `.` publishes the generated runtime, the two bindings and the two attributes a page is switched
    with.
