/**
 * Records what a packed library is made of, as a CycloneDX document.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

import { loaded } from "#sbom/loaded.ts";
import { HOUSE } from "#sbom/supplier.ts";
import { type Supplier } from "#sbom/types.ts";

/**
 * Writes the bill of materials for a library, alongside what the packer built.
 *
 * @remarks
 *   The document is typed as a library and lands wherever the plugin defaults to, which is what a
 *   package published to a registry wants. Its counterpart in `build` types the document as an
 *   application and writes it twice. A serial number and a timestamp differ between two builds of
 *   the same source, so both are written only in production and a development build stays
 *   reproducible. The plugin package is loaded when the plugin is constructed and not when the
 *   layer is stated, and the packer constructs it whenever it reads the configuration.
 * @param supplier - The organisation attributed as publisher of every component. The house
 *   identity is used unless a repository states its own.
 */
export function inventory(supplier: Supplier = HOUSE): Contribution {
  return contribute({
    apply: "build",
    at: "pack.plugins",
    because: "what a packer inlines is no longer named by the manifest that declared it",
    itemOf: async (context) =>
      (await loaded()).sbom({
        serialNumber: context.mode === "production",
        supplier,
        timestamp: context.mode === "production",
        type: "library",
      }),
    name: "pack.inventory",
  });
}
