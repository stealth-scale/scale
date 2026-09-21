/**
 * Records what a deployed application is made of, as a CycloneDX document.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

import { loaded } from "#sbom/loaded.ts";
import { HOUSE } from "#sbom/supplier.ts";
import { type Supplier } from "#sbom/types.ts";

/**
 * Locates the copy a scanner can fetch from a running deployment without being told where to look.
 */
const SERVED = ".well-known/sbom";

/**
 * Locates the copy a release pipeline picks up out of the build output.
 */
const BESIDE = "cyclonedx/bom.json";

/**
 * Writes the bill of materials for an application, to both the served path and the output tree.
 *
 * @remarks
 *   The document is typed as an application, where its counterpart in `pack` types a library and
 *   writes one copy. Two copies are written because the two readers differ: a scanner reaches the
 *   deployment over HTTP, and a release pipeline only ever sees the directory. A serial number and
 *   a timestamp differ between two builds of the same source, so both are written only in
 *   production and a development build stays reproducible. The plugin package is loaded when the
 *   plugin is constructed and not when the layer is stated, so reading the configuration for its
 *   metadata loads no plugin.
 * @param supplier - The organisation attributed as publisher of every component. The house
 *   identity is used unless a repository states its own.
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
