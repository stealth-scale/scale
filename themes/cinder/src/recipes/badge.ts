/**
 * Extends the badge for a hard product: every label set in capitals and tracked wide, the way a
 * stencil on a crate is.
 *
 * @remarks
 *   Nothing here names a class or a slot, because the recipe file in the component package
 *   decides both. The extension compiles under Cinder's attribute and applies nowhere else.
 */

import { type RecipeExtension } from "@stealthscale/theme/authoring";

/**
 * Sets every badge's label in capitals, tracked wide.
 */
export const badge: RecipeExtension = {
  base: { letterSpacing: "wide", textTransform: "uppercase" },
};
