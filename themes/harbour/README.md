# @stealthscale/theme-harbour

`@stealthscale/theme-harbour` states Harbour: a steel blue product on navy and mist, drawn soft.
Light shadows, quieter surfaces after dark, a looser density, a longer measure, more air in the
text, medium headings and a slow tempo. It states four colors outright, and the engine draws every
other value from them.

## Install

```bash
pnpm add @stealthscale/theme-harbour
```

The theme peers on `@stealthscale/theme`. An application lists it in `theme.config.ts` and a page
switches to it with `data-theme="harbour"`.

## The statement

- The navy `#1B3C53` is the dark page and the ink on the light one. The deep blue `#234C6A` is the
  secondary, the accent and the type ink. The steel blue `#456882` is the primary and the keyword
  ink. The mist `#E3E3E3` is the light page and the ink on the dark one.
- `src/colors.ts` fixes the four colors and states the theme's colors from them. `defineTheme` draws
  every surface, ink, line and palette from the statement. The panel on the dark page is drawn from
  the navy rather than stated as the deep blue, because the mist reads at 6.7:1 on the deep blue and
  a panel carries text. The navy reads at 9:1 on the mist, and three wells a reader can tell apart
  under a secondary ink need the text ratio at 6:1 there, so the theme states `text: 6`. A blue that
  would sink into the navy after dark is lifted until it stands from the page and carries its label,
  and keeps its hue. Each status keeps its canonical hue at the chroma of the steel blue, so
  information is told from the primary and no status shouts over a quiet brand. The surfaces after
  dark keep three quarters of the navy's chroma. The two blues are drawn as the hue palettes nearest
  them for an application that names one.
- `src/index.ts` defines the theme from the statement. The corners are drawn from three eighths of a
  rem. The shadows are cast at six tenths of the default ink in the navy's hue. Every control, icon,
  tag, inset and gap is drawn at 105% of the foundation's density, and a column of text is read at
  70 characters. Every pace is a quarter longer than the foundation's, and a thing that arrives or
  moves eases in and out. Body text is set with relaxed leading and every heading at a medium
  weight.
- The faces are the foundation's system stacks, so the manifest depends on nothing for them.

## The gate

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme` at the ratios the
theme draws to: every role of every palette in both modes, every reference, every text pair at 6:1,
the tertiary ink and every label at 4.5:1, every boundary and ring at 3:1, the statuses apart from
each other and from the brand, and the steps a reader has to tell apart. Nothing is skipped.
