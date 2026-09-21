# @stealthscale/component-typography

## 0.2.0

### Minor Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`d577ce3`](https://github.com/stealth-scale/scale/commit/d577ce3a013b0af1f6cd2dce358f496382a58616) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-typography: offer the tertiary ink as a tone and draw a keycap at the theme's widths
  
  - `Text`, `Heading`, `Strong` and `Em` offer `tone="subtle"`, the tertiary ink at AA, for a caption,
    a timestamp or a counter.
  - A raised `Kbd` draws its edge at `borderWidths.control` and its foot at `borderWidths.indicator`
    rather than at the reference widths `sm` and `md`.
  
  component-typography: keep a mirrored icon mirrored while it spins
  
  - `Icon`'s `mirrored` axis wrote `transform: scaleX(-1)`, and the `spin` motion animates
    `transform`. An animation overrides a declaration of the same property, so a mark that was both
    mirrored and spinning lost its mirror for as long as it turned.
  - The axis now writes the `scale` property, which is a property of its own and composes with the
    animation.
  
  component-typography: publish Em, Strong, Mark, Quote and Span
  
  - `Em` marks a run of words the writer stressed. The element is `em` and it exposes the `emphasis`
    role. The recipe declares `fontStyle: italic` rather than relying on the browser's default, so a
    theme has a declaration to extend and a font family with no italic face has an explicit
    substitute. It offers `tone` and `motion`.
  - `Strong` marks a run as more important than the words around it. The element is `strong` and it
    exposes the `strong` role. It offers `weight` at `medium`, `semibold` and `bold`, defaulting to
    `semibold`, beside `tone` and `motion`. The scale's `normal` step is left out, and the browser's
    `bolder` keyword is not read, because `bolder` resolves against the inherited weight and reaches a
    different step in each context.
  - `Mark` picks a run out of the text around it. The element is `mark` and it exposes the `mark`
    role. It offers `variant` over the five flat looks plus `text`, `status`, `radius`, `inset`,
    `motion` and `effect`. `MarkPropsProvider` sets the variants of every mark below it.
  - The mark's filled looks read the `flat` layer styles, whose background and ink are the palette
    pairs the contrast gate measures, so a highlight clears the text ratio in both color modes.
  - The mark's base clones the box decoration, so a fill that runs onto a second line carries its
    inset and its corners onto both. The base sets no `whiteSpace`: a marked phrase held on one line
    forces a horizontal scroll at 320 pixels, which WCAG 1.4.10 fails.
  - The mark's inset opens `paddingInline` alone. Block padding on an inline box overflows into the
    line above rather than opening the line.
  - A compound named `tinted` draws the palette ink where a status meets `plain` or `text`, the two
    looks that write no fill and would otherwise take a status and show nothing.
  - The mark defaults to `inset: xs` and `radius: l1` beside its subtle fill, so a highlight with no
    props sits off the glyphs rather than running against them.
  - `Quote` quotes a run inside the line around it. The element is `q`, and the browser draws the
    marks from the `quotes` property against the `lang` in force. It offers `marks` at `auto` and
    `none`, defaulting to `auto`, beside `tone` and `motion`. Set `marks="none"` where the text
    already holds its punctuation. `Blockquote.Root` remains the quotation set as its own block.
  - `Span` draws a run inside a line without starting a block. It offers `tone`, `weight`, `truncate`
    and `motion`, all off until a caller picks them, and no `size`. `Text` defaults its size to `md`,
    so a `Text` with `as="span"` inside a heading resets the run to body size. A span inherits the
    line it sits in.
  - The span's `truncate` sets `display: inline-block` beside the properties the `truncate` helper
    writes. `overflow` has no effect on a non-replaced inline box, so the README's former
    `<Text as="span" truncate>` example cut nothing. The example is replaced.
  
  component-typography: show every component
  
  - One specimen per component, each scene drawing every value of every axis the recipe offers, with
    the words read through the catalogue's `specimen` namespace from `locales/en/specimen/`.
  
  component-typography: hold passive typography still under a pointer
  
  - Code and the unraised keycaps read the flat looks. They read the interactive looks, so a subtle
    code chip repainted from the subtle fill to the muted one under a pointer without being anything
    to press.
  
  component-typography: give a scene that reads once the width runs out a room
  
  - The heading's and the span's truncate scenes and the list's alignment scene stand in a room at a
    measure their words pass, so the cut line, the wrapped line and the three places of a mark differ.
    Each read the same in every value before.
  - `Code`, `Kbd` and `Blockquote` build their `size` axis through `sizeVariants` rather than as an
    object literal, so the steps run from the smallest up rather than alphabetically. The styles each
    step draws are unchanged.
  - `Heading` takes a `display` switch, which sets the title in the theme's display role. The role was
    drawn by the theme and reachable from no component. It takes the middle of the role's three steps,
    and the `2xl` and `4xl` sizes move it to the quieter and the louder step. It is a switch rather
    than three more sizes because a class carries the value alone, so a step named `sm` on two axes
    would write one class for both.
  - `Text` takes all three fades the theme draws as `mask`: `bottom`, `edges` and `radial`. Only
    `bottom` was offered.
  - `Icon` offers every ink `Text` offers rather than five of the eight, beside its own `current`.

### Patch Changes

- [#35](https://github.com/stealth-scale/scale/pull/35) [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - components: emit a rule for every status a component can be handed
  
  - Every recipe with a `status` axis now carries `statusEmitted()` under `staticCss`: `Button`,
    `Badge`, `Alert`, `Checkbox`, `Field`, `Fieldset`, `Input`, `Switch`, `Textarea`, `Card`,
    `Blockquote`, `Code`, `Kbd` and `Mark`.
  - The compiler emits a rule for a value it reads from a literal in an application's source. An
    application writes `status={row.status}` rather than `status="error"`, so the compiler read a name
    it could not follow. The runtime still wrote the class, and the component drew in its default
    palette while reporting an error.
  - Measured on the single-theme example, which writes `status="error"` and the other three nowhere:
    the stylesheet held a rule for `error` alone before, and for all four after, at 0.19 kB over the
    wire.
  - `recipe.emitted` in the theme's test kit reports a recipe that offers a status and lists none, so
    a new one cannot be written without it.
- Updated dependencies [[`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/theme@0.4.0

## 0.1.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`ca48c3d`](https://github.com/stealth-scale/config/commit/ca48c3d51cef1b85ea6d103077a0e2f21e097911) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - component-typography: publish the first seven components
  
  - `Text`, `Heading`, `Code`, `Kbd` and `Icon` each bind one element through the compiler's factory,
    so a caller changes the element with `as`. `List` and `Blockquote` are published as namespaces of
    their parts, `List.Root` and `Blockquote.Content`.
  - Every axis the vocabulary lets a theme move on a component is an axis of its recipe: the body and
    heading roles as sizes, the foreground roles as tones, the looks, the statuses, the semantic
    scales, and the text effects, masks and motions as `effect`, `mask` and `motion`.
  - `Icon` states the `img` role, so a label a caller gives it names the graphic in every screen
    reader. `List.Indicator` is hidden from assistive technology, as the browser's bullet is.
  - A heading balances its lines and a paragraph wraps prettily, so neither leaves one word alone on
    its last line.
  - `List` takes a `marker`: the three bullets, a dash, decimal with or without a leading zero, roman
    and alphabetic numbering in both cases, and greek letters. The element's own marker stays until a
    caller picks one.
  - The sizes run on the foundation's full scale where a component has a use for the step: `Heading`
    and `Icon` from `xs` to `4xl`, `Text` from `xs` to `xl`, and `List` gaps to `4xl`.
  - `Icon` fills its artwork in the current colour, so a path with no fill of its own follows the ink
    into dark mode rather than staying black.
  - The preset under `./theme` registers all seven recipes.

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0
