/**
 * Renders the edge axis of a chart of bins, and writes a bin's range for the tooltip's heading.
 *
 * @remarks
 *   The axis is numeric and runs from the first bin's lower edge to the last bin's upper edge, so a
 *   bar rendered from its edges meets the plot's ends. recharts leaves out a label that collides
 *   with the next, which spaces the labels unevenly once the edges crowd, so the axis labels every
 *   edge, else every second or every fifth from the first, and at most eight even steps show.
 */

import { type ReactElement } from "react";

import { XAxis } from "recharts";

import { CHROME } from "#cartesian/axes.tsx";
import { finiteAt } from "#cartesian/finite.ts";
import { type TooltipEntry } from "#chart/tooltip.tsx";

/**
 * Largest number of steps between the labelled edges, so the labels are spaced at even steps.
 */
const STEPS = 8;

/**
 * Describes a row of a chart of bins: a bin's two edges and the middle of its range, the point
 * recharts reads the bin at for the tooltip and the keyboard layer.
 */
export interface EdgeRow {
  /**
   * Lower edge of the bin.
   */
  readonly from: number;

  /**
   * Middle of the bin's range.
   */
  readonly middle: number;

  /**
   * Upper edge of the bin.
   */
  readonly to: number;
}

/**
 * Returns each bin's lower edge, then the last bin's upper edge.
 */
function edgesOf(rows: readonly EdgeRow[]): number[] {
  return rows.flatMap((row, index) => (index === 0 ? [row.from, row.to] : [row.to]));
}

/**
 * Returns the edges the axis labels: every edge, else every second or every fifth from the first.
 */
function labelledOf(edges: readonly number[]): number[] {
  const bins = edges.length - 1;
  const every = bins <= STEPS ? 1 : bins <= 2 * STEPS ? 2 : 5;

  return edges.filter((_, index) => index % every === 0);
}

/**
 * Returns the numeric axis of the rows' bins, labelled at an even step of edges.
 *
 * @param rows - The bins, in ascending order.
 * @param format - The formatter of an edge.
 */
export function edgeAxisOf(
  rows: readonly EdgeRow[],
  format: (value: unknown) => string,
): ReactElement {
  const edges = edgesOf(rows);

  return (
    <XAxis
      {...CHROME}
      dataKey="middle"
      domain={[edges[0] ?? 0, edges.at(-1) ?? 1]}
      tickFormatter={format}
      ticks={labelledOf(edges)}
      type="number"
    />
  );
}

/**
 * Returns the range of the bin a tooltip's entries were read from, written with a formatter.
 *
 * @remarks
 *   The formatter writes a pair of numbers as a range and anything else as an empty string, so the
 *   heading is empty while the tooltip has no entry.
 */
export function rangeOf(
  entries: readonly TooltipEntry[],
  format: (value: unknown) => string,
): string {
  const payload = entries[0]?.payload;

  return format([finiteAt(payload, "from"), finiteAt(payload, "to")]);
}
