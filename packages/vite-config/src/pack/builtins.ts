/**
 * Fails a pack that imports a Node built-in into a library built for a browser.
 */

import { isBuiltin } from "node:module";
import { type Plugin, type UserConfig } from "vite";

import { appended, type Override, override } from "@stealthscale/vite-config-core";

import { type Packing } from "#pack/settings.ts";

/**
 * The key the packer reads its plugins from.
 */
const AT = "pack.plugins";

/**
 * The platforms a browser loads, and so the ones where a Node built-in is refused.
 */
const BROWSED: ReadonlySet<Packing["platform"]> = new Set(["browser", "neutral"]);

/**
 * Builds the plugin that fails the pack on the first import of a Node built-in.
 *
 * @remarks
 *   A platform of `neutral` or `browser` only tells the packer which conditions to resolve under.
 *   It says nothing about built-ins, so an import of `node:fs` is left as an external and the
 *   failure surfaces in the browser at load time. Failing during the pack names the file that made
 *   the import, which a browser's load error does not.
 */
function refusing(): Plugin {
  return {
    name: "stealth:pack.builtins",

    /**
     * Hands every specifier back to the packer to resolve.
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
 * Reports whether every bundle the packer builds targets a platform a browser loads.
 *
 * @remarks
 *   A bundle that states no platform is packed for node, the packer's default. Neither that bundle
 *   nor a library stating `node` over a browser tier is refused a built-in.
 */
function browsed(config: UserConfig): boolean {
  const packs: readonly Packing[] = [config.pack ?? {}].flat();

  return packs.every((one) => BROWSED.has(one.platform));
}

/**
 * Builds the override that refuses a Node built-in when the library is packed for a browser.
 *
 * @remarks
 *   Any layer a package states can change the platform in effect, and an override is the only kind
 *   of layer that reads the composed config. Hence an override rather than a plain contribution.
 */
export function builtins(): Override {
  return override({
    because: "a browser loads no Node built-in, and the pack is where the import can be named",
    name: "pack.builtins",
    refine: (_context, config) => (browsed(config) ? appended(config, AT, refusing()) : config),
  });
}
