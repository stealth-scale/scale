/**
 * Renders a range chart: a band between two fields of each row, and lines plotted over it.
 *
 * @remarks
 *   The band is the uncertainty and the line the estimate: a forecast plotted as a line alone
 *   claims a precision it does not have. The band fills the area between its two fields at 0.2 with
 *   no edge, because its width is what a reader reads, and the tooltip writes it as its two ends.
 *   The band's low field must be below its high field in every row. The chart does not swap them.
 */

import { type ReactElement } from "react";

import { Cartesian } from "#cartesian/cartesian.tsx";
import {
  type CartesianProps,
  type CartesianSeries,
  type Curve,
  type RangeBand,
} from "#cartesian/types.ts";

/**
 * Series a range chart plots over its band unless stated: none.
 */
const NONE: readonly CartesianSeries[] = [];

/**
 * Describes the props of a range chart: the cartesian props, the band, the lines over it and the
 * path of a line.
 *
 * @typeParam Row - One row of the data.
 */
export interface RangeChartProps<Row> extends Omit<CartesianProps<Row>, "series"> {
  /**
   * Band between two fields of each row, such as the low and high ends of a forecast.
   */
  readonly band: RangeBand;

  /**
   * Path of each line and of the band's edges between two points. Smoothed through them unless
   * stated.
   */
  readonly curve?: Curve | undefined;

  /**
   * Series plotted as lines over the band, such as the estimate or the actual value.
   */
  readonly series?: readonly CartesianSeries[] | undefined;
}

/**
 * Renders the chart's figure around the band and a line per series over it.
 *
 * @typeParam Row - One row of the data.
 * @param props - The rows, the band, the series, the words and the curve.
 */
export function RangeChart<Row>({
  band,
  curve = "monotone",
  series = NONE,
  ...props
}: RangeChartProps<Row>): ReactElement {
  const { high, low, ...options } = band;

  return (
    <Cartesian
      {...props}
      series={[{ ...options, band: { high, low } }, ...series]}
      shape={{ curve, direction: "vertical", mark: "mixed", stack: "none" }}
    />
  );
}
