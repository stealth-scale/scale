/**
 * Styles a group's direction, gap, alignment, distribution, growth, attachment and dimming.
 *
 * @remarks
 *   An attached group squares the corners between neighbours and overlaps their borders by the
 *   control stroke width, so the border between two children renders once. A focused child stacks
 *   above its neighbours, so the next child does not cover its focus ring. The squaring is in two
 *   compounds, one per orientation. The compiler emits compounds after every variant, so the `gap`
 *   axis cannot reopen the gap. The recipe has no `palette` or `effect` axis, because a group
 *   renders no box of its own.
 */

import {
  alignVariants,
  defineRecipe,
  gapSizes,
  type Justify,
  justifyVariants,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Negative margin that overlaps a child with its neighbour by the control stroke width.
 */
const OVERLAP = "calc({borderWidths.control} * -1)";

/**
 * Returns the `justify` axis, where every value also makes the group a full-width flex box.
 *
 * @remarks
 *   The base group is `inline-flex` and as wide as its children, so it has no free space to
 *   distribute. The axis has no default, so a group without `justify` remains inline.
 */
function distributed(): Record<Justify, SystemStyleObject> {
  const entries = Object.entries(justifyVariants()).map(
    ([name, placed]): [string, SystemStyleObject] => [
      name,
      { ...placed, display: "flex", inlineSize: "full" },
    ],
  );

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the entries are the axis's own, one per distribution
  return Object.fromEntries(entries) as Record<Justify, SystemStyleObject>;
}

/**
 * Defaults to a horizontal group at the `sm` gap.
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
    /**
     * Cross-axis alignment of the children.
     */
    align: alignVariants(),

    /**
     * Dims every child except a hovered, keyboard-focused or pressed one.
     *
     * @remarks
     *   The value applies the theme's `dim.others` layer style, which blurs and fades the other
     *   children with a transition. A child with `aria-pressed="true"` keeps the others dimmed at
     *   rest.
     */
    dim: { true: { layerStyle: "dim.others" } },

    /**
     * Joins the children into one control.
     *
     * @remarks
     *   An attached group does not wrap, because a joined control on two lines has squared corners
     *   that face no neighbour. The value and the compounds both set a zero gap, because the
     *   compiler emits the `gap` axis after this one.
     */
    attached: { true: { flexWrap: "nowrap", gap: "0" } },

    /**
     * Gap token between the children, from `xs` to `xl`.
     */
    gap: gapSizes(["xs", "sm", "md", "lg", "xl"]),

    /**
     * Makes the group full width and gives every child an equal share of it.
     */
    grow: { true: { "& > *": { flex: "1" }, display: "flex", inlineSize: "full" } },

    /**
     * Distribution of the space left over along the main axis.
     *
     * @remarks
     *   Every value makes the group full width, because an inline group has no free space.
     */
    justify: distributed(),

    /**
     * Direction the children run in.
     */
    orientation: {
      horizontal: { flexDirection: "row" },
      vertical: { flexDirection: "column" },
    },
  },
});
