/**
 * Renders a pie chart: the parts of one whole as slices, largest first, each with its share written
 * on it.
 *
 * @remarks
 *   A pie makes one part's lead over the rest visible at a glance, for two to five parts of a
 *   whole. People compare angles poorly, so the slices are sorted and each shows its share. More
 *   parts gather into one slice through `maxSlices`, and values worth comparing are `BarChart`.
 *   The total in the middle is `DonutChart`.
 */

import { type ReactElement } from "react";

import { Polar } from "#polar/polar.tsx";
import { type PolarProps } from "#polar/types.ts";

/**
 * Describes the props of a pie chart: the polar props.
 */
export type PieChartProps = PolarProps;

/**
 * Renders the chart's figure around a whole pie of the slices.
 *
 * @param props - The slices and the words.
 */
export function PieChart(props: PieChartProps): ReactElement {
  return <Polar {...props} hole={0} />;
}
