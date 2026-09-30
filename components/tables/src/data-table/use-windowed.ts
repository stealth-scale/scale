/**
 * Prepares a table's windowed body: the lines of each region, the number of rows the table states,
 * and the viewport the window scrolls in.
 *
 * @remarks
 *   A windowed table sticks its header unless the caller states `stickyHeader={false}`, takes an
 *   estimate of 40 pixels for a row before it measures one, and renders 8 rows beyond each end of
 *   the viewport, unless the caller states others. The window receives the scroller's viewport
 *   through state, because the viewport exists only after the first render. A table that is not
 *   windowed renders every row and states no row count.
 */

import { useState } from "react";

import { type DataTableApi } from "#data-table/use-data-table.ts";
import { type Windowing } from "#data-table/windowed-body.tsx";
import { regionLinesOf, rowCountOf } from "#data-table/windowed.ts";

/**
 * Describes the options of a windowed table: the estimate, the report of the end, the overscan,
 * whether the header sticks, and whether the table is windowed.
 */
export interface WindowedOptions {
  /**
   * Height in pixels the window takes for a row before it measures the first one. 40 unless
   * stated.
   */
  readonly estimateSize: number | undefined;

  /**
   * Runs when the last row comes within the overscan of the viewport, once per number of rows.
   */
  readonly onEndReached: (() => void) | undefined;

  /**
   * Number of rows rendered beyond each end of the viewport. 8 unless stated.
   */
  readonly overscan: number | undefined;

  /**
   * Whether the header rows stick, as the caller states it.
   */
  readonly stickyHeader: boolean | undefined;

  /**
   * Whether the table renders only the body rows in or near the viewport.
   */
  readonly windowed: boolean;
}

/**
 * Describes what a table renders for its window: its row count, the scroller's props and the
 * body's windowing.
 */
export interface WindowedTable {
  /**
   * Number of rows the table states in `aria-rowcount`, or undefined for a table that is not
   * windowed.
   */
  readonly count: number | undefined;

  /**
   * Props of the scroller: the sticky header and the viewport's ref.
   */
  readonly scroller: {
    /**
     * Whether the header rows stick.
     */
    readonly stickyHeader?: true;

    /**
     * Stores the scroller's viewport.
     */
    readonly viewportRef?: (node: HTMLDivElement | null) => void;
  };

  /**
   * How the body renders its rows, or undefined for a table that is not windowed.
   */
  readonly windowing: undefined | Windowing;
}

/**
 * Returns what a table renders for its window.
 *
 * @param table - The table whose rows are read.
 * @param options - The estimate, the report of the end, the overscan, the sticky header and
 *   whether the table is windowed.
 * @returns The row count, the scroller's props and the windowing.
 */
export function useWindowed(table: DataTableApi, options: WindowedOptions): WindowedTable {
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);

  if (!options.windowed) return { count: undefined, scroller: {}, windowing: undefined };

  const lines = regionLinesOf(table);

  return {
    count: rowCountOf(table, lines),
    scroller: { stickyHeader: true, viewportRef: setViewport },
    windowing: {
      estimateSize: options.estimateSize ?? 40,
      head: table.getHeaderGroups().length,
      lines,
      onEndReached: options.onEndReached,
      overscan: options.overscan ?? 8,
      stuck: options.stickyHeader !== false,
      viewport,
    },
  };
}
