/**
 * Styles a divider: a hairline in the `border` color across a column or down a row.
 *
 * @remarks
 *   The `divider` helper sets one border edge per orientation, so the orientation is an axis. The
 *   base removes the `hr` element's default border and margin. The recipe has no `palette` or
 *   `effect` axis, because a divider separates content in the boundary color and renders no box.
 */

import { defineRecipe, divider } from "@stealthscale/theme/authoring";

/**
 * Defaults to a horizontal divider.
 */
export const recipe = defineRecipe({
  base: { borderWidth: "0", flexShrink: "0", marginBlock: "0" },
  className: "divider",
  defaultVariants: { orientation: "horizontal" },
  jsx: [/^Divider$/u],
  variants: {
    /**
     * Direction of the line. `vertical` stretches to the height of a row.
     */
    orientation: {
      horizontal: divider("horizontal"),
      vertical: divider("vertical"),
    },
  },
});
