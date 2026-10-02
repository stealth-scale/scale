/**
 * Renders the caller's message while the chart has no rows, in the plot's place and at its ratio.
 *
 * @remarks
 *   The empty state keeps the plot's box, so the page neither collapses while a range has no rows
 *   nor shifts when rows arrive. The words are the caller's children.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#chart/context.ts";
import { useChartContext } from "#chart/use-chart.ts";

/**
 * Renders the `div` with the chart's empty class.
 */
const Box = withContext("div", "empty");

/**
 * Describes the props of the empty state: the props of a `div`.
 */
export type EmptyProps = ComponentProps<typeof Box>;

/**
 * Renders the children while the chart has no rows, and nothing once it has one.
 *
 * @param props - The words and the props of a `div`.
 */
export function Empty(props: EmptyProps): null | ReactElement {
  const chart = useChartContext();

  return chart.data.length === 0 ? <Box {...props} /> : null;
}
