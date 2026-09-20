# @stealthscale/example-theme-abyss

`@stealthscale/example-theme-abyss` states Abyss, a darker variant of Fathom. It is a derived theme.
It names Fathom as the theme it extends, moves the pages, the primary and the accent over Fathom's
colors, states a sharper corner and two recipe extensions, and inherits everything else, the inks
and the shadows included.

## Run it

```bash
pnpm --filter @stealthscale/example-theme-abyss test
pnpm --filter @stealthscale/example-theme-abyss build
```

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme` with `button` named
as the one recipe key the workspace publishes. The gate measures every pair against the deeper
pages, and reads the whole theme, Fathom's values and Abyss's own together, because a derived
theme's values are merged over its parent's when it is defined. The other specifications pin what
Abyss states and what it inherits.

## The values

- `src/colors.ts` states the pages, the primary and the accent and nothing else. Each page goes to
  93% lightness in light mode and 13% in dark mode, both inks are Fathom's and unchanged, the
  primary is the canonical indigo, and Fathom's teal becomes the accent. `defineTheme` merges the
  statement over Fathom's colors and draws every surface, ink, line and palette again from the
  whole, so nothing under `colors` is a hand-written token and nothing Fathom states is restated.
- `src/recipes/button.ts` widens the tracking of every button's label, and `src/recipes/badge.ts`
  sets every badge's label in capitals.
- `src/index.ts` defines the theme with `extends: fathom`, which nests Fathom's preset beneath
  Abyss's own so the compiler composes the lineage, draws the corners from half a rem, and lists the
  extensions under the keys `badge` and `button`.

Abyss depends on Fathom at run time, because the theme object it extends and the teal it takes as
its accent are imported, and peers on `@stealthscale/theme` like every theme.

## The configuration

```ts
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [theme.layers()] });
```

`theme.layers()` contributes nothing. The theme is written by hand and its own specification runs it
through the gate, so no plugin runs here.
