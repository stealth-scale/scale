/**
 * States what a matrix is: a grid of cells with a caption along each edge, folding into captioned
 * rows where the room runs out.
 *
 * @remarks
 *   Above the middle container size the grid draws one column per value across, each no narrower
 *   than the widest cell in it and sharing whatever the card has left over, so the grid reaches the
 *   card's far edge and every row lines up on the same columns. The count of columns is an axis,
 *   one value per count a specimen can cross, because the compiler writes a rule per value and a
 *   count handed over at run time would be a rule it never sees. Below that size the grid folds:
 *   the top edge goes, each row becomes a line captioned by its own value, and every cell carries
 *   the caption the top edge held, wrapping where the row runs out of room. The root is the
 *   container the grid measures itself against, because a grid folds on the room it is given and
 *   not on the window. A grid wider than its column once unfolded scrolls across, because a row
 *   folded under itself no longer lines up with the caption above it. The cells are centred in
 *   their row, so a row of one control at every size reads as one line of controls, the small ones
 *   on the middle of the tall ones, which is how a row of mixed controls lines up on a page.
 *   The two gaps are set apart from each other. A row carries a caption of its own at the start of
 *   it, and the row gap is what holds that pair together against the pair above, so it is drawn
 *   wider than the gap between two cells that share one caption.
 */

import {
  type Count,
  COUNTS,
  defineSlotRecipe,
  dense,
  onSlot,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * The container size the grid unfolds at.
 */
const UNFOLDED = "@/md";

/**
 * The room the scrolling grid leaves round its cells, and takes back again.
 *
 * @remarks
 *   A grid that scrolls across is a scroll container on both axes, because CSS resolves a visible
 *   overflow against a scrolling one to `auto`. Anything a cell paints outside its own box was
 *   cut at the grid's edge, so a button carrying the theme's glow lost the top and the bottom of
 *   it and read as a halo with a flat lid. The room is the widest glow the theme draws, so the
 *   largest of them clears the edge, and the same room comes off as a negative margin, which
 *   leaves the grid occupying what it did before.
 */
const HALO = "{sizes.12}";

/**
 * Writes the columns for one count of values across: the side's own width, and that many columns
 * that share whatever the card has left and never squeeze a cell past what it can give.
 *
 * @remarks
 *   `minmax(min-content, 1fr)` rather than `max-content`. Columns of their own width packed against
 *   the start of a card left the rest of the card empty, so a page of scenes read as a column of
 *   drawings down the left edge rather than as a set of grids.
 *   The floor is what a cell cannot go under rather than what it would take if offered everything.
 *   A control that sets no width of its own reports the two alike, so a row of buttons keeps the
 *   width it had. A control that fills whatever it is given reports a much smaller floor, so five
 *   fields share the card instead of asking for five times their natural width and pushing the last
 *   of them off the edge.
 */
function columned(count: Count): SystemStyleObject {
  return {
    [UNFOLDED]: {
      gridTemplateColumns: `max-content repeat(${count}, minmax(min-content, 1fr))`,
    },
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
      gap: dense("{spacing.gap.2xl}"),
      [UNFOLDED]: {
        alignItems: "center",
        columnGap: dense("{spacing.gap.lg}"),
        display: "grid",
        marginBlock: `calc(${HALO} * -1)`,
        overflowX: "auto",
        paddingBlock: HALO,
        rowGap: dense("{spacing.gap.xl}"),
      },
    },
    head: { display: "none", [UNFOLDED]: { display: "contents" } },
    label: { marginBlockEnd: dense("{spacing.gap.xs}"), [UNFOLDED]: { display: "none" } },
    root: { containerType: "inline-size" },
    row: {
      alignItems: "flex-start",
      display: "flex",
      flexWrap: "wrap",
      gap: dense("{spacing.gap.lg}"),
      [UNFOLDED]: { display: "contents" },
    },
    side: { flexBasis: "full", [UNFOLDED]: { flexBasis: "auto" } },
  },
  className: "matrix",
  defaultVariants: { across: "1" },
  jsx: [/^Matrix(\.\w+)?$/u],
  slots: ["root", "grid", "head", "row", "side", "cell", "label"],
  variants: {
    /**
     * How many values run across, beside the column the side captions take.
     */
    across: onSlot("grid", acrossCounts()),
  },
});
