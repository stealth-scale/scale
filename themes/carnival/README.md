# @stealthscale/theme-carnival

`@stealthscale/theme-carnival` states Carnival: a red product with orange and yellow beside it, on
navy after dark and on cream by day, drawn playful. Round corners, tall controls at a looser
density, a scale that climbs by a minor third, extrabold humanist headings, bold labels and a quick
tempo. It states four colors outright, and the engine draws every other value from them.

## Install

```bash
pnpm add @stealthscale/theme-carnival
```

The theme peers on `@stealthscale/theme`. An application lists it in `theme.config.ts` and a page
switches to it with `data-theme="carnival"`.

## The statement

- The red `#EA5455` is the primary and the keyword ink. The orange `#F07B3F` is the secondary and
  the string ink. The yellow `#FFD460` is the accent and the number ink. The navy `#2D4059` is the
  dark page and the ink on the light one. The light page is a cream, the palest tint of the yellow,
  and the dark page is written in a pale yellow.
- `src/colors.ts` fixes the four colors and states the theme's colors from them. `defineTheme` draws
  every surface, ink, line and palette from the statement. Each status keeps its canonical hue at
  the chroma of the red, and an error a shade off the red is moved in lightness so a destructive
  action is told from the primary. The warning is left at its canonical amber rather than drawn from
  the orange, because the navy page is light enough that every solid on it is lifted to the same
  band, where an orange warning and a red error are one badge. The three colors beside the navy are
  drawn as the hue palettes of their own names for an application that names one.
- `src/index.ts` defines the theme from the statement. The corners are drawn from one rem, with the
  inner corner at half a rem. The shadows are cast a quarter harder than the default ink in the
  navy's hue. A medium control is two and three quarter rem tall, and every control, icon, tag,
  inset and gap is drawn at 105% of the foundation's density. Every pace is 15% shorter than the
  foundation's. The scale climbs by a minor third, every heading is set extrabold in the humanist
  stack, and every label bold.
- The faces are system stacks, so the manifest depends on nothing for them.

## The gate

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme`: every role of
every palette in both modes, every reference, every text pair at 7:1, the tertiary ink and every
label at 4.5:1, every boundary and ring at 3:1, the statuses apart from each other and from the
brand, and the steps a reader has to tell apart. Nothing is skipped.
