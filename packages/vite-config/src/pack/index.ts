/**
 * Collects the layers that configure the packer a library is published from.
 *
 * @remarks
 *   A package states what it publishes in its manifest and lets `published` derive the build from
 *   it, or states the entries itself with `entry`. The rest of this directory adds one packer
 *   setting each on top of whichever of the two it chose.
 */

export { builtins } from "#pack/builtins.ts";
export { carry } from "#pack/carry.ts";
export { command } from "#pack/command.ts";
export { declarations } from "#pack/declarations.ts";
export { entry } from "#pack/entry.ts";
export {
  buildBefore,
  buildDone,
  buildPrepare,
  hook,
  type Hooked,
  type Scheduled,
} from "#pack/hook.ts";
export { inventory } from "#pack/inventory.ts";
export { platform, type Platform } from "#pack/platform.ts";
export * as preset from "#pack/preset.ts";
export { published } from "#pack/published.ts";
export { quality } from "#pack/quality.ts";
export { type Commands } from "#pack/settings.ts";
export { source } from "#pack/source.ts";
export { subpaths } from "#pack/subpaths.ts";
