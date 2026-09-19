# @stealthscale/theme-pine

`@stealthscale/theme-pine` states Pine: a green product with teal and sage beside it, on the night
after dark and on the palest sage by day. It states four colors outright, and every other value is a
tint or a mix of them.

## Install

```bash
pnpm add @stealthscale/theme-pine
```

The theme peers on `@stealthscale/theme`. An application lists it in `theme.config.ts` and a page
switches to it with `data-theme="pine"`.

## The values

- The night `#092328` is the dark page and the ink on the light one. The teal `#12544F` stands
  beside the product. The green `#2A835F` is the product. The sage `#8BBB92` is the ink on the dark
  page and the accent. The light page is the palest tint of the sage.
- `src/tokens.ts` draws the grey ramp in the night's hue and gives the three greens the three ramps
  nearest them, the sage as the green, the green as the teal and the teal as the cyan, each with
  `scaleOf`. Every other ramp is the foundation's.
- `src/semantic-tokens.ts` draws the three families from the pages and the inks with `inked`. Every
  surface is a fixed distance from the page in the page's own tint. Every line is the page mixed
  towards the ink and every faded ink is the ink mixed towards the page. `hues` draws every hue
  palette over the same pages: the teal, the cyan and the green palettes from the green, the teal
  and the sage for the primary, the secondary and the accent, with the successes on the sage, and
  every other from the foundation's hue. `radii` draws the corners from half a rem and `shadows`
  casts the shadows in the night's hue.
- The faces are the foundation's system stacks, so the manifest depends on nothing for them.

## The gate

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme` for the contract:
every role of every palette in both modes, every reference, and the steps a reader has to tell
apart. The contrast checks are left out, with the reason written beside the skip: the theme keeps
its colors as stated rather than moving one to clear a ratio.
