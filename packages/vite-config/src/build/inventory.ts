/**
 * Writes a CycloneDX bill of materials for a deployed application.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

import { loaded } from "#sbom/loaded.ts";
import { HOUSE } from "#sbom/supplier.ts";
import { type Supplier } from "#sbom/types.ts";

/**
 * The well-known path a scanner fetches the document from over HTTP.
 */
const SERVED = ".well-known/sbom";

/**
 * The path in the build output a release pipeline reads the document from.
 */
const BESIDE = "cyclonedx/bom.json";

/**
 * Contributes the plugin that writes a CycloneDX bill of materials to both paths.
 *
 * @remarks
 *   The document is typed as an application and written twice, where the `pack` inventory types a
 *   library and writes one copy. Two consumers read it: a scanner fetches it from a running
 *   deployment over HTTP, and a release pipeline reads it out of the output directory. A serial
 *   number and a timestamp differ between two builds of the same source, so both are written under
 *   production alone.
 * @param supplier - The organisation recorded as the publisher of every component in the document.
 */
export function inventory(supplier: Supplier = HOUSE): Contribution {
  return contribute({
    apply: "build",
    at: "plugins",
    because: "a bundle names none of what went into it, and somebody will need to ask",
    itemOf: async (context) =>
      (await loaded()).sbom({
        paths: [BESIDE, SERVED],
        serialNumber: context.mode === "production",
        supplier,
        timestamp: context.mode === "production",
        type: "application",
      }),
    name: "build.inventory",
  });
}
