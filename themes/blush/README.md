# @stealthscale/theme-blush

`@stealthscale/theme-blush` states Blush: a pink product on navy and pearl, drawn round. A rounded
face, round corners, pill buttons, wide insets at a looser density, bold headings, quieter surfaces
after dark, soft shadows and a tempo a touch slower than the foundation's. It states four colors
outright, and the engine draws every other value from them.

## Install

```bash
pnpm add @stealthscale/theme-blush
```

The theme peers on `@stealthscale/theme`. An application lists it in `theme.config.ts` and a page
switches to it with `data-theme="blush"`.

## The statement

- The navy `#021A54` is the dark page and the ink on the light one. The pink `#FF85BB` is the
  primary and the keyword ink. The petal `#FFCEE3` is the ink on the dark page and the tag ink. The
  pearl `#F5F5F5` is the light page. The secondary is the ink of each mode, which is the grey
  control beside the pink.
- `src/colors.ts` fixes the four colors and states the theme's colors from them. `defineTheme` draws
  every surface, ink, line and palette from the statement. The pink stands from the pearl at 3:1 and
  carries its label at 4.5:1, which moves it darker by day while it keeps its hue. The surfaces
  after dark keep seven tenths of the navy's chroma. Each status keeps its canonical hue, and an
  error a shade off the pink is moved a step in lightness so a destructive action is told from the
  primary. The pink palette is drawn for an application that names it.
- `src/index.ts` defines the theme from the statement. The corners are drawn from a rem and a
  quarter. The shadows are cast at four fifths of the default ink in the navy's hue. A medium
  control is padded by a rem and a quarter, and every control, icon, tag, inset and gap is drawn at
  105% of the foundation's density. Every pace is a tenth longer than the foundation's. The page is
  read in the rounded stack, every heading is set bold, and every label semibold.
- `src/recipes/button.ts` rounds every button to a pill.
- The faces are system stacks, so the manifest depends on nothing for them.

## The gate

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme`: every role of
every palette in both modes, every reference, every text pair at 7:1, the tertiary ink and every
label at 4.5:1, every boundary and ring at 3:1, the statuses apart from each other and from the
brand, the steps a reader has to tell apart, and the button extension against the recipe it extends.
Nothing is skipped.
