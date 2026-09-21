/**
 * Writes a CycloneDX bill of materials for a packed library.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

import { loaded } from "#sbom/loaded.ts";
import { HOUSE } from "#sbom/supplier.ts";
import { type Supplier } from "#sbom/types.ts";

/**
 * Returns a contribution that writes a CycloneDX bill of materials into the packer's output.
 *
 * @remarks
 *   The document is typed as a library and written once to the plugin's default path, where the
 *   `build` inventory types an application and writes two copies. A serial number and a timestamp
 *   differ between two builds of the same source, so the plugin writes both under production
 *   alone.
 * @param supplier - The organisation recorded as the publisher of every component in the document.
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
