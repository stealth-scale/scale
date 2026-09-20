# @stealthscale/example-theme-forge

`@stealthscale/example-theme-forge` states Forge, a warm and quick product for an operations
console. It draws cream surfaces and an amber brand, casts its shadows flatter than the foundation,
and sets every button's label in capitals. It is a root theme that also extends a recipe, which is
the one thing Fathom and Folio leave out.

## Run it

```bash
pnpm --filter @stealthscale/example-theme-forge test
pnpm --filter @stealthscale/example-theme-forge build
```

`vp test` runs the theme through `violations` from `@stealthscale/testing-theme` with `button` named
as the one recipe key the workspace publishes. The gate measures every pair against the cream,
reports an extension file under `src/recipes/` that `src/index.ts` does not list, and reports an
extension naming a key nothing publishes. One case runs the gate with no key at all, so the last
report is pinned.

## The values

- `src/colors.ts` states the colors. The page is at 96% lightness in light mode and 14% in dark
  mode, tinted cream, and each page is written in a grey tinted warm enough to sit under the amber
  without going green. The primary is the amber, read a step lighter by day the way every warm hue
  is, so warnings take a yellow leaning towards orange: far enough from the amber to be told from
  it, and near enough to the hue a warning is read from to keep its identity. The secondary is the
  warm grey and the accent the canonical teal.
- `src/recipes/button.ts` extends the button, setting its labels in capitals with wide tracking. The
  type refuses `className` and `slots` in an extension, because the recipe file in the component
  package decides both.
- `src/index.ts` defines the theme from the colors, casts every shadow with half the default ink in
  the neutral hue because a dense screen draws many surfaces at once, and lists the extensions under
  the keys `button` and `card`.

## The configuration

```ts
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [theme.layers()] });
```

`theme.layers()` contributes nothing. The theme is written by hand and its own specification runs it
through the gate, so no plugin runs here.
