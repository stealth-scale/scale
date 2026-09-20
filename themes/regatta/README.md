# @stealthscale/theme-regatta

`@stealthscale/theme-regatta` states Regatta: a crimson product with deep blue and teal beside it,
on navy after dark and on the palest navy by day, drawn sharp. An eighth-rem corner, a wide ring
flush with the control, a tighter density, a quick press, condensed extrabold headings and buttons
set in capitals. It states four colors outright, and the engine draws every other value from them.

## Install

```bash
pnpm add @stealthscale/theme-regatta
```

The theme peers on `@stealthscale/theme`. An application lists it in `theme.config.ts` and a page
switches to it with `data-theme="regatta"`.

## The statement

- The crimson `#BF092F` is the primary and the keyword ink. The navy `#132440` is the dark page and
  the ink on the light one. The deep blue `#16476A` is the panel on the dark page and the secondary.
  The teal `#3B9797` is the accent and the type ink. The light page is the palest tint of the navy,
  and the dark page is written in a pale teal.
- `src/colors.ts` fixes the four colors and states the theme's colors from them. `defineTheme` draws
  every surface, ink, line and palette from the statement. Each status keeps its canonical hue, and
  an error a shade off the crimson is moved a step in lightness so a destructive action is told from
  the primary. The three colors beside the navy are drawn as the hue palettes of their own names for
  an application that names one.
- `src/index.ts` defines the theme from the statement. The corners are drawn from an eighth of a
  rem, and the focus ring is three pixels wide and flush with the control. The shadows are cast a
  quarter harder than the default ink in the navy's hue. Every control, icon, tag, inset and gap is
  drawn at 95% of the foundation's density, and the gap inside a control from three eighths of a
  rem. A press is answered in four fifths of the foundation's time on a symmetric curve. Every
  heading is set extrabold and tracked tighter in the condensed stack, and every label semibold.
- `src/recipes/button.ts` sets every button's label in capitals, tracked wider.
- The faces are system stacks, so the manifest depends on nothing for them.

## The gate

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme`: every role of
every palette in both modes, every reference, every text pair at 7:1, the tertiary ink and every
label at 4.5:1, every boundary and ring at 3:1, the statuses apart from each other and from the
brand, the steps a reader has to tell apart, and the button extension against the recipe it extends.
Nothing is skipped.
