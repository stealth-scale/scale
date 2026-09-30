/**
 * Renders a stacked area chart: the series stacked into one total over a category or time axis.
 *
 * @remarks
 *   Stacking states that the series sum to a total, which is true of traffic by source and not of
 *   latency percentiles. Only the bottom series and the total are measured from the axis, so the
 *   series that matters most goes first. With `percent` every point sums to 100%, the value ticks
 *   read as percentages and the chart shows shares, not amounts.
 */

import { type ReactElement } from "react";

import { Cartesian } from "#cartesian/cartesian.tsx";
import { type CartesianProps, type Curve } from "#cartesian/types.ts";

/**
 * Describes the props of a stacked area chart: the cartesian props, the edges' path and the share.
 *
 * @typeParam Row - One row of the data.
 */
export interface StackedAreaChartProps<Row> extends CartesianProps<Row> {
  /**
   * Path of each band's edge between two points. Smoothed through them unless stated.
   */
  readonly curve?: Curve | undefined;

  /**
   * Whether every point sums to 100%, so the chart shows each series' share.
   */
  readonly percent?: boolean | undefined;
}

/**
 * Renders the chart's figure around the series stacked into bands.
 *
 * @typeParam Row - One row of the data.
 * @param props - The rows, the series, the words, the curve and the share.
 */
export function StackedAreaChart<Row>({
  curve = "monotone",
  percent = false,
  ...props
}: StackedAreaChartProps<Row>): ReactElement {
  return (
    <Cartesian
      {...props}
      shape={{ curve, direction: "vertical", mark: "area", stack: percent ? "percent" : "stacked" }}
    />
  );
}
