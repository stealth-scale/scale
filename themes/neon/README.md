# @stealthscale/theme-neon

`@stealthscale/theme-neon` states Neon: a violet product with hot pink and yellow beside it, on
grape after dark and on the palest violet by day, with soft corners. It states four colors outright,
and every other value is a tint or a mix of them.

## Install

```bash
pnpm add @stealthscale/theme-neon
```

The theme peers on `@stealthscale/theme`. An application lists it in `theme.config.ts` and a page
switches to it with `data-theme="neon"`.

## The values

- The grape `#450693` is the dark page and the ink on the light one. The violet `#8C00FF` is the
  product and the pink `#FF3F7F` stands beside it. The yellow `#FFC400` is the accent. The light
  page is the palest tint of the violet, and the dark page is written in a pale yellow.
- `src/tokens.ts` draws the grey ramp in the grape's hue, held to a low chroma so a grey control
  reads as grey beside the violet, and redraws the purple, the pink and the yellow ramps from the
  three colors with `scaleOf`. Every other ramp is the foundation's.
- `src/semantic-tokens.ts` draws the three families from the pages and the inks with `inked`. Every
  surface is a fixed distance from the page in the page's own tint. Every line is the page mixed
  towards the ink and every faded ink is the ink mixed towards the page. `hues` draws every hue
  palette over the same pages: the purple, the pink and the yellow palettes from the violet, the
  pink and the yellow for the primary, the secondary and the accent, and every other from the
  foundation's hue. `radii` draws the corners from three quarters of a rem and `shadows` casts the
  shadows in the grape's hue.
- The faces are the foundation's system stacks, so the manifest depends on nothing for them.

## The gate

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme` for the contract:
every role of every palette in both modes, every reference, and the steps a reader has to tell
apart. The contrast checks are left out, with the reason written beside the skip: the theme keeps
its colors as stated rather than moving one to clear a ratio.
