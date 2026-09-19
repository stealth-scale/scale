# @stealthscale/theme-dusk

`@stealthscale/theme-dusk` states Dusk: a coral product with mauve and plum beside it, on navy after
dark and on the palest coral by day, with soft corners. It states four colors outright, and every
other value is a tint or a mix of them.

## Install

```bash
pnpm add @stealthscale/theme-dusk
```

The theme peers on `@stealthscale/theme`. An application lists it in `theme.config.ts` and a page
switches to it with `data-theme="dusk"`.

## The values

- The coral `#F67280` is the product. The mauve `#C06C84` and the plum `#6C5B7B` stand beside it.
  The navy `#355C7D` is the dark page and the ink on the light one. The light page is the palest
  tint of the coral, the dark page is written in a pale coral, and the plum is the panel on it.
- `src/tokens.ts` draws the grey ramp in the navy's hue and a ramp for each of the coral, the mauve
  and the plum, each with `scaleOf`. Every other ramp is the foundation's.
- `src/semantic-tokens.ts` draws the three families from the pages and the inks with `inked`. Every
  surface is a fixed distance from the page in the page's own tint. Every line is the page mixed
  towards the ink and every faded ink is the ink mixed towards the page. `hues` draws every hue
  palette over the same pages: the red palette from the coral for the primary, the pink palette from
  the mauve for the secondary, the purple palette from the plum by day and from the pale coral after
  dark for the accent, and every other from the foundation's hue. `radii` draws the corners from
  three quarters of a rem and `shadows` casts the shadows in the navy's hue.
- The faces are the foundation's system stacks, so the manifest depends on nothing for them.

## The gate

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme` for the contract:
every role of every palette in both modes, every reference, and the steps a reader has to tell
apart. The contrast checks are left out, with the reason written beside the skip: the theme keeps
its colors as stated rather than moving one to clear a ratio.
