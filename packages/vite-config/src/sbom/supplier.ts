/**
 * Attributes the components of a generated SBOM to one organisation.
 */

import { type Supplier } from "#sbom/types.ts";

/**
 * The supplier recorded against a component of an SBOM this repository
 * generates.
 *
 * @remarks
 *   CycloneDX expects a supplier on a component once the document declares one
 *   at the top level. Both the build and the pack inventories fall back to this
 *   entity, and a caller publishing under another one passes its own supplier
 *   rather than editing this.
 */
export const HOUSE: Supplier = {
  name: "Stealth Scale B.V.",
  url: ["https://stealthscale.io"],
};
