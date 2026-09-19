/**
 * States what a grid is: a root that lays its entries out in columns, and an entry that may span
 * more than one of them.
 *
 * @remarks
 *   Every value is a semantic gap, a count of columns, a named measure or a CSS alignment, so a
 *   theme moves the spacing and the measures of every grid by restating two scales. The columns
 *   axis states a count or a measure: a count draws that many equal columns, and `fit-<measure>`
 *   draws as many columns of that measure as there is room for and wraps the rest, which is the
 *   whole of the grid's responsiveness and needs no breakpoint from the page. `fill-<measure>`
 *   keeps the columns a short row leaves empty, so an entry alone on a row keeps its measure.
 */

import {
  alignVariants,
  columnCounts,
  defineSlotRecipe,
  filledColumns,
  fittedColumns,
  gapSizes,
  justifyVariants,
  onSlot,
  spanCounts,
} from "@stealthscale/theme/authoring";

/**
 * Draws a grid of one column at the middle gap until a caller says otherwise, with its entries
 * each a column wide.
 */
export const recipe = defineSlotRecipe({
  base: { item: { minInlineSize: "0" }, root: { display: "grid" } },
  className: "grid",
  defaultVariants: { columns: "1", gap: "md" },
  jsx: [/^Grid(\.\w+)?$/u],
  slots: ["root", "item"],
  variants: {
    align: onSlot("root", alignVariants()),
    columns: {
      ...onSlot("root", columnCounts()),
      ...onSlot("root", filledColumns()),
      ...onSlot("root", fittedColumns()),
    },
    flow: {
      column: { root: { gridAutoFlow: "column" } },
      dense: { root: { gridAutoFlow: "row dense" } },
      row: { root: { gridAutoFlow: "row" } },
    },
    gap: onSlot("root", gapSizes()),
    justify: onSlot("root", justifyVariants()),
    span: { ...onSlot("item", spanCounts()), full: { item: { gridColumn: "1 / -1" } } },
  },
});
