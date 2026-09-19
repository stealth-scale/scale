# @stealthscale/theme-carnival

`@stealthscale/theme-carnival` states Carnival: a red product with orange and yellow beside it, on
navy after dark and on cream by day. It states four colors outright, and every other value is a tint
or a mix of them.

## Install

```bash
pnpm add @stealthscale/theme-carnival
```

The theme peers on `@stealthscale/theme`. An application lists it in `theme.config.ts` and a page
switches to it with `data-theme="carnival"`.

## The values

- The navy `#2D4059` is the dark page and the ink on the light one. The red `#EA5455` is the product
  and the orange `#F07B3F` stands beside it. The yellow `#FFD460` is the accent. The light page is a
  cream, the palest tint of the yellow, and the dark page is written in a pale yellow.
- `src/tokens.ts` draws the grey ramp in the navy's hue and redraws the red, the orange and the
  yellow ramps from the three colors, each with `scaleOf`. Every other ramp is the foundation's.
- `src/semantic-tokens.ts` draws the three families from the pages and the inks with `inked`. Every
  surface is a fixed distance from the page in the page's own tint. Every line is the page mixed
  towards the ink and every faded ink is the ink mixed towards the page. `hues` draws every hue
  palette over the same pages: the red, the orange and the yellow palettes from the three colors for
  the primary, the secondary and the accent, with the errors on the red and the warnings on the
  orange, and every other from the foundation's hue. `radii` draws the corners from half a rem and
  `shadows` casts the shadows in the navy's hue.
- The faces are the foundation's system stacks, so the manifest depends on nothing for them.

## The gate

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme` for the contract:
every role of every palette in both modes, every reference, and the steps a reader has to tell
apart. The contrast checks are left out, with the reason written beside the skip: the theme keeps
its colors as stated rather than moving one to clear a ratio.
