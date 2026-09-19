# @stealthscale/theme-harbour

`@stealthscale/theme-harbour` states Harbour: a steel blue product on navy and mist. It states four
colors outright, and every other value is a tint or a mix of them.

## Install

```bash
pnpm add @stealthscale/theme-harbour
```

The theme peers on `@stealthscale/theme`. An application lists it in `theme.config.ts` and a page
switches to it with `data-theme="harbour"`.

## The values

- The navy `#1B3C53` is the dark page and the ink on the light one. The deep blue `#234C6A` is the
  panel on the dark page and the secondary by day. The steel blue `#456882` is the product by day
  and the secondary after dark. The mist `#E3E3E3` is the light page, the ink on the dark one and
  the product after dark, where the steel blue would sink into the navy.
- `src/tokens.ts` draws the grey ramp in the navy's hue, redraws the blue ramp from the steel blue
  and gives the deep blue the indigo ramp, each with `scaleOf`. Every other ramp is the
  foundation's.
- `src/semantic-tokens.ts` draws the three families from the pages and the inks with `inked`. Every
  surface is a fixed distance from the page in the page's own tint. Every line is the page mixed
  towards the ink and every faded ink is the ink mixed towards the page. `hues` draws every hue
  palette over the same pages: the blue palette from the steel blue by day and the mist after dark
  for the primary, the indigo palette from the deep blue by day and the steel blue after dark for
  the secondary and the accent, and every other from the foundation's hue. `radii` draws the corners
  from three eighths of a rem and `shadows` casts the shadows in the navy's hue.
- The faces are the foundation's system stacks, so the manifest depends on nothing for them.

## The gate

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme` for the contract:
every role of every palette in both modes, every reference, and the steps a reader has to tell
apart. The contrast checks are left out, with the reason written beside the skip: the theme keeps
its colors as stated rather than moving one to clear a ratio.
