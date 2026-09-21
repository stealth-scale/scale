/**
 * Attributes every SBOM this repository generates to one organisation.
 */

import { type Supplier } from "#sbom/types.ts";

/**
 * The organisation recorded as the supplier in an SBOM this repository
 * generates.
 *
 * @remarks
 *   CycloneDX expects a supplier on a component once the document declares one
 *   at the top level. The build and pack inventories both default to this
 *   entity. A caller publishing under a different one passes its own supplier
 *   to the layer.
 */
export const HOUSE: Supplier = {
  name: "Stealth Scale B.V.",
  url: ["https://stealthscale.io"],
};
