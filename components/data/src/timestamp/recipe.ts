/**
 * Slot recipe for an instant: the `time` element with the instant, and the exact form a reading
 * writes after a distance.
 *
 * @remarks
 *   Numerals are tabular, so a distance that updates in place keeps the words after it still and a
 *   column of instants lines up. A timestamp does not wrap, so a date or a distance keeps one line
 *   in a narrow table cell. The exact form after a distance takes the muted ink, so the distance
 *   reads first. The recipe has no axis: a timestamp takes its size from the text around it.
 */

import { defineSlotRecipe } from "@stealthscale/theme/authoring";

/**
 * Class name of the recipe.
 */
export const CLASS = "timestamp";

/**
 * Defines the timestamp recipe.
 */
export const recipe = defineSlotRecipe({
  base: {
    exact: { color: "fg.muted" },
    root: { fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" },
  },
  className: CLASS,
  jsx: ["Timestamp"],
  slots: ["root", "exact"],
});
