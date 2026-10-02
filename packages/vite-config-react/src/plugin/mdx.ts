/**
 * Configures the compiler that turns an MDX document into a React component.
 *
 * @remarks
 *   `@mdx-js/rollup` is an optional peer and nothing here imports it at module scope. The import
 *   waits until a plugin is constructed, so the React tier loads without the compiler installed.
 *   Declare the layer without the peer and you get an error that names the package to install.
 */

import { type Plugin } from "vite";

import {
  contribute,
  type Contribution,
  type Layer,
  located,
  override,
  type Override,
  resolvingMetadata,
} from "@stealthscale/vite-config";

import { FACTORY } from "#plugin/refresh.ts";
import { type DocumentOptions } from "#plugin/types.ts";

/**
 * The configuration key the packer reads its plugin list from.
 */
const PACKED = "pack.plugins";

/**
 * The compiler package, in a variable so that the specifier below is not a literal.
 *
 * @remarks
 *   Vite bundles a configuration file before it runs it, and it resolves a literal specifier
 *   inside a dynamic import at bundle time. That fails when the peer is not installed. A variable
 *   leaves the specifier for {@link located} to resolve when the plugin is constructed.
 */
const PEER = "@mdx-js/rollup";

/**
 * The only extension this plugin compiles.
 *
 * @remarks
 *   Left alone, the compiler also takes `.md`. A `.md` file imported with `?raw` would then come
 *   back as a component instead of a string.
 */
const FORMAT = "mdx";

/**
 * Options for {@link mdx}.
 */
export interface Documented {
  /**
   * The package the automatic runtime imports the JSX factory from. Pass the same value to
   * `plugin.refresh`.
   */
  from?: string;
}

/**
 * Returns the compiler's options, defaulting the JSX import source to the one refresh expects.
 */
export function options(stated: Documented): DocumentOptions {
  return { format: FORMAT, jsxImportSource: stated.from ?? FACTORY };
}

/**
 * Imports the compiler, naming the package to install where the import does not resolve.
 *
 * @throws {@link Error} When the peer is not installed alongside this package.
 */
async function loaded(): Promise<typeof import("@mdx-js/rollup")> {
  try {
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a dynamic import of a specifier in a variable resolves to any, and the header gives the reason for the variable
    return (await import(located(PEER, import.meta.url))) as typeof import("@mdx-js/rollup");
  } catch (error) {
    throw new Error(
      `react.plugin.mdx() compiles documents through ${PEER}, which is an optional peer of ` +
        "@stealthscale/vite-config-react and is not installed. Install it beside the package to " +
        "compile documents, or take the layer out.",
      { cause: error },
    );
  }
}

/**
 * Loads the compiler package and constructs its plugin from the stated options.
 */
async function constructed(stated: Documented): Promise<Plugin> {
  return (await loaded()).default(options(stated));
}

/**
 * Puts the MDX plugin ahead of every plugin the layers contributed.
 *
 * @remarks
 *   The React Compiler runs in the same `pre` phase and throws on raw MDX, so MDX has to go first.
 *   Refining runs after every contribution, which is why the order the caller wrote the layers in
 *   does not matter. Vite awaits a promised plugin before it sorts, so this may stay a promise.
 *   A configuration resolved for metadata alone constructs nothing, so `vp pack` can read a
 *   package's metadata without the peer installed.
 */
function compiled(stated: Documented): Override {
  return override({
    because: "a document has to be a component before anything else can compile it",
    name: "react.plugin.mdx",
    refine: (_context, config) => {
      if (resolvingMetadata()) return config;

      const plugin = constructed(stated).then((held) => ({ enforce: "pre" as const, ...held }));

      return { ...config, plugins: [plugin, ...(config.plugins ?? [])] };
    },
  });
}

/**
 * Adds the MDX plugin to the plugins `vp pack` runs.
 *
 * @remarks
 *   The packer builds from `pack.plugins` and ignores `plugins` entirely, so a library that ships
 *   a compiled document needs the plugin declared in both places. This contribution is the second
 *   declaration.
 */
function packed(stated: Documented): Contribution {
  return contribute({
    at: PACKED,
    because: "the packer reads its own plugin list, and a document has to compile there too",
    itemOf: () => constructed(stated),
    name: "react.plugin.mdx(pack)",
  });
}

/**
 * Compiles `.mdx` files into components, in the build and in `vp pack`.
 *
 * @remarks
 *   Composing a configuration constructs the two plugin instances, not this call. Two
 *   compositions get a pair each.
 * @param stated - The options to change. Omit it to render through React itself.
 */
export function mdx(stated: Documented = {}): readonly Layer[] {
  return [compiled(stated), packed(stated)];
}
