# @stealthscale/theme-blush

`@stealthscale/theme-blush` states Blush: a pink product on navy and pearl, with round corners. It
states four colors outright, and every other value is a tint or a mix of them.

## Install

```bash
pnpm add @stealthscale/theme-blush
```

The theme peers on `@stealthscale/theme`. An application lists it in `theme.config.ts` and a page
switches to it with `data-theme="blush"`.

## The values

- The navy `#021A54` is the dark page and the ink on the light one. The pink `#FF85BB` is the
  product. The petal `#FFCEE3` is the pink's muted fill and the ink on the dark page. The pearl
  `#F5F5F5` is the light page.
- `src/tokens.ts` draws the grey ramp in the navy's hue, held to a low chroma so a grey control
  reads as grey beside the pink, and redraws the pink ramp from the pink with `scaleOf`. Every other
  ramp is the foundation's.
- `src/semantic-tokens.ts` draws the three families from the pages and the inks with `inked`. Every
  surface is a fixed distance from the page in the page's own tint. Every line is the page mixed
  towards the ink and every faded ink is the ink mixed towards the page. `hues` draws every hue
  palette over the same pages: the pink palette from the pink for the primary and the accent, with
  the petal as its muted fill in light mode, the grey from the ink for the secondary, and every
  other from the foundation's hue. `radii` draws the corners from one rem and `shadows` casts the
  shadows in the navy's hue.
- The faces are the foundation's system stacks, so the manifest depends on nothing for them.

## The gate

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme` for the contract:
every role of every palette in both modes, every reference, and the steps a reader has to tell
apart. The contrast checks are left out, with the reason written beside the skip: the theme keeps
its colors as stated rather than moving one to clear a ratio.
