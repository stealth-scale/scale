# @stealthscale/theme-ink

`@stealthscale/theme-ink` states Ink: the look the components were drawn against. Charcoal on paper
by day, paper on charcoal after dark, and a blue accent, on the foundation's own greys, corners and
shadows.

## Install

```bash
pnpm add @stealthscale/theme-ink
```

The theme peers on `@stealthscale/theme`. An application lists it in `theme.config.ts` and a page
switches to it with `data-theme="ink"`.

## The values

- The paper is the foundation's page, tinted a touch towards the blue, and the charcoal is the ink
  on it. After dark the night is the page and the chalk is the ink. The grey solid is a lighter
  charcoal by day and white after dark, and the blue `#2563EB` is the accent in both modes.
- `src/semantic-tokens.ts` draws the three families from the pages and the inks with `inked`. Every
  surface is a fixed distance from the page in the page's own tint. Every line is the page mixed
  towards the ink and every faded ink is the ink mixed towards the page. `hues` draws every hue
  palette over the same pages: the blue palette from the blue for the secondary and the accent, and
  every other from the foundation's hue. The grey palette, for the primary and the neutral, draws
  its solid and the text on it with `drawn` and takes its quiet fills, its lines and its inks from
  the page's own families, so a grey control and the panel behind it are drawn from one place.
- The theme redraws no ramp and states neither corners nor shadows. The faces are the foundation's
  system stacks, so the manifest depends on nothing for them.

## The gate

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme` for the contract:
every role of every palette in both modes, every reference, and the steps a reader has to tell
apart. The contrast checks are left out, with the reason written beside the skip: the theme keeps
its colors as stated rather than moving one to clear a ratio.
