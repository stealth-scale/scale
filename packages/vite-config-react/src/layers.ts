/**
 * Assembles the configuration layers a rendering package adds to its tier.
 */

import { type Layer } from "@stealthscale/vite-config";

import * as plugin from "#plugin/index.ts";
import * as test from "#test/index.ts";

/**
 * Formats a package renders beyond its components.
 */
export interface Rendering {
  /**
   * React Compiler settings, including the React version its memo cache is written for.
   *
   * @remarks
   *   With nothing stated, the compiler targets the installed React. `build` runs the compiler
   *   under a build alone, for a faster dev loop. `false` drops both compiler layers.
   */
  compiler?: "build" | boolean | plugin.Compiled;

  /**
   * Whether to add the plugin that compiles an MDX document into a component.
   */
  mdx?: boolean;
}

/**
 * Builds the compiler's layers from what the caller stated.
 */
function compiling(stated: Rendering["compiler"]): readonly Layer[] {
  if (stated === false) return [];
  if (stated === "build") return plugin.compiler({ only: "build" });

  return plugin.compiler(typeof stated === "object" ? stated : {});
}

/**
 * Composes the JSX transform, the icon import rewrite, the document tests render into, and the MDX
 * compiler where a package asks for one.
 *
 * @remarks
 *   No lint rule and no formatter setting appears here. Both read the root configuration only, so a
 *   package repeating them lints nothing extra and slows its own build down.
 * @param stated - Document formats the package renders in addition to its components. Omitting it
 *   compiles JSX alone.
 * @returns Each layer under the name of the call that produced it, so a consumer can drop one by
 *   name and keep the rest.
 */
export function layers(stated: Rendering = {}): readonly Layer[] {
  return [
    plugin.refresh(),
    plugin.icons(),
    ...compiling(stated.compiler),
    test.cleanup(),
    test.document(),
    ...(stated.mdx === true ? plugin.mdx() : []),
  ];
}
