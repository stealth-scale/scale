/**
 * States what a stack is: children laid one after another along one direction, a semantic gap
 * apart, placed along that direction and across it.
 *
 * @remarks
 *   Every value is a semantic gap or a CSS alignment, so a theme moves the spacing of every stack
 *   by restating one scale. A row centres its children across the flow and a column stretches
 *   them, which is what a mark beside a word wants and what a column of panels wants, so the
 *   common stack states no alignment at all. The children are held to a minimum of nothing, so a
 *   long word inside one does not push the stack wider than the space it was given.
 */

import {
  alignVariants,
  defineRecipe,
  gapSizes,
  justifyVariants,
} from "@stealthscale/theme/authoring";

/**
 * Selects a stack running across, in either direction, from inside the base styles.
 *
 * @remarks
 *   The row's centring is written here rather than on the row's own value, because the compiler
 *   writes the axes in an order of its own with `align` before `direction`, and a rule written
 *   later wins, so a place stated on a row would lose to the row's centring. The base sits in a
 *   layer below every variant, so a stated `align` overrides whatever the base says. The classes
 *   are spelt as the compiler spells a value, the axis and the value joined by its separator, and
 *   the naming pass rewrites them beside the value's own class.
 */
const ACROSS = "&.stack--direction_row, &.stack--direction_row-reverse";

/**
 * Draws a column at the middle gap until a caller says otherwise.
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
    align: alignVariants(),
    direction: {
      column: { flexDirection: "column" },
      "column-reverse": { flexDirection: "column-reverse" },
      row: { flexDirection: "row" },
      "row-reverse": { flexDirection: "row-reverse" },
    },
    gap: gapSizes(["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"]),
    justify: justifyVariants(),
    wrap: { true: { flexWrap: "wrap" } },
  },
});
