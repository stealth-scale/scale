/**
 * Styles a stack's direction, gap, alignment, distribution and wrapping.
 *
 * @remarks
 *   Every value reads a gap token or a CSS alignment keyword. The stack's minimum inline size is 0,
 *   so a long word inside it cannot widen it past its container. The recipe has no `palette` or
 *   `effect` axis, because a stack renders no box of its own.
 */

import {
  alignVariants,
  defineRecipe,
  gapSizes,
  justifyVariants,
} from "@stealthscale/theme/authoring";

/**
 * Selects a stack whose direction is `row` or `row-reverse`.
 *
 * @remarks
 *   The base centres a row on the cross axis through this selector, not through the `direction`
 *   values, because the compiler emits `align` before `direction` and a row's centring would then
 *   override a stated `align`. The base is in a lower cascade layer than every variant, so a stated
 *   `align` takes precedence. The class names match the ones the compiler writes for the values.
 */
const ACROSS = "&.stack--direction_row, &.stack--direction_row-reverse";

/**
 * Defaults to a column at the `md` gap.
 */
export const recipe = defineRecipe({
  base: {
    [ACROSS]: { alignItems: "center" },
    display: "flex",
    flexDirection: "column",
    minInlineSize: "0",
  },
  className: "stack",
  defaultVariants: { gap: "md" },
  jsx: [/^Stack$/u],
  variants: {
    /**
     * Cross-axis alignment of the children.
     */
    align: alignVariants(),

    /**
     * Flex direction.
     */
    direction: {
      column: { flexDirection: "column" },
      "column-reverse": { flexDirection: "column-reverse" },
      row: { flexDirection: "row" },
      "row-reverse": { flexDirection: "row-reverse" },
    },

    /**
     * Gap token between the children, from `xs` to `4xl`.
     */
    gap: gapSizes(["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"]),

    /**
     * Distribution of the space left over along the main axis.
     */
    justify: justifyVariants(),

    /**
     * Wraps the children onto further lines when they do not fit.
     */
    wrap: { true: { flexWrap: "wrap" } },
  },
});
