/**
 * Groups the pack layers a library extends, one group per runtime it targets.
 */

import { type Layer } from "@stealthscale/vite-config-core";

import { builtins } from "#pack/builtins.ts";
import { carry } from "#pack/carry.ts";
import { declarations } from "#pack/declarations.ts";
import { inventory } from "#pack/inventory.ts";
import { platform } from "#pack/platform.ts";
import { published } from "#pack/published.ts";
import { quality } from "#pack/quality.ts";
import { source } from "#pack/source.ts";

/**
 * Gathers what holds for every published library, whatever it runs on.
 *
 * @remarks
 *   The group derives its entries from the manifest, so a package extending it states what it
 *   publishes in `package.json` and nowhere else.
 */
export function base(): readonly Layer[] {
  return [carry(), declarations(), inventory(), published(), quality(), source()];
}

/**
 * Extends the base group for a library that only ever runs on a server.
 *
 * @remarks
 *   The platform is stated rather than left to the packer's default, which happens to be node, so
 *   the choice is visible where it is made and survives a packer whose default changes.
 */
export function node(): readonly Layer[] {
  return [...base(), platform("node")];
}

/**
 * Extends the base group for a library a browser has to be able to load.
 *
 * @remarks
 *   The runtime is fixed to neutral rather than to the browser, because a library reaching the
 *   browser is usually also imported by a server rendering it. Neutral says nothing about
 *   built-ins, so the pack refuses them separately: a Node built-in reached from such a library
 *   fails the pack rather than the browser. A package on this tier that states
 *   `pack.platform("node")` over it, because it reads files under a test runner, is packed for node
 *   and refused nothing.
 */
export function web(): readonly Layer[] {
  return [...base(), platform("neutral"), builtins()];
}
