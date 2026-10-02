/**
 * Renders a donut chart: the parts of one whole as a ring, largest first, with a figure such as the
 * total in the hole.
 *
 * @remarks
 *   The ring is the pie's slices with a hole of 58% of the chart's radius, and everything the pie
 *   does applies. The hole shows `center`, usually the total the slices add up to, and
 *   `centerLabel` under it. The chart does not sum the slices, because the figure in the middle is
 *   as often the largest share or a change as the total.
 */

import { type ReactElement, type ReactNode } from "react";

import { Polar } from "#polar/polar.tsx";
import { type PolarProps } from "#polar/types.ts";

/**
 * Radius of the hole, as a share of the largest radius the chart has room for.
 */
const HOLE = "58%";

/**
 * Describes the props of a donut chart: the polar props and the content of the hole.
 */
export interface DonutChartProps extends PolarProps {
  /**
   * Figure in the hole, such as the total the slices add up to.
   */
  readonly center?: ReactNode;

  /**
   * Words under the figure, such as what the total counts.
   */
  readonly centerLabel?: ReactNode;
}

/**
 * Renders the chart's figure around a ring of the slices with the figure in its hole.
 *
 * @param props - The slices, the words and the content of the hole.
 */
export function DonutChart(props: DonutChartProps): ReactElement {
  return <Polar {...props} hole={HOLE} />;
}
