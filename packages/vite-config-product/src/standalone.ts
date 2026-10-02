/**
 * Serves a plugin's standalone page from the plugin's own package under a dev server.
 */

import { build, type Layer, lint, named, server } from "@stealthscale/vite-config";
import { stylesheet } from "@stealthscale/vite-config-theme";

import { composed } from "#composed.ts";
import { type ConfigEnv, type StandalonePage } from "#types.ts";

/**
 * Lists what the standalone page runs and offers, and the definition it runs where an author
 * writes one.
 */
export interface StandaloneOptions extends StandalonePage {
  /**
   * Path of a definition module the author writes, from the package root. The product plugin
   * writes one from `manifest` and `beside` where left out.
   */
  readonly definition?: string | undefined;
}

/**
 * Returns true under a dev server, and false under a build or a specification run.
 */
function serving({ command, mode }: ConfigEnv): boolean {
  return command === "serve" && mode !== "test";
}

/**
 * Returns the layers that serve a plugin's standalone page under a dev server: the product plugin
 * with the page, the stylesheet compiler, an application's chunks and the bundling server.
 *
 * @remarks
 *   The page runs the plugin under a real host, installs each plugin in `beside` from its contract
 *   alone, and renders the development panel over the page. The page is an application, so it
 *   takes an application's stylesheet and chunks. The chunks place each module by its path alone:
 *   the plugin's chunk then contains its lazy modules alone, and no component runs before the
 *   React refresh runtime is installed. A build and a specification run of the package take none of
 *   the four, so a pack and a test compile no stylesheet. Where `definition` names the author's
 *   module, a fifth layer excuses its default export.
 * @param options - The page's manifest module, the contracts beside the plugin, its locales,
 *   themes and glyphs, and the author's definition.
 */
export function standalone(options: StandaloneOptions = {}): readonly Layer[] {
  const { definition, ...page } = options;

  return [
    named("product.standalone", {
      ...composed({ definition, standalone: page }),
      apply: serving,
      because:
        "a plugin's standalone page runs the plugin under a real host beside the plugins it " +
        "names, so its author sees every page and slot before a product installs it",
    }),
    named("product.standalone.stylesheet", {
      ...stylesheet(),
      apply: serving,
      because: "the standalone page is an application, and an application compiles its stylesheet",
    }),
    named("product.standalone.chunks", { ...build.chunks(), apply: serving }),
    named("product.standalone.bundled", server.bundled()),
    ...(definition === undefined
      ? []
      : [named("product.standalone.definition", lint.defaultExported([`**/${definition}`]))]),
  ];
}
