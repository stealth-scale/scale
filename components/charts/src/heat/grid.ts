/**
 * Binds the elements a heat grid is composed from: the frame, the table with the grid role, the
 * headings of its columns, its groups of columns and its rows, its cells, and the words a screen
 * reader reads alone.
 *
 * @remarks
 *   The table is a `grid`, so a screen reader reads a focused cell with its row and column headings
 *   and the arrows move between cells. Each heading states its scope, because a browser guesses the
 *   scope of a `th` that states none. A group's heading spans its columns with `colgroup` scope.
 */

import { type ComponentProps } from "react";

import { withContext, withProvider } from "#heat/context.ts";
import { LIT } from "#heat/recipe.ts";

/**
 * Describes the shapes of a heat grid's cells: a block, which widens to a printed value, or a
 * square.
 */
export type HeatShape = "block" | "square";

/**
 * Describes the sizes of a heat grid's cells.
 */
export type HeatSize = "lg" | "md" | "sm";

/**
 * Renders the `div` around the grid and its readout, which provides the recipe's variants.
 */
export const Frame = withProvider("div", "frame");

/**
 * Describes the props of the frame: the recipe's variants and the props of a `div`.
 */
export type FrameProps = ComponentProps<typeof Frame>;

/**
 * Renders the `table` with the grid role.
 */
export const Grid = withContext("table", "grid", { defaultProps: { role: "grid" } });

/**
 * Renders the heading of a group of columns.
 */
export const GroupHeading = withContext("th", "group", { defaultProps: { scope: "colgroup" } });

/**
 * Renders the words of a group's heading, placed out of the table's layout.
 */
export const GroupLabel = withContext("span", "groupLabel");

/**
 * Renders the heading of a column, or of the headings of the rows in the corner.
 */
export const ColumnHeading = withContext("th", "columnHeading", {
  defaultProps: { scope: "col" },
});

/**
 * Renders the heading of a row.
 */
export const RowHeading = withContext("th", "rowHeading", { defaultProps: { scope: "row" } });

/**
 * Renders a cell of the head without words, styled as a heading: the corner over the row headings,
 * or the place over columns in no group.
 */
export const Corner = withContext("td", "columnHeading");

/**
 * Renders a cell's `td`, which is empty for a pair without a reading in a sparse grid.
 */
export const GridCell = withContext("td", "cell");

/**
 * Renders words a screen reader reads alone.
 */
export const Hidden = withContext("span", "name");

/**
 * Returns the attribute of a heading while the readout shows a cell in its row or its column, and
 * nothing otherwise.
 *
 * @param on - Whether the readout shows a cell in the heading's row or column.
 */
export function litOf(on: boolean): Readonly<Record<string, string>> {
  return on ? { [LIT]: "" } : {};
}
