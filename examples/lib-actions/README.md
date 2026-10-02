# @stealthscale/example-lib-actions

`@stealthscale/example-lib-actions` publishes one component, `Button`, drawn by a recipe, and the
preset that registers the recipe for an application's compiler. A component package is laid out this
way: a recipe file beside each component, a component that binds its recipe, and a hand-written
`src/theme.ts` that the theme testing kit checks against the recipe files.

## Run it

```bash
pnpm --filter @stealthscale/example-lib-actions test
pnpm --filter @stealthscale/example-lib-actions build
```

`vp test` runs three specifications. The recipe's specification asserts that no value in it is a
color, a pixel length or a color mode, through `recipeViolations` from
`@stealthscale/testing-theme`. The preset's asserts that every `*.recipe.ts` file under `src/` is
registered under its class name, through `presetViolations`. The component's renders `Button` into a
happy-dom document, reads the classes the binding wrote, and checks the component against the
conformance contract of `@stealthscale/testing-react`.

The manifest publishes `./theme` beside `.`, and `build` writes `dist/index.js` for the first and
`dist/theme.js` for the second. An application's build plugin finds the package on its dependency
graph by that subpath.

## The recipe

`src/button/button.recipe.ts` declares the button with the helpers of
`@stealthscale/theme/authoring`:

- `interactive()` for the cursor, the transition and the focus ring.
- `stack()` for the row.
- `controlSizes()` for the `size` axis.
- `lookVariants()` for the `variant` axis.
- `paletteVariants()` for the `palette` axis, with the eight semantic palettes.

Every value is a semantic token, a layer style or a text style, so a theme can change each of them.
The base sets the `primary` palette, and `palette` replaces it, so an error button and a primary
button share one recipe. The axis matches the `palette` axis of `@stealthscale/component-actions`,
whose recipe has the same class name. An application that installs both packages compiles one set of
`button--palette_*` classes.

## The component

`src/button/button.ts` binds the recipe with `createRecipeContext` from `@stealthscale/theme` and
renders a `button` element through the binding. The binding sets `data-recipe="button"` on the
element and applies the class of each variant the caller passes. The recipe owns color, size and
margin, so a theme restyles every button by extending it. The binding types the component with a
type the theme package exports, so this package's declaration file imports only that package.
`ButtonProps` is derived from the component with `ComponentProps`.

## The preset

`src/theme.ts` registers the recipe under the key `button` with `definePreset`. The file is the
package's default export under `./theme`, which the house lint excuses from the rule against default
exports, because that is the file every build plugin reads a preset from.

## The configuration

```ts
import * as react from "@stealthscale/vite-config-react";
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [react.layers(), theme.layers()] });
```

`react.layers()` adds the JSX transform, the happy-dom environment and the cleanup between tests.
`theme.layers()` contributes nothing. The preset is written by hand, and the specification reports a
recipe file it leaves out. It is listed so every package lists every add-on the same way.
