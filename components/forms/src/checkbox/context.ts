/**
 * Turns the checkbox slot recipe into React components, one per slot.
 *
 * @remarks
 *   A consuming application's compiler parses `recipe.ts` statically at build time, so that module
 *   cannot import anything that exists only at runtime and this wiring has to live in its own file.
 *   It is separate from `machine.ts` because styling and behaviour change for unrelated reasons.
 */

import { createSlotRecipeContext } from "@stealthscale/theme";

import { recipe } from "#checkbox/recipe.ts";

/**
 * Creates the two slot factories for the checkbox recipe.
 *
 * @remarks
 *   The root is built with `withProvider`, which resolves the variant values once and publishes
 *   them on a context. Every other slot is built with `withContext` and reads that resolved result,
 *   so a variant is set in one place and applied throughout the subtree.
 */
export const { withContext, withProvider } = createSlotRecipeContext(recipe);
