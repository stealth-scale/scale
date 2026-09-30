/**
 * Renders one cell of a heat grid, filled from its value, with the value's words printed or read by
 * a screen reader alone, after the words that name its reading.
 *
 * @remarks
 *   The cell is a `td` of a grid, which a browser exposes as a `gridcell`, with the walk's key and
 *   tab stop. A cell with a value states `data-state="measured"` and its fill in `--heat-fill`; a
 *   cell without one states `data-state="missing"`, has no fill, and never prints its words, so its
 *   dashed edge is the only mark on it. A screen reader reads the words either way, with the cell's
 *   row and column headings.
 */

import { type ReactElement } from "react";

import { withContext } from "#heat/context.ts";
import { GridCell, Hidden } from "#heat/grid.ts";
import { FILL } from "#heat/recipe.ts";
import { type WalkedCell } from "#heat/walk.ts";

/**
 * Renders the printed words.
 */
const Value = withContext("span", "value");

/**
 * Describes the props of a cell: its fill, its words and the walk's props.
 */
export interface CellProps {
  /**
   * CSS value of the cell's fill, or undefined for a cell without a value.
   */
  readonly fill: string | undefined;

  /**
   * Words a screen reader reads before the value, which name the reading, such as its date, or
   * undefined without them.
   */
  readonly lead: string | undefined;

  /**
   * Whether the words are printed in the cell. A cell without a value never prints them.
   */
  readonly printed: boolean;

  /**
   * Value in words, or the words for a missing value.
   */
  readonly text: string;

  /**
   * Key, tab stop and readout mark the walk gives the cell.
   */
  readonly walked: WalkedCell;
}

/**
 * Renders the cell with its fill and its words.
 *
 * @param props - The fill, the words and the walk's props.
 */
export function Cell({ fill, lead, printed, text, walked }: CellProps): ReactElement {
  const Words = printed && fill !== undefined ? Value : Hidden;
  const filled: Record<string, string> | undefined =
    fill === undefined ? undefined : { [FILL]: fill };

  return (
    <GridCell data-state={fill === undefined ? "missing" : "measured"} style={filled} {...walked}>
      {lead === undefined ? null : <Hidden>{lead}</Hidden>}
      <Words>{text}</Words>
    </GridCell>
  );
}
