---
"@stealthscale/component-data": minor
---

component-data: show every component

- One specimen per component, each scene drawing every value of every axis the recipe offers, with
  the words read through the catalogue's `specimen` namespace from `locales/en/specimen/`.

component-data: add the neutral value to the badge's status axis

- `Badge status="neutral"` points the palette at the neutral one, for a label that states a fact
  rather than a state, such as the group a page is filed under. The value is emitted whether or not
  a page writes it, beside the four statuses.

component-data: add the status

- `Status.Root` and `Status.Indicator` render a colored dot and a word as two `span` elements, so a
  status is valid inside a paragraph, a table cell or a button. The dot has `aria-hidden` by
  default.
- Axes: `palette` (the eight semantic palettes, emitted in `staticCss`, default `neutral`), `size`
  (`sm`, `md`, `lg` on the label scale, and `inherit` for running text) and `effect` (`glow`,
  `pulse` on the dot).
- The root aligns on the word's baseline. Inside a sentence the word measured the same baseline as
  the text around it, and the dot's centre was within 0.01px of the text's centre.

component-data: add the stat

- `Stat.Root` renders a `dl` with `Label` (`dt`), `ValueText` (`dd`), `ValueUnit` (`span`),
  `HelpText` (`dd`) and `Indicator` (`span`). The help text is a `dd`, so the list passes the axe
  `definition-list` rule.
- `size` sets the figure's heading text style: 22.8px, 27.2px and 32.4px at `sm`, `md` and `lg`. The
  figure uses tabular numerals.
- `palette` colors the indicator in the palette's text ink. The caller passes the glyph and chooses
  the palette, because the direction of a change and whether it is good are separate facts.

component-data: add the tag

- `Tag.Root` renders a `span` with `Label`, `StartElement`, `EndElement` and `CloseTrigger`. The
  close trigger is a `button` whose props type requires `aria-label` or `aria-labelledby`.
- Axes: `variant` (the five flat looks, default `surface`), `size` (`sm` to `xl`), `palette`,
  `radius` and `effect` (`glow`, `pulse`).
- Padding is 6, 8, 8 and 12px and the gap 4, 4, 6 and 6px from `sm` to `xl`. Marks are pulled
  `0.125em` towards the edge. The label is raised `0.1em`: the lowercase x-height's centre measured
  within 0.7px of the tag's centre at every size, and 1.7px below it before.
- The label is clipped on the inline axis only, so descenders are not cut. A tag does not shrink in
  a flex row.
- The close trigger's focus ring is drawn inside its box, in the contrast ink on a solid tag.
  Outside its box the ring fell on the solid fill and was not visible.
- In forced colors mode the root draws a hairline outline in `CanvasText`, because the solid, subtle
  and plain looks have no border.

component-data: add the color swatch

- `ColorSwatch` renders a `span` of one color from `value`. `ColorSwatchMix` divides it between two
  to four colors from `items`. The number of colors selects the recipe's `mix` axis.
- Axes: `size` (the icon scale, `full` and `inherit`) and `shape` (`square`, `rounded`, `circle`).
  The swatch shows a value rather than a palette, so it offers no `palette` or `effect` axis.
- The component writes the color to `--color-swatch-value`, or to `--color-swatch-1` to
  `--color-swatch-4` for a mix. A checkerboard under the color shows a translucent color as
  translucent.
- A hairline border draws the edge, with the background clipped to the padding box. An inset shadow
  drew a red fringe outside the grey edge of a circle in Firefox at 1.25x, 1.5x and 2x.
- `forcedColorAdjust: none` keeps the color in forced colors mode.

component-data: show the source of every scene from an example file

- The tag, stat, status and color swatch specimens render each scene from a file under
  `<component>/examples/` and show that file as its source. The text goes through `useWords`.
- `src/examples.spec.ts` renders every example and asserts that axe reports no violation, over 20
  examples.
- The status palette scene and the color swatch mix scene are hand-written. The first pairs each
  palette with a state word, and a caller selects a mix by the number of colors.

component-data: size the badge like the tag and give it a palette axis

- Breaking: `Badge` takes `palette` in place of `status`. The eight semantic palettes replace the
  four statuses and `neutral`, and `staticCss` lists every palette.
- Breaking: `Badge` takes `size` `sm`, `md`, `lg` or `xl`. `xs` and `2xl` to `4xl` are removed. The
  sizes read `chipSize`, which the tag also reads: the tag scale's height, gap-scale padding of 6,
  8, 8 and 12px, and a label one size smaller. The inset padding measured 12px at `md`.
- `effect` adds a `glow` or a `pulse` halo in the palette's solid at half opacity.
- Under forced colors the badge draws a hairline `CanvasText` outline.
