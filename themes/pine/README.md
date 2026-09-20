# @stealthscale/theme-pine

`@stealthscale/theme-pine` states Pine: a green product with teal and sage beside it, on the night
after dark and on the palest sage by day, drawn quiet. Calm surfaces, light shadows, a looser
density, a longer measure, a scale that climbs by a minor third, more air in the text, medium
humanist headings and a slow tempo. It states four colors outright, and the engine draws every other
value from them.

## Install

```bash
pnpm add @stealthscale/theme-pine
```

The theme peers on `@stealthscale/theme`. An application lists it in `theme.config.ts` and a page
switches to it with `data-theme="pine"`.

## The statement

- The night `#092328` is the dark page and the ink on the light one. The teal `#12544F` is the
  secondary and the type ink. The green `#2A835F` is the primary and the keyword ink. The sage
  `#8BBB92` is the ink on the dark page, the accent and the string ink. The light page is the palest
  tint of the sage.
- `src/colors.ts` fixes the four colors and states the theme's colors from them. `defineTheme` draws
  every surface, ink, line and palette from the statement. Each status keeps its canonical hue at
  the chroma of the green, so a success is told from the primary and no status shouts over a quiet
  brand. The surfaces keep seven tenths of the page's chroma. The three greens are drawn as the hue
  palettes nearest them for an application that names one.
- `src/index.ts` defines the theme from the statement. The corners are drawn from five eighths of a
  rem. The shadows are cast at three quarters of the default ink in the night's hue. Every control,
  icon, tag, inset and gap is drawn at 105% of the foundation's density, and a column of text is
  read at 68 characters. Every pace is three tenths longer than the foundation's, and everything
  that arrives, goes or moves eases in and out. The scale climbs by a minor third, body text is set
  with relaxed leading, and every heading at a medium weight in the humanist stack.
- The faces are system stacks, so the manifest depends on nothing for them.

## The gate

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme`: every role of
every palette in both modes, every reference, every text pair at 7:1, the tertiary ink and every
label at 4.5:1, every boundary and ring at 3:1, the statuses apart from each other and from the
brand, and the steps a reader has to tell apart. Nothing is skipped.
