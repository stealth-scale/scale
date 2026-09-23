/**
 * Styles a roving focus group as a flex row or column in the direction its arrow keys move.
 *
 * @remarks
 *   One `orientation` axis sets both the layout and the arrow keys, so a column never responds to
 *   the left and right arrows. `both` wraps the row, because a group navigable on both axes runs
 *   onto more lines. The recipe has no `palette` or `effect` axis, because the group renders no
 *   box of its own.
 */

import { defineSlotRecipe } from "@stealthscale/theme/authoring";

/**
 * Defaults to a horizontal group.
 */
export const recipe = defineSlotRecipe({
  base: { item: { minInlineSize: "0" }, root: { display: "flex" } },
  className: "roving-focus",
  defaultVariants: { orientation: "horizontal" },
  jsx: [/^RovingFocus(\.\w+)?$/u],
  slots: ["root", "item"],
  variants: {
    /**
     * Flex direction of the root, matching the arrow keys the group handles.
     */
    orientation: {
      both: { root: { flexDirection: "row", flexWrap: "wrap" } },
      horizontal: { root: { flexDirection: "row" } },
      vertical: { root: { flexDirection: "column" } },
    },
  },
});
