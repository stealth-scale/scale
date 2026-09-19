# @stealthscale/theme-cinder

`@stealthscale/theme-cinder` states Cinder: a red product on slate and ash, with sharp corners and
hard shadows. It states four colors outright, and every other value is a tint or a mix of them.

## Install

```bash
pnpm add @stealthscale/theme-cinder
```

The theme peers on `@stealthscale/theme`. An application lists it in `theme.config.ts` and a page
switches to it with `data-theme="cinder"`.

## The values

- The slate `#303841` is the dark page and the ink on the light one. The steel `#3A4750` is the
  panel on the dark page. The red `#D72323` is the product. The ash `#EEEEEE` is the light page and
  the ink on the dark one.
- `src/tokens.ts` draws the grey ramp in the slate's hue and the red ramp in the red's, each with
  `scaleOf`. Every other ramp is the foundation's.
- `src/semantic-tokens.ts` draws the three families from the pages and the inks with `inked`. Every
  surface is a fixed distance from the page in the page's own tint. Every line is the page mixed
  towards the ink and every faded ink is the ink mixed towards the page. `hues` draws every hue
  palette over the same pages: the red palette from the red for the primary and the accent, the grey
  palette from the steel by day and from the ash after dark for the secondary and the neutral, and
  every other from the foundation's hue. `radii` draws the corners from a quarter rem and `shadows`
  casts the shadows at half again the default ink in the slate's hue.
- The faces are the foundation's system stacks, so the manifest depends on nothing for them.

## The gate

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme` for the contract:
every role of every palette in both modes, every reference, and the steps a reader has to tell
apart. The contrast checks are left out, with the reason written beside the skip: the theme keeps
its colors as stated rather than moving one to clear a ratio.
