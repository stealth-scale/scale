---
"@stealthscale/component-typography": minor
---

component-typography: offer the tertiary ink as a tone and draw a keycap at the theme's widths

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
