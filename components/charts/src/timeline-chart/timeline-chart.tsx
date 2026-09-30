/**
 * Renders a timeline: moments on one time window across lanes, where moments close together share
 * one marker that counts them.
 *
 * @remarks
 *   An instant has no width, so two moments a second apart in a day's window would print as one
 *   marker with the other hidden under it. Moments of a lane closer than `minGap` of the window
 *   share a marker, whose tooltip lists them all. One window serves every lane, so the lanes
 *   compare. The plot is a row of `sizes.10` per lane under the chart's `rows` ratio. The chart's
 *   `svg` is one tab stop: the left and right arrows, Home and End walk the markers lane by lane,
 *   Enter and Space select the marker the walk is at, and the tooltip names each marker's lane,
 *   time and moments.
 */

import { type ReactElement } from "react";

import { omitUndefined } from "@stealthscale/hooks";

import * as Chart from "#chart/index.ts";
import { ROWS } from "#chart/placed.ts";
import { useWalk } from "#chart/walk.ts";
import { layoutEvents } from "#events/layout.ts";
import { markersOf, namedOf, pressOf } from "#timeline-chart/markers.ts";
import { plotOf } from "#timeline-chart/plot.tsx";
import { type TimelineChartProps } from "#timeline-chart/types.ts";
import { writersOf } from "#timeline-chart/words.ts";

/**
 * Message the chart renders without a moment inside the window unless it states one.
 */
const EMPTY = "No data";

/**
 * Name of the lane of the moments that name no lane unless the chart states one.
 */
const OTHER = "Other";

/**
 * Format of the times unless stated: the day, the month and the time of day.
 */
const TIME: Intl.DateTimeFormatOptions = {
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  month: "short",
};

/**
 * Renders the chart's figure around the lanes, the markers and the caption.
 *
 * @param props - The moments, the lanes, the window, the words, the switches and the figure's
 *   props.
 */
export function TimelineChart({
  animate = false,
  caption,
  children,
  defaultIndex,
  empty = EMPTY,
  events,
  label,
  labelOptions = TIME,
  lanes,
  locale,
  minGap,
  moreLabel,
  onSelect,
  otherLabel = OTHER,
  since,
  ticks,
  until,
  ...root
}: TimelineChartProps): ReactElement {
  const layout = layoutEvents(
    events,
    omitUndefined({ lanes: lanes?.map((lane) => lane.key), minGap, since, until }),
  );
  const markers = markersOf(layout.lanes);
  const named = namedOf(layout.lanes, lanes, otherLabel);
  const chart = Chart.useChart({ data: markers, locale, series: [{ key: "events", label }] });
  const writers = writersOf({
    lanes: named,
    locale: chart.locale,
    more: moreLabel,
    options: labelOptions,
  });
  const style: Record<string, string> = { [ROWS]: String(named.length) };
  const walk = useWalk();

  return (
    <Chart.Root chart={chart} ratio="rows" {...root}>
      <Chart.Plot {...walk} style={style}>
        {plotOf({
          animate,
          children,
          defaultIndex,
          end: layout.end,
          label,
          lanes: named,
          markers,
          onPress: pressOf(onSelect),
          start: layout.start,
          ticks,
          writers,
        })}
      </Chart.Plot>
      <Chart.Empty>{empty}</Chart.Empty>
      {caption === undefined ? null : <Chart.Caption>{caption}</Chart.Caption>}
    </Chart.Root>
  );
}
