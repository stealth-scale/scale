/**
 * Configures the modulepreload links the bundler emits for the modules a chunk imports.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Emits the modulepreload links without the polyfill the bundler injects for them.
 *
 * @remarks
 *   The polyfill is an inline script the document runs before anything else, so omitting it
 *   assumes every targeted browser implements `modulepreload`. A browser that does not still loads
 *   the application, one round trip slower per chunk.
 */
export function preload(): Preset {
  return preset({
    config: { build: { modulePreload: { polyfill: false } } },
    name: "build.preload",
  });
}
