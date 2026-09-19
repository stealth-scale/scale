/**
 * States what a matrix is: a grid of cells with a caption along each edge, folding into captioned
 * rows where the room runs out.
 *
 * @remarks
 *   Above the middle container size the grid draws one column per value across, each as wide as
 *   the widest cell in it and no wider, so the small size takes a narrow column and the large size
 *   a wide one, and every row lines up on the same columns. The count of columns is an axis, one
 *   value per count a specimen can cross, because the compiler writes a rule per value and a count
 *   handed over at run time would be a rule it never sees. Below that size the grid folds: the top
 *   edge goes, each row becomes a line captioned by its own value, and every cell carries the
 *   caption the top edge held, wrapping where the row runs out of room. The root is the container
 *   the grid measures itself against, because a grid folds on the room it is given and not on the
 *   window. A grid wider than its column once unfolded scrolls across, because a row folded under
 *   itself no longer lines up with the caption above it.
 */

import {
  type Count,
  COUNTS,
  defineSlotRecipe,
  onSlot,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * The container size the grid unfolds at.
 */
const UNFOLDED = "@/md";

/**
 * Writes the columns for one count of values across: that many of their own width, and one more
 * beside them for the side.
 */
function columned(count: Count): SystemStyleObject {
  return {
    [UNFOLDED]: { gridTemplateColumns: `repeat(${String(Number(count) + 1)}, max-content)` },
  };
}

/**
 * Writes the `across` axis: one value per count of columns.
 */
function acrossCounts(): Record<Count, SystemStyleObject> {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the entries are built from the counts, one per count
  return Object.fromEntries(COUNTS.map((count) => [count, columned(count)])) as Record<
    Count,
    SystemStyleObject
  >;
}

/**
 * Draws a matrix of one column across until a caller says otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    cell: { maxInlineSize: "full", minInlineSize: "0" },
    grid: {
      display: "flex",
      flexDirection: "column",
      gap: "gap.2xl",
      [UNFOLDED]: {
        alignItems: "center",
        columnGap: "gap.lg",
        display: "grid",
        justifyContent: "start",
        overflowX: "auto",
        rowGap: "gap.md",
      },
    },
    head: { display: "none", [UNFOLDED]: { display: "contents" } },
    item: {
      "& > * + *": { marginBlockStart: "gap.xs" },
      maxInlineSize: "full",
      minInlineSize: "0",
    },
    label: { marginBlockEnd: "gap.xs", [UNFOLDED]: { display: "none" } },
    root: { containerType: "inline-size" },
    row: {
      alignItems: "flex-start",
      display: "flex",
      flexWrap: "wrap",
      gap: "gap.lg",
      [UNFOLDED]: { display: "contents" },
    },
    side: { flexBasis: "full", [UNFOLDED]: { flexBasis: "auto" } },
  },
  className: "matrix",
  defaultVariants: { across: "1" },
  jsx: [/^Matrix(\.\w+)?$/u],
  slots: ["root", "grid", "head", "row", "side", "cell", "item", "label"],
  variants: {
    /**
     * How many values run across, beside the column the side captions take.
     */
    across: onSlot("grid", acrossCounts()),
  },
});
