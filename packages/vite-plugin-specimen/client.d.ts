/**
 * Declares the modules the specimen plugin serves, so that importing one type-checks.
 *
 * @remarks
 *   A catalogue references this with a triple-slash directive naming
 *   `@stealthscale/vite-plugin-specimen/client`, from a file it already compiles. Every module
 *   exists only in a build the plugin takes part in.
 */

declare module "virtual:specimen-index" {
  import { type Indexed } from "@stealthscale/vite-plugin-specimen";

  /**
   * Every page found, sorted by the path it was read from.
   */
  export const pages: readonly Indexed[];
}

declare module "virtual:specimen-fragments/*" {
  /**
   * Each scene's source, keyed by the scene's title.
   */
  export const fragments: Readonly<Record<string, string>>;

  /**
   * The components the page imports from its own package, sorted.
   */
  export const imported: readonly string[];
}

declare module "virtual:specimen-props/*" {
  import { type Dropped, type Member, type Prop } from "@stealthscale/vite-plugin-specimen";

  /**
   * The properties each part resolves to that no table draws, keyed by the part.
   */
  export const dropped: Readonly<Record<string, Dropped>>;

  /**
   * Every part against the props it takes.
   */
  export const parts: Readonly<Record<string, readonly Prop[]>>;

  /**
   * The named types those props refer to, keyed by the package and the name.
   */
  export const shapes: Readonly<Record<string, readonly Member[]>>;
}
