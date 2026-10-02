/**
 * Writes the source of `virtual:product`: the resolved product as a literal, and each installed
 * plugin's manifest from the product's definition.
 */

import { type ResolvedProduct } from "@stealthscale/sdk-core";
import { literal, quoted } from "@stealthscale/vite-plugin-base";

/**
 * The specifier an application imports the product from.
 */
export const ID = "virtual:product";

/**
 * The resolved id of the module, behind the NUL that marks it as generated.
 */
export const RESOLVED = `\0${ID}`;

/**
 * Returns the source of `virtual:product`.
 *
 * @remarks
 *   The module imports the definition. The page receives each manifest from it, keyed by plugin id,
 *   with its lazy importers and its contract's search validators. Every member the build resolved
 *   is a literal in the module, and the page runs no check of its own.
 * @param definition - The definition module's path from the project root, such as
 *   `/src/product.ts`.
 * @param product - The resolved product.
 * @throws {@link Error} When a member of the product cannot be written as source, naming its path.
 */
export function moduleOf(definition: string, product: ResolvedProduct): string {
  return [
    `import definition from ${quoted(definition)};`,
    "",
    `const resolved = ${literal(product, "product")};`,
    "",
    "export const product = {",
    "  ...resolved,",
    "  manifests: Object.fromEntries(",
    "    definition.plugins.map(({ manifest }) => [manifest.contract.pluginId, manifest]),",
    "  ),",
    "};",
    "",
  ].join("\n");
}
