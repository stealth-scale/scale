/**
 * States Forge: a warm, quick product for an operations console. Cream surfaces and an amber
 * brand, cast flatter than the foundation, with every button's label and every card's header set
 * in capitals. Each recipe it extends is named by its key alone, the card under `slotRecipes`
 * because it draws several parts.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { COLORS, NEUTRAL } from "#colors.ts";
import { extension as button } from "#recipes/button.ts";
import { extension as card } from "#recipes/card.ts";

/**
 * Fixes how much ink every shadow carries against the default weight: half, because a dense screen
 * draws many surfaces at once and a full-weight shadow under each of them reads as noise.
 */
export const DEPTH = 0.5;

/**
 * Draws a warm amber product on cream, cast flat, with capital labels on its buttons and capital
 * headers on its cards.
 */
export const forge: Theme = defineTheme({
  colors: COLORS,
  depth: { depth: DEPTH, hue: NEUTRAL },
  name: "forge",
  recipes: { button },
  slotRecipes: { card },
});
