/**
 * Emits the licence notices of the dependencies a bundle includes.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Writes the licence of every dependency the bundle includes into a file in the output directory.
 *
 * @remarks
 *   The minifier strips attribution comments out of the dependency code the bundle includes, and
 *   most licences require the notice to ship with the code. The emitted file supplies that notice.
 */
export function licences(): Preset {
  return preset({ config: { build: { license: true } }, name: "build.licences" });
}
