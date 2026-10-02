/**
 * Renders a timeline's axes: the time axis under the lanes, and the lane axis along the start edge.
 *
 * @remarks
 *   The time axis spans the window and writes `ticks` times evenly spaced across it, both ends
 *   included, so a window from midnight to midnight writes the quarters of the day. Recharts moves
 *   the time at each end inward until it fits the plot, and leaves out a time between them that
 *   would meet another. The axis is padded by half a pill at each end, so a marker at an end is
 *   inside the plot. The lane axis names each lane in order, the first at the top, and a chart of
 *   one lane renders none.
 */

import { type ReactElement } from "react";

import { XAxis, YAxis } from "recharts";

import { CHROME } from "#cartesian/axes.tsx";
import { type TimelineLane } from "#timeline-chart/types.ts";

/**
 * Space at each end of the time axis, in pixels: half the width of a pill of two digits.
 */
const PAD = 14;

/**
 * Number of times the time axis writes unless stated, both ends included.
 */
const TICKS = 5;

/**
 * Describes what a timeline's axes are built from.
 */
export interface TimelineAxesOptions {
  /**
   * Instant the window ends at, in milliseconds since the epoch.
   */
  readonly end: number;

  /**
   * Lanes in order, each with its name.
   */
  readonly lanes: readonly TimelineLane[];

  /**
   * Instant the window starts at, in milliseconds since the epoch.
   */
  readonly start: number;

  /**
   * Number of times the time axis writes, both ends included. 5 unless stated.
   */
  readonly ticks?: number | undefined;

  /**
   * Writes a time on the time axis.
   */
  readonly time: (at: number) => string;
}

/**
 * Returns a number of instants evenly spaced across a window, both ends included, two at least.
 *
 * @param start - The instant the window starts at.
 * @param end - The instant the window ends at.
 * @param count - The number of instants.
 */
export function ticksOf(start: number, end: number, count: number): number[] {
  const steps = Math.max(count, 2) - 1;

  return Array.from({ length: steps + 1 }, (_, at) => start + ((end - start) * at) / steps);
}

/**
 * Returns the time axis and the lane axis.
 *
 * @param options - The window, the lanes, the number of times and the time's writer.
 */
export function timelineAxesOf(options: TimelineAxesOptions): ReactElement[] {
  const keys = options.lanes.map((lane) => lane.key);
  const names = new Map(options.lanes.map((lane) => [lane.key, lane.label]));

  /**
   * Returns a lane's name from its key, which is what every tick of the lane axis is.
   */
  const nameOf = (key: string): string =>
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every tick of the lane axis is the key of a lane, and every lane has a name
    names.get(key) as string;

  return [
    <XAxis
      {...CHROME}
      dataKey="at"
      domain={[options.start, options.end]}
      interval="preserveStartEnd"
      key="time"
      padding={{ left: PAD, right: PAD }}
      tickFormatter={options.time}
      ticks={ticksOf(options.start, options.end, options.ticks ?? TICKS)}
      type="number"
    />,
    <YAxis
      {...CHROME}
      allowDuplicatedCategory={false}
      dataKey="lane"
      domain={keys}
      hide={keys.length < 2}
      interval={0}
      key="lanes"
      reversed
      tickFormatter={nameOf}
      ticks={keys}
      type="category"
      width="auto"
    />,
  ];
}
