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
 * Returns the pack layers every published library extends, whatever runtime it targets.
 *
 * @remarks
 *   The group derives its entries from the manifest, so a package extending it states what it
 *   publishes in `package.json` and nowhere else.
 */
export function base(): readonly Layer[] {
  return [carry(), declarations(), inventory(), published(), quality(), source()];
}

/**
 * Returns the base group with the platform set to node, for a library that runs only on a server.
 *
 * @remarks
 *   The platform is stated where the packer would default to it, so the choice survives a change
 *   to that default.
 */
export function node(): readonly Layer[] {
  return [...base(), platform("node")];
}

/**
 * Returns the base group with the platform set to neutral and a layer refusing Node built-ins.
 *
 * @remarks
 *   The platform is neutral and not browser, because a server rendering the library usually
 *   imports it too. Neutral tells the packer nothing about built-ins, so `pack.builtins` refuses
 *   them separately and an import of one fails the pack.
 */
export function web(): readonly Layer[] {
  return [...base(), platform("neutral"), builtins()];
}
