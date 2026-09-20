/**
 * Gives a package that renders one call to add beside its tier.
 */

import { type Layer } from "@stealthscale/vite-config";

import * as plugin from "#plugin/index.ts";
import * as test from "#test/index.ts";

/**
 * Says what a package renders beyond its components.
 */
export interface Rendering {
  /**
   * Whether the React Compiler memoises what the package renders, and what to write the memo cache
   * against. It runs against the installed React unless this states a target, `build` runs it
   * under a build alone for a faster dev loop, and `false` drops it.
   */
  compiler?: "build" | boolean | plugin.Compiled;

  /**
   * Whether the package writes documents in MDX, which adds the plugin that compiles them.
   */
  mdx?: boolean;
}

/**
 * Reads the compiler's own layers out of what a caller stated about it.
 */
function compiling(stated: Rendering["compiler"]): readonly Layer[] {
  if (stated === false) return [];
  if (stated === "build") return plugin.compiler({ only: "build" });

  return plugin.compiler(typeof stated === "object" ? stated : {});
}

/**
 * Composes the JSX transform, the icon import rewrite, the document its tests render into, and
 * the MDX compiler where a package asks for one.
 *
 * @remarks
 *   No rule and no format appears here. A linter and a formatter read the root configuration only,
 *   so a package repeating them lints nothing extra and slows its own build down.
 * @param stated - The document formats the package renders beside its components. Omitting it
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
