/**
 * Declares a dependency Vite's static import scan cannot find on its own.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

/**
 * The config path of the specifier list Vite prebundles before it serves.
 */
const AT = "optimizeDeps.include";

/**
 * The specifiers to prebundle, and one reason covering why the scan misses all of them.
 */
export interface Prebundled {
  /**
   * The reason a static read of the source does not find these imports.
   */
  because: string;

  /**
   * Each specifier exactly as an import writes it, deep subpath included.
   */
  deps: readonly string[];
}

/**
 * Prebundles each specifier to ESM whether or not the dependency scan found it.
 *
 * @remarks
 *   A dependency reached only through a dynamic import or a computed specifier is discovered
 *   mid-session, and that discovery costs a page reload. A specifier listed here is prebundled
 *   before the server handles its first request.
 * @returns One contribution per specifier, or an empty array when deps is empty.
 */
export function prebundle(stated: Prebundled): readonly Contribution[] {
  return stated.deps.map((held) =>
    contribute({ at: AT, because: stated.because, item: held, name: `deps.prebundle(${held})` }),
  );
}
