# @stealthscale/theme-cinder

`@stealthscale/theme-cinder` states Cinder: a red product on slate and ash, drawn hard. Sharp
corners, a heavy control edge, hard shadows, a tighter density, a fast press, bold grotesque
headings and badges set in capitals. It states four colors outright, and the engine draws every
other value from them.

## Install

```bash
pnpm add @stealthscale/theme-cinder
```

The theme peers on `@stealthscale/theme`. An application lists it in `theme.config.ts` and a page
switches to it with `data-theme="cinder"`.

## The statement

- The slate `#303841` is the dark page and the ink on the light one. The steel `#3A4750` is the
  panel on the dark page and the secondary. The red `#D72323` is the primary and the keyword ink.
  The ash `#EEEEEE` is the light page and the ink on the dark one.
- `src/colors.ts` fixes the four colors and states the theme's colors from them. `defineTheme` draws
  every surface as a step from the page, every faded ink from the ink at the ratio it reads at,
  every line from the page at the ratio it stands at, and every palette from its color over the
  pages. Each status keeps its canonical hue at the chroma of the red, and an error a shade off the
  red is moved a step in lightness so a destructive action is told from the primary. The red palette
  is drawn for an application that names it.
- `src/index.ts` defines the theme from the statement. The corners are drawn from an eighth of a
  rem, a control's edge is two pixels wide, an indicator three, and the focus ring is two pixels
  wide one pixel off the control. The shadows are cast at half again the default ink in the slate's
  hue. Every control, icon, tag, inset and gap is drawn at 95% of the foundation's density. A press
  is answered in three quarters of the foundation's time on a straight curve. Every heading is set
  bold and tracked tight in the grotesque stack, and every label semibold.
- `src/recipes/badge.ts` sets every badge's label in capitals, tracked wide.
- The faces are system stacks, so the manifest depends on nothing for them.

## The gate

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme`: every role of
every palette in both modes, every reference, every text pair at 7:1, the tertiary ink and every
label at 4.5:1, every boundary and ring at 3:1, the statuses apart from each other and from the
brand, the steps a reader has to tell apart, and the badge extension against the recipe it extends.
Nothing is skipped.
