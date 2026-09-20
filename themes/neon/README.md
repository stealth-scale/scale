# @stealthscale/theme-neon

`@stealthscale/theme-neon` states Neon: a violet product with hot pink and yellow beside it, on
grape after dark and on the palest violet by day, drawn loud. Calm surfaces under loud fills, heavy
shadows, a thick indicator, a wide ring, black geometric headings, a snappy tempo and a deeper
glass. It states four colors outright, and the engine draws every other value from them.

## Install

```bash
pnpm add @stealthscale/theme-neon
```

The theme peers on `@stealthscale/theme`. An application lists it in `theme.config.ts` and a page
switches to it with `data-theme="neon"`.

## The statement

- The violet `#8C00FF` is the primary and the keyword ink. The pink `#FF3F7F` is the secondary and
  the string ink. The yellow `#FFC400` is the accent and the number ink. The grape `#450693` is the
  dark page and the ink on the light one. The light page is the palest tint of the violet, and the
  dark page is written in a pale yellow.
- `src/colors.ts` fixes the four colors and states the theme's colors from them. `defineTheme` draws
  every surface, ink, line and palette from the statement. The surfaces keep half the grape's
  chroma, so the panels and the wells step in a quieter violet and the fills and the solids carry
  the color. The three colors beside the grape are drawn as the hue palettes of their own names for
  an application that names one.
- All four statuses are stated rather than left to their canonical colors: a rose `#FF1053` error,
  an acid `#00FF9C` success, an amber `#FFAE00` warning and an electric `#00D9FF` cyan for
  information. A theme this loud reads a canonical status as a color from another product. Each sits
  within the thirty degrees of its canonical hue that the gate holds a status to, so it is still
  read from its color before its word.
- `src/index.ts` defines the theme from the statement. The corners are drawn from three quarters of
  a rem, an indicator is three pixels wide, and the focus ring is three pixels wide two pixels off
  the control. The shadows are cast at twice the default ink in the grape's hue. Every pace is six
  tenths of the foundation's. Every heading is set black and tracked tight in the geometric stack,
  and every label semibold. The glass look blurs further and saturates what shows through it, at six
  tenths of the panel's opacity.
- The faces are system stacks, so the manifest depends on nothing for them.

## The gate

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme`: every role of
every palette in both modes, every reference, every text pair at 7:1, the tertiary ink and every
label at 4.5:1, every boundary and ring at 3:1, the statuses apart from each other and from the
brand, and the steps a reader has to tell apart. Nothing is skipped.
