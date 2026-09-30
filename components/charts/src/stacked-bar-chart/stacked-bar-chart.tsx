/**
 * Renders a stacked bar chart: each category's total as one bar, split into its series.
 *
 * @remarks
 *   Stacking states that the series sum to the bar, which is true of revenue by plan and not of
 *   conversion rates. The total and the bottom segment are measured from the axis, and every other
 *   segment floats, so the series that matters most goes first. Shares without totals are
 *   `PercentStackedBar`.
 */

import { type ReactElement } from "react";

import { Cartesian } from "#cartesian/cartesian.tsx";
import { type CartesianProps, type Shape } from "#cartesian/types.ts";

/**
 * Describes the props of a stacked bar chart: the cartesian props.
 *
 * @typeParam Row - One row of the data.
 */
export type StackedBarChartProps<Row> = CartesianProps<Row>;

/**
 * Shape of a stacked bar chart: upright bars, the series summed.
 */
const SHAPE: Shape = { curve: "linear", direction: "vertical", mark: "bar", stack: "stacked" };

/**
 * Renders the chart's figure around a bar per category, split into its series.
 *
 * @typeParam Row - One row of the data.
 * @param props - The rows, the series and the words.
 */
export function StackedBarChart<Row>(props: StackedBarChartProps<Row>): ReactElement {
  return <Cartesian {...props} shape={SHAPE} />;
}
