# @stealthscale/theme-dusk

`@stealthscale/theme-dusk` states Dusk: a coral product with mauve and plum beside it, on navy after
dark and on the palest coral by day, drawn soft. Larger body text with more air, light serif
headings, a one-rem corner, a roomy ring, faint shadows, quieter surfaces and a slow tempo. It
states four colors outright, and the engine draws every other value from them.

## Install

```bash
pnpm add @stealthscale/theme-dusk
```

The theme peers on `@stealthscale/theme`. An application lists it in `theme.config.ts` and a page
switches to it with `data-theme="dusk"`.

## The statement

- The coral `#F67280` is the primary and the keyword ink. The mauve `#C06C84` is the secondary and
  the type ink. The plum `#6C5B7B` is the accent and the tag ink. The navy `#355C7D` is the dark
  page and the ink on the light one. The light page is the palest tint of the coral, and the dark
  page is written in a pale coral.
- `src/colors.ts` fixes the four colors and states the theme's colors from them. The pale coral
  reads at 6.3:1 on the navy, so the theme states the ratios it draws to: text at 4.5:1, the
  tertiary ink at 3:1, and a label at 3:1, because a navy of middle lightness leaves a solid that
  carried its label at 4.5:1 nowhere to stand but the ink. The panel on the dark page is drawn from
  the navy rather than stated as the plum, because a secondary ink at that ratio has no room on the
  plum. The surfaces keep four fifths of the page's chroma. Every other value is drawn from the
  statement, and the three colors beside the navy are drawn as the hue palettes nearest them for an
  application that names one.
- The warning, the success and the information are stated rather than left to their canonical
  colors: an ochre `#C98A2E`, a sage `#6BA583` and a slate blue `#3E86B8`, each dusted to the
  theme's register and inside the thirty degrees of its canonical hue that the gate allows. The
  error is left to the engine. The navy page of middle lightness leaves one band where a solid
  stands from it and carries a label, every red settles into that band, and a stated red would land
  on the coral primary.
- `src/index.ts` defines the theme from the statement. The corners are drawn from one rem, and the
  focus ring is two pixels wide three pixels off the control. The shadows are cast at half the
  default ink in the navy's hue. Every pace is half again the foundation's, and a thing that arrives
  or moves eases in and out. Body text is set a sixteenth larger with relaxed leading, and every
  heading at the normal weight with snug leading in the old-style serif stack.
- The faces are system stacks, so the manifest depends on nothing for them.

## The gate

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme` at the ratios the
theme draws to: every role of every palette in both modes, every reference, every text pair at
4.5:1, the tertiary ink and every label at 3:1, every boundary and ring at 3:1, the statuses apart
from each other and from the brand, and the steps a reader has to tell apart. Nothing is skipped.
