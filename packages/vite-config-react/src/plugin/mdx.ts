/**
 * Configures the MDX plugin that compiles a document into a component.
 *
 * @remarks
 *   The compiler is an optional peer, loaded when a plugin is constructed and not when this module
 *   is imported, so a repository that compiles no document imports the React tier with the peer
 *   absent. A repository that states the layer without the peer is told which package to install.
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
 * The configuration key the packer reads its plugins from.
 */
const PACKED = "pack.plugins";

/**
 * The compiler package, named as a value so the bundler that reads a configuration leaves the
 * import to Node.
 */
const PEER = "@mdx-js/rollup";

/**
 * The one document format the plugin compiles.
 *
 * @remarks
 *   At its default the plugin claims every markdown extension as well, and a `.md` file imported
 *   with `?raw` then arrives as a component rather than as a string.
 */
const FORMAT = "mdx";

/**
 * Narrows the transform a document is compiled under.
 */
export interface Documented {
  /**
   * The package the automatic runtime imports the JSX factory from. A caller that changes it
   * passes the same value to `plugin.refresh`.
   */
  from?: string;
}

/**
 * Fills in what a caller left out and hands the result to the MDX plugin.
 */
export function options(stated: Documented): DocumentOptions {
  return { format: FORMAT, jsxImportSource: stated.from ?? FACTORY };
}

/**
 * Loads the compiler package, and says what to install where nothing resolves it.
 *
 * @throws {@link Error} When the peer is not installed beside this package.
 */
async function loaded(): Promise<typeof import("@mdx-js/rollup")> {
  try {
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a specifier held in a value is typed by nobody, and the header says why it is held that way
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
 * Constructs the compiler's plugin, once the package is loaded.
 */
async function constructed(stated: Documented): Promise<Plugin> {
  return (await loaded()).default(options(stated));
}

/**
 * Puts the MDX plugin ahead of every plugin the tree built.
 *
 * @remarks
 *   The React Compiler runs in the same `pre` phase and fails on raw MDX when it runs first. An
 *   override refines the configuration after every contribution has landed, so the plugin is
 *   first whatever order a caller wrote the layers in. The plugin is a promise the bundler settles
 *   before it sorts the list, and nothing is loaded while the toolchain reads the configuration
 *   for its metadata alone.
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
 * Adds the MDX plugin to the plugins the packer runs.
 *
 * @remarks
 *   The packer reads `pack.plugins` and nothing under `plugins`, so a library that publishes a
 *   document needs the plugin stated a second time.
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
 * Compiles `.mdx` files into components, in the build and in the packer.
 *
 * @remarks
 *   Each plugin instance is constructed when the configuration is composed, not when this call
 *   runs, so two compositions produce two independent pairs and a composition read for its
 *   metadata alone constructs none.
 * @param stated - The parts of the transform to change. Omitting it compiles a document rendering
 *   through React itself.
 */
export function mdx(stated: Documented = {}): readonly Layer[] {
  return [compiled(stated), packed(stated)];
}
