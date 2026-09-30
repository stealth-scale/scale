/**
 * Renders a timeline's recharts chart: a line per lane, the time and lane axes, the tooltip, a
 * marker per cluster and the caller's children.
 *
 * @remarks
 *   The markers are one recharts `Scatter` over the time and lane axes, so the tooltip opens at a
 *   marker under the pointer as a scatter's does. The chart's keyboard walk, not recharts' layer,
 *   moves between the markers.
 */

import { type ReactElement, type ReactNode } from "react";

import { CartesianGrid, Scatter, ScatterChart, type ScatterShapeProps, Tooltip } from "recharts";

import * as Chart from "#chart/index.ts";
import { timelineAxesOf } from "#timeline-chart/axes.tsx";
import { Marker } from "#timeline-chart/marker.tsx";
import { type MarkerDatum } from "#timeline-chart/markers.ts";
import { type TimelineLane } from "#timeline-chart/types.ts";
import { headingOf, rowsOf, type TimelineWriters } from "#timeline-chart/words.ts";

/**
 * Describes what a timeline's plot is built from.
 */
export interface TimelinePlotOptions {
  /**
   * Whether the markers animate in, which they do only outside reduced motion.
   */
  readonly animate: boolean;

  /**
   * Recharts elements rendered after the markers.
   */
  readonly children: ReactNode;

  /**
   * Place in the walk of the marker the tooltip shows when the chart first renders.
   */
  readonly defaultIndex?: number | undefined;

  /**
   * Instant the window ends at, in milliseconds since the epoch.
   */
  readonly end: number;

  /**
   * Accessible name of the chart's keyboard layer.
   */
  readonly label: string;

  /**
   * Lanes in order, each with its name.
   */
  readonly lanes: readonly TimelineLane[];

  /**
   * Markers the chart plots.
   */
  readonly markers: readonly MarkerDatum[];

  /**
   * Called with a marker when a press or the keys select it.
   */
  readonly onPress?: ((datum: MarkerDatum) => void) | undefined;

  /**
   * Instant the window starts at, in milliseconds since the epoch.
   */
  readonly start: number;

  /**
   * Number of times the time axis writes, both ends included.
   */
  readonly ticks?: number | undefined;

  /**
   * Writers of the lanes' names, the times and the count of the rest.
   */
  readonly writers: TimelineWriters;
}

/**
 * Returns recharts' scatter chart of the markers.
 *
 * @param options - The markers, the lanes, the window, the words and the switches.
 */
export function plotOf(options: TimelinePlotOptions): ReactElement {
  const { defaultIndex, onPress, writers } = options;

  /**
   * Renders the marker recharts passes a point for, at the point's centre.
   */
  const shape = (point: ScatterShapeProps): ReactElement => (
    <Marker
      cx={Number(point.cx)}
      cy={Number(point.cy)}
      // eslint-disable-next-line typescript/no-unsafe-assignment -- recharts passes each point the marker it was rendered from
      datum={point.payload}
      initial={defaultIndex}
      onPress={onPress}
    />
  );

  return (
    <ScatterChart accessibilityLayer title={options.label}>
      <CartesianGrid vertical={false} />
      {timelineAxesOf({ ...options, time: writers.time })}
      <Tooltip
        content={<Chart.Tooltip headingOf={headingOf(writers)} rowsOf={rowsOf(writers)} />}
        cursor={false}
      />
      <Scatter
        data={[...options.markers]}
        isAnimationActive={options.animate ? "auto" : false}
        shape={shape}
      />
      {options.children}
    </ScatterChart>
  );
}
