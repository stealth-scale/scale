# @stealthscale/theme-admiral

`@stealthscale/theme-admiral` states Admiral: a teal blue product on navy and chalk, drawn formal.
Serif headings set semibold and tracked tight, a crisp corner, a thick indicator and firm shadows.
It states four colors outright, and the engine draws every other value from them.

## Install

```bash
pnpm add @stealthscale/theme-admiral
```

The theme peers on `@stealthscale/theme`. An application lists it in `theme.config.ts` and a page
switches to it with `data-theme="admiral"`.

## The statement

- The navy `#0C2B4E` is the dark page and the ink on the light one. The blue `#1A3D64` is the panel
  on the dark page, the secondary, the accent and the type ink. The teal blue `#1D546C` is the
  primary and the keyword ink. The chalk `#F4F4F4` is the light page and the ink on the dark one.
- `src/colors.ts` fixes the four colors and states the theme's colors from them. `defineTheme` draws
  every surface, ink, line and palette from the statement. A blue that would sink into the navy
  after dark is lifted until it stands from the page and carries its label, and keeps its hue. Each
  status keeps its canonical hue at the chroma of the teal blue, so information is told from the
  primary and no status shouts over a quiet brand. The two blues are drawn as the hue palettes
  nearest them for an application that names one.
- `src/index.ts` defines the theme from the statement. The corners are drawn from a quarter rem and
  an indicator is three pixels wide. The shadows are cast a fifth harder than the default ink in the
  navy's hue. Every heading is set semibold and tracked tight in the transitional serif stack.
- The faces are system stacks, so the manifest depends on nothing for them.

## The gate

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme`: every role of
every palette in both modes, every reference, every text pair at 7:1, the tertiary ink and every
label at 4.5:1, every boundary and ring at 3:1, the statuses apart from each other and from the
brand, and the steps a reader has to tell apart. Nothing is skipped.
