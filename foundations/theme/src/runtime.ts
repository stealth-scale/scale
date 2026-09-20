/**
 * Re-exports the generated runtime under this package's own name, by a curated list.
 *
 * @remarks
 *   Everything here is generated from the foundation when this package is built, and every other
 *   package reads it through `@stealthscale/theme`. The list is curated rather than a wildcard,
 *   because the generated JSX module exports a `createRecipeContext` of its own, which a wildcard
 *   would publish over the binding this package defines. `cva` and `sva` stay out: a component
 *   styles itself through its config recipe, and the generated slot context reads `sva` itself.
 *   The breakpoints are published as the foundation states them rather than through `token`,
 *   because the token map is 32 kB of values a page reads five of, and a reader of `token` keeps
 *   the whole map in the bundle.
 */

export { COLOR_MODE_ATTRIBUTE, THEME_ATTRIBUTE } from "#attributes.ts";
export { breakpointKeys } from "#generated/css/conditions.mjs";
export { css, cx } from "#generated/css/index.mjs";
export { styled } from "#generated/jsx/index.mjs";
export { token } from "#generated/tokens/index.mjs";
export type * from "#generated/types/jsx.d.mts";
export type * from "#generated/types/recipe.d.mts";
export type * from "#generated/types/system.d.mts";
export type * from "#generated/types/tokens.d.mts";
export { breakpoints } from "#preset/breakpoints.ts";
