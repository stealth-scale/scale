/**
 * Extends the button for a round product: every button drawn as a pill.
 *
 * @remarks
 *   Nothing here names a class or a slot, because the recipe file in the component package
 *   decides both. The extension compiles under Blush's attribute and applies nowhere else.
 */

import { type RecipeExtension } from "@stealthscale/theme/authoring";

/**
 * Rounds every button to a pill.
 */
export const button: RecipeExtension = {
  base: { borderRadius: "full" },
};
