# @stealthscale/theme-regatta

`@stealthscale/theme-regatta` states Regatta: a crimson product with deep blue and teal beside it,
on navy after dark and on the palest navy by day, with sharp corners. It states four colors
outright, and every other value is a tint or a mix of them.

## Install

```bash
pnpm add @stealthscale/theme-regatta
```

The theme peers on `@stealthscale/theme`. An application lists it in `theme.config.ts` and a page
switches to it with `data-theme="regatta"`.

## The values

- The crimson `#BF092F` is the product. The navy `#132440` is the dark page and the ink on the light
  one. The deep blue `#16476A` is the panel on the dark page and the secondary by day. The teal
  `#3B9797` is the accent. The light page is the palest tint of the navy, and the dark page is
  written in a pale teal, which is the secondary after dark, where the deep blue would sink into the
  navy.
- `src/tokens.ts` draws the grey ramp in the navy's hue and redraws the red, the blue and the teal
  ramps from the crimson, the deep blue and the teal, each with `scaleOf`. Every other ramp is the
  foundation's.
- `src/semantic-tokens.ts` draws the three families from the pages and the inks with `inked`. Every
  surface is a fixed distance from the page in the page's own tint. Every line is the page mixed
  towards the ink and every faded ink is the ink mixed towards the page. `hues` draws every hue
  palette over the same pages: the red palette from the crimson for the primary and the errors, the
  blue palette from the deep blue by day and the pale teal after dark for the secondary, the teal
  palette from the teal for the accent, and every other from the foundation's hue. `radii` draws the
  corners from a quarter rem and `shadows` casts the shadows in the navy's hue.
- The faces are the foundation's system stacks, so the manifest depends on nothing for them.

## The gate

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme` for the contract:
every role of every palette in both modes, every reference, and the steps a reader has to tell
apart. The contrast checks are left out, with the reason written beside the skip: the theme keeps
its colors as stated rather than moving one to clear a ratio.
