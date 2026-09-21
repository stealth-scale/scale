/**
 * Sets the public path a built application is served under.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Prefixes every generated asset reference with the path the deployment serves under.
 *
 * @remarks
 *   The bundler writes the prefix into each reference at build time, so a bundle built for one path
 *   cannot be moved to another without a rebuild. A deployment that may move passes `./`, which
 *   leaves every generated reference relative.
 * @param at - The path, or the full origin, the bundle is served from.
 */
export function base(at: string): Preset {
  return preset({ config: { base: at }, name: `build.base(${at})` });
}
