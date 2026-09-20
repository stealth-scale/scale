/**
 * States what a group is: controls laid along one direction, either a semantic gap apart or
 * attached into one control with three parts.
 *
 * @remarks
 *   Attached is the axis worth reading. The corners between two neighbours are squared and the
 *   border between them is pulled back by its own width, so three buttons read as one control
 *   rather than as three that happen to touch. A focused child is lifted above its neighbours,
 *   because a ring drawn at the same level is clipped by the next child's edge.
 *   The squaring sits in a compound rather than in the `attached` value, for two reasons. It
 *   depends on which way the group runs, and a compound is written after every variant, so the
 *   gap it closes is not reopened by the `gap` axis.
 */

import {
  alignVariants,
  defineRecipe,
  gapSizes,
  justifyVariants,
} from "@stealthscale/theme/authoring";

/**
 * Pulls a child back over its neighbour's edge by the control's stroke width, so the two share one
 * line rather than drawing two.
 */
const OVERLAP = "calc({borderWidths.control} * -1)";

/**
 * Draws a horizontal row at the middle gap until a caller says otherwise.
 */
export const recipe = defineRecipe({
  base: {
    "& > *": { _focusVisible: { zIndex: "1" } },
    display: "inline-flex",
    isolation: "isolate",
    position: "relative",
  },
  className: "group",
  compoundVariants: [
    {
      attached: true,
      css: {
        "& > *:not(:first-child)": { borderEndStartRadius: "0", borderStartStartRadius: "0" },
        "& > *:not(:last-child)": {
          borderEndEndRadius: "0",
          borderStartEndRadius: "0",
          marginInlineEnd: OVERLAP,
        },
        gap: "0",
      },
      name: "joined",
      orientation: "horizontal",
    },
    {
      attached: true,
      css: {
        "& > *:not(:first-child)": { borderStartEndRadius: "0", borderStartStartRadius: "0" },
        "& > *:not(:last-child)": {
          borderEndEndRadius: "0",
          borderEndStartRadius: "0",
          marginBlockEnd: OVERLAP,
        },
        gap: "0",
      },
      name: "stacked",
      orientation: "vertical",
    },
  ],
  defaultVariants: { gap: "sm", orientation: "horizontal" },
  jsx: [/^Group$/u],
  variants: {
    align: alignVariants(),

    /**
     * Whether the children touch and read as one control.
     *
     * @remarks
     *   An attached group never wraps. A second line of a joined control reads as two controls,
     *   and the squared corners between them face nothing. The gap is closed here and again in the
     *   compound, because the `gap` axis is written after this one and would otherwise reopen it.
     */
    attached: { true: { flexWrap: "nowrap", gap: "0" } },

    gap: gapSizes(["xs", "sm", "md", "lg", "xl"]),

    /**
     * Whether the children share the room evenly rather than taking what each needs.
     */
    grow: { true: { "& > *": { flex: "1" }, display: "flex" } },

    justify: justifyVariants(),

    /**
     * Which way the children run.
     */
    orientation: {
      horizontal: { flexDirection: "row" },
      vertical: { flexDirection: "column" },
    },
  },
});
