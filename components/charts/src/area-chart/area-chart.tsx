/**
 * Renders an area chart: a filled area per series over a category or time axis.
 *
 * @remarks
 *   The fill states that the amount under the line means something, which is true of a volume or a
 *   total and not of a rate or a ratio, where `LineChart` fits. Each area fades from 0.3 opacity at
 *   its top to transparent at the axis, so each of two overlapping series is readable through the
 *   other. Parts of one total are `StackedAreaChart`. The value axis starts at zero unless
 *   `valueDomain` states a range, because the fill is measured from the axis.
 */

import { type ReactElement } from "react";

import { Cartesian } from "#cartesian/cartesian.tsx";
import { type CartesianProps, type Curve } from "#cartesian/types.ts";

/**
 * Describes the props of an area chart: the cartesian props and the path of each area's edge.
 *
 * @typeParam Row - One row of the data.
 */
export interface AreaChartProps<Row> extends CartesianProps<Row> {
  /**
   * Path of each area's edge between two points. Smoothed through them unless stated.
   */
  readonly curve?: Curve | undefined;
}

/**
 * Renders the chart's figure around an area per series.
 *
 * @typeParam Row - One row of the data.
 * @param props - The rows, the series, the words and the curve.
 */
export function AreaChart<Row>({
  curve = "monotone",
  ...props
}: AreaChartProps<Row>): ReactElement {
  return (
    <Cartesian {...props} shape={{ curve, direction: "vertical", mark: "area", stack: "none" }} />
  );
}
