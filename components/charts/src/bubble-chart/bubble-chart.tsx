/**
 * Renders a bubble chart: a scatter whose points also show a third measure as their area.
 *
 * @remarks
 *   Recharts scales each point's area, not its radius, because a doubled radius quadruples the area
 *   and overstates every large value by the square. Readers judge area roughly, so the third
 *   measure reads as rank and rough size, and the tooltip writes its value. Large points hide small
 *   ones, so a caller lists each series' points largest first, and the small ones render on top.
 */

import { type ReactElement } from "react";

import { ScatterPlot } from "#scatter-plot/scatter-plot.tsx";
import { type ScatterPlotProps } from "#scatter-plot/types.ts";

/**
 * Describes the props of a bubble chart: a scatter's props with the field its points' area reads.
 *
 * @typeParam Point - One point of a series.
 */
export interface BubbleChartProps<Point> extends Omit<
  ScatterPlotProps<Point>,
  "size" | "sizeKey" | "sizeLabel"
> {
  /**
   * Field of each point its area reads.
   */
  readonly sizeKey: Extract<keyof Point, string>;

  /**
   * Name of the size's field, which the tooltip writes beside the value.
   */
  readonly sizeLabel: string;
}

/**
 * Renders the scatter with each point's area read from `sizeKey`.
 *
 * @typeParam Point - One point of a series.
 * @param props - A scatter's props with the size's field and its name.
 */
export function BubbleChart<Point extends object>(props: BubbleChartProps<Point>): ReactElement {
  return <ScatterPlot {...props} />;
}
