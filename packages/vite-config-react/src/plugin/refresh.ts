/**
 * Configures the React plugin that compiles JSX and refreshes a component in place.
 */

import react, { type Options } from "@vitejs/plugin-react";

import { contribute, type Contribution } from "@stealthscale/vite-config";

/**
 * The configuration key the plugin joins.
 */
const AT = "plugins";

/**
 * The file kinds the transform reads, covering both TypeScript and markdown that renders.
 */
const COMPILED = [/\.[tj]sx?$/u, /\.mdx$/u];

/**
 * The path a dependency is installed under, left uncompiled because it ships compiled already.
 */
const UNTOUCHED = /\/node_modules\//u;

/**
 * A specimen file, left out of the refresh transform.
 *
 * @remarks
 *   The JSX in it still compiles, because the plugin sets the JSX transform for every file in its
 *   configuration and reads `exclude` for the refresh transform alone. What it is spared is the
 *   refresh runtime's judgement: a specimen exports scenes and constants beside its components,
 *   which the runtime reads as a module it cannot refresh, so it invalidates the module on every
 *   edit and the update climbs to the application's own modules. The specimen plugin gives the
 *   file a hot update boundary of its own, and the runtime's invalidation would undo it.
 */
const SPECIMEN = /\.specimen\.[tj]sx$/u;

/**
 * The package the JSX factory is imported from unless a caller names another one.
 */
export const FACTORY = "react";

/**
 * Widens or narrows the transform a package inherits.
 *
 * @remarks
 *   Every field widens or narrows a default rather than replacing it, so a caller setting one
 *   keeps the behaviour of the rest. A field left undefined takes the value this package ships.
 */
export interface Refreshed {
  /**
   * Extra file kinds to compile, added after the ones compiled by default.
   */
  also?: readonly RegExp[];

  /**
   * Extra paths to leave alone, added after the dependency directory and the specimen files.
   */
  except?: readonly RegExp[];

  /**
   * The package the automatic runtime imports the JSX factory from.
   */
  from?: string;
}

/**
 * Fills in what a caller left out and hands the result to the React plugin.
 *
 * @remarks
 *   The automatic runtime imports the factory itself, so no file under this transform needs React
 *   in scope. The shipped `web.json` sets the same factory for the type checker, and a caller
 *   changing `from` here has to change the tsconfig with it or the two disagree.
 *   The plugin's own `compiler` option is left alone. It asks the plugin to resolve the compiler
 *   from its own directory, which an isolated node_modules refuses, and setting it also turns
 *   fast refresh off. The compiler runs as a Babel pass of its own instead.
 */
export function options(stated: Refreshed): Options {
  return {
    exclude: [UNTOUCHED, SPECIMEN, ...(stated.except ?? [])],
    include: [...COMPILED, ...(stated.also ?? [])],
    jsxImportSource: stated.from ?? FACTORY,
    jsxRuntime: "automatic",
  };
}

/**
 * Adds the React plugin to whatever plugins a tier already built.
 *
 * @remarks
 *   The plugin is constructed when this call runs, not when the configuration resolves, so two
 *   calls produce two independent plugin instances.
 * @param stated - The parts of the transform to change. Omitting it compiles a TypeScript package
 *   rendering through React itself.
 */
export function refresh(stated: Refreshed = {}): Contribution {
  return contribute({
    at: AT,
    because: "a package that renders has to compile JSX before anything can run it",
    item: react(options(stated)),
    name: "react.plugin.refresh",
  });
}
