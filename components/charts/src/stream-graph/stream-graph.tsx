/**
 * Renders a stream graph: many series stacked about a moving baseline, so each band's shape reads
 * across a long span.
 *
 * @remarks
 *   The chart gives up the total and every band's measure to show which series rose and which
 *   faded: no value reads off a band against an axis, so it renders no value axis and no grid, and
 *   the tooltip writes each series' own value. The bands stack inside out unless `insideOut` is
 *   off, for an order the reader already knows. The stack's order leaves each series' color and
 *   its place in the legend alone, so a series keeps its color from one span of data to the next.
 *   The legend renders while the series fit the theme's eight series colors, because past them a
 *   color names two series. Under about four series or twenty points `StackedAreaChart` shows the
 *   same and lets a reader measure it.
 */

import { type ReactElement } from "react";

import { Cartesian } from "#cartesian/cartesian.tsx";
import { type CartesianProps, type Curve } from "#cartesian/types.ts";
import { SERIES_COLORS } from "#chart/colors.ts";
import { insideOutOrder } from "#stream-graph/order.ts";

/**
 * Describes the props of a stream graph: the cartesian props, the baseline, the order and the path
 * of a band's edge.
 *
 * @typeParam Row - One row of the data.
 */
export interface StreamGraphProps<Row> extends CartesianProps<Row> {
  /**
   * How the baseline moves: `wiggle` keeps the bands as still as it can, `silhouette` centres the
   * stack on a straight line.
   */
  readonly baseline?: "silhouette" | "wiggle" | undefined;

  /**
   * Path of each band's edge between two points. Smoothed through them unless stated, because a
   * straight segment reads as a crease in every band at every point.
   */
  readonly curve?: Curve | undefined;

  /**
   * Whether the bands stack inside out, the early ones in the middle. The series' order, bottom
   * first, when off.
   */
  readonly insideOut?: boolean | undefined;
}

/**
 * Renders the chart's figure around the series stacked about a moving baseline.
 *
 * @typeParam Row - One row of the data.
 * @param props - The rows, the series, the words, the baseline and the order.
 */
export function StreamGraph<Row>({
  baseline = "wiggle",
  curve = "monotone",
  data,
  grid = false,
  insideOut = true,
  legend,
  series,
  ...props
}: StreamGraphProps<Row>): ReactElement {
  const keys = series.map((each) => each.key);

  return (
    <Cartesian
      {...props}
      data={data}
      grid={grid}
      legend={legend ?? (series.length > 1 && series.length <= SERIES_COLORS)}
      series={series}
      shape={{ curve, direction: "vertical", mark: "area", stack: baseline }}
      stackOrder={insideOut ? insideOutOrder(data, keys) : undefined}
    />
  );
}
