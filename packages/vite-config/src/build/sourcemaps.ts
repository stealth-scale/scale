/**
 * Configures the source maps a production build emits.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Emits a source map per chunk without the comment that points a browser at it.
 *
 * @remarks
 *   A browser requests no map without that comment, so the developer tools show the built code. An
 *   error reporter given the map files separately still resolves a stack trace against them.
 */
export function sourcemaps(): Preset {
  return preset({ config: { build: { sourcemap: "hidden" } }, name: "build.sourcemaps" });
}
