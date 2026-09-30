/**
 * Declares the checkbox group's recipe: a list of checkbox rows, a column by default and a wrapping
 * row when horizontal.
 *
 * @remarks
 *   The spacing is the radio group's: rows `gap.<size>` apart in a column, and `inset.<size>` apart
 *   in a row. In a column, every row after a parent box starts one box and one gap further in, so
 *   its box lines up with the start of the parent's label: 22, 28 and 36px at `sm`, `md` and `lg`.
 */

import { defineRecipe, dense, sizeVariants } from "@stealthscale/theme/authoring";

/**
 * Selects the rows after a parent box in a vertical group.
 */
export const AFTER_PARENT = "&[data-orientation=vertical] > [data-parent] ~ *";

/**
 * Styles a vertical group of `md` rows.
 */
export const recipe = defineRecipe({
  base: {
    _horizontal: { alignItems: "center", flexDirection: "row", flexWrap: "wrap" },
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
  },
  className: "checkbox-group",
  defaultVariants: { size: "md" },
  jsx: [/^Checkbox\.Group$/u],
  variants: {
    /**
     * Gaps between the rows, and the indent of the rows under a parent box. The indent is the box's
     * side plus the gap inside a row, each at the size.
     */
    size: sizeVariants(
      (size) => ({
        [AFTER_PARENT]: {
          marginInlineStart: dense(`calc({sizes.icon.${size}} + {spacing.gap.${size}})`),
        },
        columnGap: dense(`{spacing.inset.${size}}`),
        rowGap: dense(`{spacing.gap.${size}}`),
      }),
      ["sm", "md", "lg"],
    ),
  },
});
