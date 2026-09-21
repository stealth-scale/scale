/**
 * Refuses a Node built-in in a library packed for a browser.
 */

import { isBuiltin } from "node:module";
import { type Plugin, type UserConfig } from "vite";

import { appended, type Override, override } from "@stealthscale/vite-config-core";

import { type Packing } from "#pack/settings.ts";

/**
 * The configuration key the packer reads its plugins from.
 */
const AT = "pack.plugins";

/**
 * The platforms a browser has to be able to load, and so the ones a built-in is refused under.
 */
const BROWSED: ReadonlySet<Packing["platform"]> = new Set(["browser", "neutral"]);

/**
 * Builds the plugin that ends the pack at the first import of a Node built-in.
 *
 * @remarks
 *   A platform of `neutral` or `browser` tells the packer which conditions to resolve under and
 *   nothing about built-ins: an import of `node:fs` is left as an external the browser fails to
 *   load. The failure is moved to the pack, where it names the file.
 */
function refusing(): Plugin {
  return {
    name: "stealth:pack.builtins",

    /**
     * Throws for a specifier Node answers with a built-in module.
     *
     * @throws {@link Error} When the specifier names a Node built-in.
     */
    resolveId(id, importer): undefined {
      if (!isBuiltin(id)) return undefined;

      throw new Error(
        `${importer ?? "an entry"} imports ${id}, which is a Node built-in, and this library is ` +
          "packed for a browser. Move the import behind a server-only entry, or pack the library " +
          "for node.",
      );
    },
  };
}

/**
 * Reports whether every bundle the packer builds is packed for a platform a browser loads.
 *
 * @remarks
 *   A bundle stating no platform is packed for node, which is the packer's own default, and a
 *   library that states `node` over a browser tier, because it reads files under a test runner, is
 *   packed for node too. Neither is refused a built-in.
 */
function browsed(config: UserConfig): boolean {
  const packs: readonly Packing[] = [config.pack ?? {}].flat();

  return packs.every((one) => BROWSED.has(one.platform));
}

/**
 * Ends the pack at the first import of a Node built-in, where the library is packed for a browser.
 *
 * @remarks
 *   An override rather than a contribution, because the platform in effect is decided by every
 *   layer a package states, and only an override reads the composed configuration. The plugin is
 *   appended to the packer's list where the platform is `browser` or `neutral`, and left out where
 *   the library is packed for node.
 */
export function builtins(): Override {
  return override({
    because: "a browser loads no Node built-in, and the pack is where the import can be named",
    name: "pack.builtins",
    refine: (_context, config) => (browsed(config) ? appended(config, AT, refusing()) : config),
  });
}
