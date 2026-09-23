/**
 * Renders the bound swatch element that `ColorSwatch` and `ColorSwatchMix` set their colours on.
 */

import { withContext } from "#color-swatch/context.ts";

/**
 * Renders the swatch `span` with the recipe's variants.
 */
export const Swatch = withContext("span");
