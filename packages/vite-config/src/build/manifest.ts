/**
 * Publishes the mapping a server needs to find a hashed file by its source name.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Writes a manifest mapping each source entry to the built file and the chunks that file imports.
 *
 * @remarks
 *   The bundler puts a content hash in each file name, so the name changes whenever the file does.
 *   A server rendering the document reads the built name out of the manifest.
 */
export function manifest(): Preset {
  return preset({ config: { build: { manifest: true } }, name: "build.manifest" });
}
