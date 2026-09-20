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

## The statement

- The paper is the foundation's light page and the night its dark page, so the theme keeps the
  foundation's greys. The paper is written in a charcoal at 18% lightness, and the night in the
  paper.
- The primary is a lighter charcoal by day and white after dark, which is the black button the
  components were drawn against. The blue `#2563EB` is the accent, the secondary and the keyword
  ink, so links and focus rings are blue on a grey brand.
- `src/colors.ts` states those colors and `src/index.ts` defines the theme from them. `defineTheme`
  draws every surface, ink, line and palette from the statement, and the blue palette for an
  application that names it. The blue is the most saturated color the theme states, so every status
  is drawn at its canonical chroma and the statuses stay as loud as the brand.
- Ink states no axis beside its colors, so its faces, type, metrics, motion, shape and depth are the
  foundation's. It is the theme the components were drawn against, and a page that switches to it
  sees the foundation as the recipes were written for it.

## The gate

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme`: every role of
every palette in both modes, every reference, every text pair at 7:1, the tertiary ink and every
label at 4.5:1, every boundary and ring at 3:1, the statuses apart from each other and from the
brand, and the steps a reader has to tell apart. Nothing is skipped.
