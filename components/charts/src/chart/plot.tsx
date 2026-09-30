/**
 * Renders the box recharts sizes a chart to.
 *
 * @remarks
 *   Recharts' `ResponsiveContainer` sizes the chart to its parent and measures after the first
 *   render. The plot's height comes from the root's `ratio` before that measurement, so the chart
 *   never measures 0 inside a parent without a height. Until the measurement the chart renders at
 *   `initialDimension`, 640 by 360. The plot renders nothing while the chart has no rows, so
 *   `Chart.Empty` takes its place. A `center` renders over the middle of the box, where a pie's
 *   hole is, hidden from assistive technology because the caption states the finding.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { ResponsiveContainer } from "recharts";

import { withContext } from "#chart/context.ts";
import { useChartContext } from "#chart/use-chart.ts";

/**
 * Renders the `div` with the chart's plot class.
 */
const Box = withContext("div", "plot");

/**
 * Renders the `div` over the middle of the plot.
 */
const Center = withContext("div", "center");

/**
 * Renders the `span` with the figure in the middle of the plot.
 */
const CenterValue = withContext("span", "centerValue");

/**
 * Renders the `span` with the words under the figure.
 */
const CenterLabel = withContext("span", "centerLabel");

/**
 * Size a chart takes until recharts measures its box.
 */
const INITIAL = { height: 360, width: 640 };

/**
 * Describes the props of the plot: one recharts chart, the content over its middle and the props
 * of a `div`.
 */
export interface PlotProps extends Omit<ComponentProps<typeof Box>, "children"> {
  /**
   * Figure over the middle of the plot, such as the total in a donut's hole.
   */
  readonly center?: ReactNode;

  /**
   * Words under the figure in the middle, such as what the total counts.
   */
  readonly centerLabel?: ReactNode;

  /**
   * The recharts chart, such as a `LineChart` with its axes and marks.
   */
  readonly children: ReactElement;
}

/**
 * Renders the chart in a box as wide as the figure, or nothing while the chart has no rows.
 *
 * @param props - The recharts chart, the content over its middle and the props of a `div`.
 */
export function Plot({ center, centerLabel, children, ...props }: PlotProps): null | ReactElement {
  const chart = useChartContext();

  if (chart.data.length === 0) return null;

  return (
    <Box {...props}>
      <ResponsiveContainer initialDimension={INITIAL}>{children}</ResponsiveContainer>
      {center === undefined ? null : (
        <Center aria-hidden>
          <CenterValue>{center}</CenterValue>
          {centerLabel === undefined ? null : <CenterLabel>{centerLabel}</CenterLabel>}
        </Center>
      )}
    </Box>
  );
}
