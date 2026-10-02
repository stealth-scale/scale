/**
 * Describes a timeline's lanes and props.
 */

import { type ReactNode } from "react";

import { type RootProps } from "#chart/root.tsx";
import { type TimelineEvent } from "#events/layout.ts";

/**
 * Describes one lane of a timeline: the key its moments name, and its name on the lane axis.
 */
export interface TimelineLane {
  /**
   * Key the moments of the lane state in their `lane`.
   */
  readonly key: string;

  /**
   * Name of the lane on the lane axis and in the tooltip.
   */
  readonly label: string;
}

/**
 * Describes the props of a timeline: the moments, the lanes, the window, the words, the switches
 * and the figure's props.
 *
 * @remarks
 *   The chart sets the plot's height from its lanes, so it takes no `ratio`.
 */
export interface TimelineChartProps extends Omit<
  RootProps,
  "chart" | "children" | "grid" | "onSelect" | "ratio"
> {
  /**
   * Whether the markers animate in, which they do only outside reduced motion.
   */
  readonly animate?: boolean | undefined;

  /**
   * Finding the chart shows, in words, which names the figure.
   */
  readonly caption?: ReactNode;

  /**
   * Recharts elements rendered inside the chart after the markers, such as a `ReferenceLine` at the
   * current time.
   */
  readonly children?: ReactNode;

  /**
   * Place in the keyboard walk of the marker the tooltip shows when the chart first renders. No
   * tooltip shows at first unless stated.
   */
  readonly defaultIndex?: number | undefined;

  /**
   * Message the chart renders in the plot's place while no moment is inside the window.
   */
  readonly empty?: ReactNode;

  /**
   * Moments the chart places, in any order.
   */
  readonly events: readonly TimelineEvent[];

  /**
   * Accessible name of the chart's keyboard layer, such as "Deploys and incidents today".
   */
  readonly label: string;

  /**
   * `Intl.DateTimeFormat` options the time ticks and the tooltip's times are written with.
   */
  readonly labelOptions?: Intl.DateTimeFormatOptions | undefined;

  /**
   * Lanes in order, each with its name. Each lane the moments name, in the order they first name
   * it, unless stated. A moment of a lane not listed is left out.
   */
  readonly lanes?: readonly TimelineLane[] | undefined;

  /**
   * Locale the times are written in.
   */
  readonly locale?: string | undefined;

  /**
   * Share of the window two moments of a lane keep apart before one marker renders both.
   */
  readonly minGap?: number | undefined;

  /**
   * Writes the row that counts the moments of a marker its tooltip does not list.
   */
  readonly moreLabel?: ((count: number) => string) | undefined;

  /**
   * Called with a marker's moments when a press or the keys select the marker.
   */
  readonly onSelect?: ((events: readonly TimelineEvent[]) => void) | undefined;

  /**
   * Name of the lane of the moments that name no lane.
   */
  readonly otherLabel?: string | undefined;

  /**
   * Instant the window starts at. The earliest moment unless stated.
   */
  readonly since?: Date | number | string | undefined;

  /**
   * Number of times the time axis writes, evenly spaced, both ends included.
   */
  readonly ticks?: number | undefined;

  /**
   * Instant the window ends at. The latest moment unless stated.
   */
  readonly until?: Date | number | string | undefined;
}
