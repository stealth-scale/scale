/**
 * Renders a bar chart: a bar per series side by side in each category.
 *
 * @remarks
 *   A bar is read by its length, so the value axis starts at zero unless `valueDomain` states a
 *   range. Bars suit categories that do not continue into each other, such as plans or countries,
 *   and totals per period. Parts of one total are `StackedBarChart`, shares are
 *   `PercentStackedBar`, and long category names or a ranking are `HorizontalBarChart`. A series
 *   with a `target` marks each bar's target with a tick, and `zones` fill each bar's column with
 *   the zones of the value axis, which makes each bar a bullet graph.
 */

import { type ReactElement } from "react";

import { Cartesian } from "#cartesian/cartesian.tsx";
import {
  type BarSeries,
  type BulletProps,
  type CartesianProps,
  type Shape,
} from "#cartesian/types.ts";

/**
 * Describes the props of a bar chart: the cartesian props, series that may read a target, and the
 * zones of the value axis.
 *
 * @typeParam Row - One row of the data.
 */
export interface BarChartProps<Row> extends BulletProps, Omit<CartesianProps<Row>, "series"> {
  /**
   * Series the chart plots, in the order the legend lists them, each with the field its targets
   * read where it has targets.
   */
  readonly series: readonly BarSeries[];
}

/**
 * Shape of a bar chart: upright bars side by side.
 */
const SHAPE: Shape = { curve: "linear", direction: "vertical", mark: "bar", stack: "none" };

/**
 * Renders the chart's figure around a bar per series in each category.
 *
 * @typeParam Row - One row of the data.
 * @param props - The rows, the series, the words, the targets and the zones.
 */
export function BarChart<Row>(props: BarChartProps<Row>): ReactElement {
  return <Cartesian {...props} shape={SHAPE} />;
}
