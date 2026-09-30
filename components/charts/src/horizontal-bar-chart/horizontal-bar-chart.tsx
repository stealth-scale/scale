/**
 * Renders a horizontal bar chart: bars on their side, with the categories down the start edge.
 *
 * @remarks
 *   Horizontal bars keep long category names level and whole, where upright bars would rotate or
 *   clip them, and read as a ranking. The chart renders the rows in the order it is given, so the
 *   caller sorts them. The category axis measures its widest name. A series with a `target` marks
 *   each bar's target with a tick, and `zones` fill each bar's row with the zones of the value axis
 *   behind a measure 42% of the row, which makes each row a bullet graph: several measures against
 *   their targets on one scale.
 */

import { type ReactElement } from "react";

import { type BarChartProps } from "#bar-chart/bar-chart.tsx";
import { Cartesian } from "#cartesian/cartesian.tsx";
import { type Shape } from "#cartesian/types.ts";

/**
 * Describes the props of a horizontal bar chart: a bar chart's props.
 *
 * @typeParam Row - One row of the data.
 */
export type HorizontalBarChartProps<Row> = BarChartProps<Row>;

/**
 * Shape of a horizontal bar chart: bars on their side, side by side.
 */
const SHAPE: Shape = { curve: "linear", direction: "horizontal", mark: "bar", stack: "none" };

/**
 * Renders the chart's figure around a horizontal bar per series in each category.
 *
 * @typeParam Row - One row of the data.
 * @param props - The rows, the series, the words, the targets and the zones.
 */
export function HorizontalBarChart<Row>(props: HorizontalBarChartProps<Row>): ReactElement {
  return <Cartesian {...props} shape={SHAPE} />;
}
