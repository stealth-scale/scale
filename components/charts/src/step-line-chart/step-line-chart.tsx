/**
 * Renders a step line chart: a line per series, flat from each point until the next.
 *
 * @remarks
 *   A step states that the value was constant and then changed at once, which is true of a price
 *   tier, a replica count or a rate limit. A sloped line between the same points states a gradual
 *   change that did not happen. Each step starts at its point and runs to the next (recharts'
 *   `stepAfter`), because a sampled value applies from the moment it was read.
 */

import { type ReactElement } from "react";

import { Cartesian } from "#cartesian/cartesian.tsx";
import { type CartesianProps, type Shape } from "#cartesian/types.ts";

/**
 * Describes the props of a step line chart: the cartesian props.
 *
 * @typeParam Row - One row of the data.
 */
export type StepLineChartProps<Row> = CartesianProps<Row>;

/**
 * Shape of a step line chart: upright lines of steps, not stacked.
 */
const SHAPE: Shape = { curve: "step", direction: "vertical", mark: "line", stack: "none" };

/**
 * Renders the chart's figure around a line of steps per series.
 *
 * @typeParam Row - One row of the data.
 * @param props - The rows, the series and the words.
 */
export function StepLineChart<Row>(props: StepLineChartProps<Row>): ReactElement {
  return <Cartesian {...props} shape={SHAPE} />;
}
