/**
 * Bundles the build layers an application extends into one group per kind of target.
 */

import { type Layer } from "@stealthscale/vite-config-core";

import { chunks } from "#build/chunks.ts";
import { inventory } from "#build/inventory.ts";
import { licences } from "#build/licences.ts";
import { manifest } from "#build/manifest.ts";
import { preload } from "#build/preload.ts";
import { sourcemaps } from "#build/sourcemaps.ts";

/**
 * Returns the build layers that apply to any target, browser or not.
 *
 * @remarks
 *   Every other layer in this directory shapes an artefact a browser downloads over a network, so
 *   a build for any other target takes none of them.
 */
export function base(): readonly Layer[] {
  return [sourcemaps()];
}

/**
 * Returns the base group plus the layers an application a browser runs needs.
 *
 * @remarks
 *   Code splitting, preloading and the asset manifest all assume a browser target. A server-side
 *   build takes {@link base} and none of these.
 */
export function web(): readonly Layer[] {
  return [...base(), chunks(), inventory(), licences(), manifest(), preload()];
}
