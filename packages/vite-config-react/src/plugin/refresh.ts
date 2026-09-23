/**
 * Configures `@vitejs/plugin-react` for JSX compilation and Fast Refresh.
 */

import react, { type Options } from "@vitejs/plugin-react";

import { contribute, type Contribution } from "@stealthscale/vite-config";

/**
 * Config key the plugin is added to.
 */
const AT = "plugins";

/**
 * File patterns the plugin compiles: TypeScript, JavaScript and MDX.
 */
const COMPILED = [/\.[tj]sx?$/u, /\.mdx$/u];

/**
 * Dependency path pattern. Installed packages ship compiled code.
 */
const UNTOUCHED = /\/node_modules\//u;

/**
 * Specimen file pattern, excluded from Fast Refresh.
 *
 * @remarks
 *   The plugin still compiles JSX in an excluded file, because `exclude` applies to the refresh
 *   transform only. A specimen exports scenes and constants next to its components. The refresh
 *   runtime rejects such a module as a boundary and invalidates it on every edit, so the update
 *   reaches the application modules. The specimen plugin makes each specimen self-accept instead.
 */
const SPECIMEN = /\.specimen\.[tj]sx$/u;

/**
 * Example file pattern, excluded from Fast Refresh for the reason {@link SPECIMEN} gives.
 *
 * @remarks
 *   Each example carries the `source` string export that the specimen plugin appends. Measured on
 *   2026-09-23, the invalidation forced a full page reload on every example edit in the bundled dev
 *   server. Without a refresh boundary, the update propagates to the importing specimen, which
 *   self-accepts.
 */
const EXAMPLE = /\.example\.tsx$/u;

/**
 * Default package the JSX factory is imported from.
 */
export const FACTORY = "react";

/**
 * Overrides of the plugin defaults.
 *
 * @remarks
 *   Each field extends or replaces one default and leaves the others unchanged.
 */
export interface Refreshed {
  /**
   * File patterns compiled in addition to the defaults.
   */
  also?: readonly RegExp[];

  /**
   * Path patterns excluded in addition to dependencies, specimen files and example files.
   */
  except?: readonly RegExp[];

  /**
   * Package the automatic runtime imports the JSX factory from.
   */
  from?: string;
}

/**
 * Returns the plugin options for a set of overrides.
 *
 * @remarks
 *   The automatic runtime imports the factory, so no file needs React in scope. The shipped
 *   `web.json` sets the same factory for the type checker, and a caller who changes `from` must
 *   change the tsconfig to match. The plugin's own `compiler` option stays unset. It resolves the
 *   compiler from the plugin directory, which an isolated `node_modules` layout rejects, and it
 *   disables Fast Refresh. The React Compiler runs as a separate Babel pass instead.
 */
export function options(stated: Refreshed): Options {
  return {
    exclude: [UNTOUCHED, SPECIMEN, EXAMPLE, ...(stated.except ?? [])],
    include: [...COMPILED, ...(stated.also ?? [])],
    jsxImportSource: stated.from ?? FACTORY,
    jsxRuntime: "automatic",
  };
}

/**
 * Adds a new React plugin instance to the plugins of a tier on every call.
 *
 * @param stated - Overrides of the defaults. Omit it for a TypeScript package that renders with
 *   React.
 */
export function refresh(stated: Refreshed = {}): Contribution {
  return contribute({
    at: AT,
    because: "a package that renders has to compile JSX before anything can run it",
    item: react(options(stated)),
    name: "react.plugin.refresh",
  });
}
