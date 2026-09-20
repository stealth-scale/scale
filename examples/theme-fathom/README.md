# @stealthscale/example-theme-fathom

`@stealthscale/example-theme-fathom` states Fathom, a deep teal product on marine greys, rounder
than the foundation and cast in its own hue. It shows how a theme package is laid out: a root theme
that states its colors in one file and the theme in another, and publishes its colors for a theme
built on it. Nothing in it refers to a component.

## Run it

```bash
pnpm --filter @stealthscale/example-theme-fathom test
pnpm --filter @stealthscale/example-theme-fathom build
```

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme`: every role of
every palette in both modes, every reference, every extension, every text pair at 7:1, the tertiary
ink and every label at 4.5:1, every line and ring at 3:1, and the steps a reader has to tell apart,
measured against the foundation the theme is layered on. The other specifications pin what the theme
states.

`build` writes `dist/index.js`. The theme peers on `@stealthscale/theme` and imports its authoring
entry alone, so the runtime stays out of the bundle.

## The values

- `src/colors.ts` states the colors. The page is at 96% lightness in light mode and 15% in dark
  mode, tinted between the greys and the product, and each page is written in a grey tinted a little
  bluer than the product. The primary is the teal, the accent the canonical cyan and the secondary
  the canonical indigo. `defineTheme` draws every surface, ink, line and palette from those.
- `src/index.ts` defines the theme from the colors, with the corners drawn from one rem and the
  shadows cast in the neutral hue, and publishes the colors as `COLORS`.

The faces are the foundation's system stacks, so the manifest lists no font package.

## The configuration

```ts
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [theme.layers()] });
```

`theme.layers()` contributes nothing. The theme is written by hand and its own specification runs it
through the gate, so no plugin runs here. It is listed so every package lists every add-on the same
way.
