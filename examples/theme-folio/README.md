# @stealthscale/example-theme-folio

`@stealthscale/example-theme-folio` states Folio, an editorial product set to be read. It puts a
violet brand on greys tinted to match, sets body text a step larger than the foundation's, climbs
the scale by a major third, and reads in a serif. It is a root theme, like Fathom, that also moves
the type, the faces and the depth.

## Run it

```bash
pnpm --filter @stealthscale/example-theme-folio test
pnpm --filter @stealthscale/example-theme-folio build
```

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme`, which measures
every text pair at 7:1, the tertiary ink and every label at 4.5:1, and every line and ring at 3:1
against the pages this theme draws. The other specifications pin the scale, the faces, the colors
and the shadows.

## The values

- `src/colors.ts` states the colors. The page is at 97.5% lightness in light mode, half a point
  short of 98 so a panel still rises before it reaches white, and at 13% in dark mode. Each page is
  written in a grey with a trace of the violet, and the primary is the violet.
- `src/index.ts` defines the theme from the colors and three more axes. `type` sets the scale from a
  body size of 1.0625rem and a ratio of 1.25, so the sizes and the size styles climb together and
  the styles go into the preset alone. `faces` sets the body in the system serif stack, which the
  headings follow. `depth` casts every shadow with half again the default ink in the violet's hue,
  because an editorial page shows few surfaces and each one is meant to lift off the paper. The
  corners are the foundation's.

## The configuration

```ts
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [theme.layers()] });
```

`theme.layers()` contributes nothing. The theme is written by hand and its own specification runs it
through the gate, so no plugin runs here.
