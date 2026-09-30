/**
 * Renders a percent stacked bar chart: each category as one bar of 100%, split into its series'
 * shares.
 *
 * @remarks
 *   Every bar is as tall as the next, so a category of ten and one of ten million look alike: the
 *   chart compares composition, and the caption states the totals. The value ticks always read as
 *   whole percentages. The tooltip writes each series' own value with `valueOptions`.
 */

import { type ReactElement } from "react";

import { Cartesian } from "#cartesian/cartesian.tsx";
import { type CartesianProps, type Shape } from "#cartesian/types.ts";

/**
 * Describes the props of a percent stacked bar chart: the cartesian props.
 *
 * @typeParam Row - One row of the data.
 */
export type PercentStackedBarProps<Row> = CartesianProps<Row>;

/**
 * Shape of a percent stacked bar chart: upright bars, the series summed to 100%.
 */
const SHAPE: Shape = { curve: "linear", direction: "vertical", mark: "bar", stack: "percent" };

/**
 * Renders the chart's figure around a bar of 100% per category, split into its series' shares.
 *
 * @typeParam Row - One row of the data.
 * @param props - The rows, the series and the words.
 */
export function PercentStackedBar<Row>(props: PercentStackedBarProps<Row>): ReactElement {
  return <Cartesian {...props} shape={SHAPE} />;
}
