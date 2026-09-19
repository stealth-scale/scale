/**
 * Draws the parts of a matrix: the container, the grid, its top edge, a row, the caption at a
 * row's side, a cell of the grid, a cell of one axis, and the caption a cell carries while the
 * grid is folded.
 */

import { type ComponentProps } from "react";

import { withContext, withProvider } from "#matrix/context.ts";

/**
 * Draws the box the grid measures itself against, and states how many values run across.
 */
export const Root = withProvider("div", "root");

/**
 * Describes what the root takes: everything a styled div element takes, and the count across.
 */
export type RootProps = ComponentProps<typeof Root>;

/**
 * Draws the grid, folded into rows below the middle container size.
 */
export const Grid = withContext("div", "grid");

/**
 * Draws the top edge of the grid, which the fold takes away.
 */
export const Head = withContext("div", "head");

/**
 * Draws one row of the grid, which the fold turns into a wrapping line.
 */
export const Row = withContext("div", "row");

/**
 * Draws the caption at a row's side, which the fold puts on a line of its own above the row.
 */
export const Side = withContext("div", "side");

/**
 * Draws one cell of the grid.
 */
export const Cell = withContext("div", "cell");

/**
 * Draws one captioned cell of a single axis.
 */
export const Item = withContext("div", "item");

/**
 * Draws the caption a cell carries while the grid is folded.
 */
export const Label = withContext("div", "label");
