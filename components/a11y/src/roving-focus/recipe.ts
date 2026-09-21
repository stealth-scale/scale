/**
 * Lays the group out as a flex row or column, matching the direction the arrow keys move.
 *
 * @remarks
 *   Orientation is a single variant because two things have to agree on it: the arrow keys the
 *   root handles and the direction the recipe lays the items out in. Splitting them would let a
 *   caller build a column that responds to the left and right arrows. The `both` value enables
 *   flex wrapping, since a group navigable on two axes is one that runs onto a second line.
 */

import { defineSlotRecipe } from "@stealthscale/theme/authoring";

/**
 * The `roving-focus` slot recipe over a root and its items, horizontal by default.
 */
export const recipe = defineSlotRecipe({
  base: { item: { minInlineSize: "0" }, root: { display: "flex" } },
  className: "roving-focus",
  defaultVariants: { orientation: "horizontal" },
  jsx: [/^RovingFocus(\.\w+)?$/u],
  slots: ["root", "item"],
  variants: {
    orientation: {
      both: { root: { flexDirection: "row", flexWrap: "wrap" } },
      horizontal: { root: { flexDirection: "row" } },
      vertical: { root: { flexDirection: "column" } },
    },
  },
});
