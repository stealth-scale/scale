/**
 * Extends the button for a sharp product: every label set in capitals and tracked wider, the
 * way a number on a sail is.
 *
 * @remarks
 *   Nothing here names a class or a slot, because the recipe file in the component package
 *   decides both. The extension compiles under Regatta's attribute and applies nowhere else.
 */

import { type RecipeExtension } from "@stealthscale/theme/authoring";

/**
 * Sets every button's label in capitals.
 *
 * @remarks
 *   The tracking is stated on the theme's `label` role rather than here. A role is written into
 *   every size variant, and the compiler layers a recipe's variants over its base, so tracking
 *   written here would be overwritten by the label role at every size a button has.
 */
export const button: RecipeExtension = {
  base: { textTransform: "uppercase" },
};
