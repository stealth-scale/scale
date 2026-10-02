/**
 * Collects the layers an application composed from plugins extends its tier with.
 */

import { type Layer, lint, named } from "@stealthscale/vite-config";

import { composed } from "#composed.ts";
import { type ProductOptions } from "#types.ts";

/**
 * Path of the definition module where the options state none.
 */
const DEFINITION = "src/product.ts";

/**
 * Returns the layers that compose an application from plugins: the product plugin, and the lint
 * excuse for the definition module's default export.
 *
 * @remarks
 *   The plugin adds the chunk group of every installed plugin itself, because it alone knows the
 *   web packages the definition installs.
 * @param options - The definition's path, passed through to the plugin.
 */
export function layers(options: ProductOptions = {}): readonly Layer[] {
  const definition = options.definition ?? DEFINITION;

  return [
    composed(options),
    named("product.definition", lint.defaultExported([`**/${definition}`])),
  ];
}
