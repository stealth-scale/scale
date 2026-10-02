/**
 * Renders a line chart: a line per series over a category or time axis.
 *
 * @remarks
 *   A line states that the value exists between its points, which is true of a rate or a level over
 *   time and not of a total per category, where `BarChart` fits. A value that is constant until it
 *   changes is `StepLineChart`. The value axis starts at zero unless `valueDomain` states a range.
 */

import { type ReactElement } from "react";

import { Cartesian } from "#cartesian/cartesian.tsx";
import { type CartesianProps, type Curve } from "#cartesian/types.ts";

/**
 * Describes the props of a line chart: the cartesian props and the path between two points.
 *
 * @typeParam Row - One row of the data.
 */
export interface LineChartProps<Row> extends CartesianProps<Row> {
  /**
   * Path of each line between two points. Smoothed through them unless stated.
   */
  readonly curve?: Curve | undefined;
}

/**
 * Renders the chart's figure around a line per series.
 *
 * @typeParam Row - One row of the data.
 * @param props - The rows, the series, the words and the curve.
 */
export function LineChart<Row>({
  curve = "monotone",
  ...props
}: LineChartProps<Row>): ReactElement {
  return (
    <Cartesian {...props} shape={{ curve, direction: "vertical", mark: "line", stack: "none" }} />
  );
}
