/**
 * Draws the parts of a matrix: the container, the scroll area, the grid, its top edge, a row, the
 * caption at a row's side, a cell of the grid, and the caption a cell carries while the grid is
 * folded.
 *
 * @remarks
 *   What a cell holds is a sample, which carries its own caption and its own box, so the matrix
 *   states no part for one.
 *   Every part that holds nothing but a caption is bound to the library's paragraph rather than to
 *   a div, so the slot's styles and the caption's text are one element. The caption's size and ink
 *   are the part's own defaults, which a specimen never states.
 */

import { type ComponentProps } from "react";

import { ScrollArea } from "@stealthscale/component-primitives";
import { Text } from "@stealthscale/component-typography";

import { CAPTION } from "#caption.tsx";
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
 * Draws the primitives package's scroll area the grid scrolls across in, once unfolded.
 */
export const Scroller = withContext(ScrollArea.Root, "scroller");

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
export const Side = withContext(Text, "side", { defaultProps: CAPTION });

/**
 * Draws one cell of the grid.
 */
export const Cell = withContext("div", "cell");

/**
 * Draws the caption of one column, in a cell of the top edge.
 */
export const Column = withContext(Text, "cell", { defaultProps: CAPTION });

/**
 * Draws the caption a cell carries while the grid is folded.
 */
export const Label = withContext(Text, "label", { defaultProps: CAPTION });
