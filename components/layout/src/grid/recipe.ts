/**
 * Styles a grid's root and items: columns, gap, flow, alignment and spans.
 *
 * @remarks
 *   Every value reads a gap token, a column count, a width token or a CSS alignment keyword. A
 *   count renders that many equal columns. `fit-<width>` renders as many columns of that width as
 *   the room holds and stretches them over the row. `fill-<width>` renders the same columns and
 *   keeps the empty tracks, so a lone item keeps its width. The recipe reads no breakpoint. The
 *   recipe has no `palette` or `effect` axis, because a grid renders no box of its own.
 */

import {
  alignVariants,
  columnCounts,
  defineSlotRecipe,
  filledColumns,
  fittedColumns,
  gapSizes,
  onSlot,
  spanCounts,
} from "@stealthscale/theme/authoring";

/**
 * Defaults to one column at the `md` gap.
 */
export const recipe = defineSlotRecipe({
  base: { item: { minInlineSize: "0" }, root: { display: "grid" } },
  className: "grid",
  defaultVariants: { columns: "1", gap: "md" },
  jsx: [/^Grid(\.\w+)?$/u],
  slots: ["root", "item"],
  variants: {
    /**
     * Block alignment of each item in its row.
     */
    align: onSlot("root", alignVariants()),

    /**
     * Column template: a count, `fit-<width>` or `fill-<width>`.
     */
    columns: {
      ...onSlot("root", columnCounts()),
      ...onSlot("root", filledColumns()),
      ...onSlot("root", fittedColumns()),
    },

    /**
     * Auto-placement algorithm. Items fill each row in order.
     *
     * @remarks
     *   `dense` fills a hole an earlier spanning item left with a later item. The axis has no
     *   column flow, because the recipe sets no row template, and column flow without one places
     *   every item in the first row.
     */
    flow: {
      dense: { root: { gridAutoFlow: "row dense" } },
      row: { root: { gridAutoFlow: "row" } },
    },

    /**
     * Gap token between the rows and the columns.
     */
    gap: onSlot("root", gapSizes()),

    /**
     * Inline alignment of each item in its column.
     *
     * @remarks
     *   The value sets `justify-items`. Every column template fills the row, so `justify-content`
     *   has no free space to distribute. Unset, the items stretch to the column.
     */
    justify: {
      start: { root: { justifyItems: "start" } },

      center: { root: { justifyItems: "center" } },

      end: { root: { justifyItems: "end" } },
    },

    /**
     * Number of columns an item spans. `full` spans every column.
     */
    span: { ...onSlot("item", spanCounts()), full: { item: { gridColumn: "1 / -1" } } },
  },
});
