/**
 * Renders a radar chart's polygons: one recharts `Radar` per series, hidden, faded and filled as
 * the series states.
 */

import { type ReactElement } from "react";

import { Radar, type RadarProps } from "recharts";

import { ACTIVE, STROKE } from "#cartesian/marks.tsx";
import { type ChartApi } from "#chart/use-chart.ts";

/**
 * Fill opacity of a filled polygon.
 */
const FILL = 0.25;

/**
 * Describes what the polygons are built from.
 */
export interface PolygonsOptions {
  /**
   * Whether the polygons grow in, which they do only outside reduced motion.
   */
  readonly animate: boolean;

  /**
   * Chart whose resolved series the polygons render.
   */
  readonly chart: ChartApi;

  /**
   * Keys of the series whose polygon renders as an outline.
   */
  readonly unfilled: ReadonlySet<string>;
}

/**
 * Returns a polygon per series in the legend's order: a 2px edge in the series' color, filled at
 * 0.25 of it unless the series is an outline, and a dot of radius 5 at the spoke the tooltip is at.
 *
 * @param options - The chart, the outline keys and the animation switch.
 */
export function polygonsOf({
  animate,
  chart,
  unfilled,
}: PolygonsOptions): Array<ReactElement<RadarProps>> {
  return chart.series.map((series) => (
    <Radar
      activeDot={ACTIVE}
      dataKey={series.key}
      fill={series.color}
      fillOpacity={unfilled.has(series.key) ? 0 : FILL}
      hide={series.hidden}
      isAnimationActive={animate ? "auto" : false}
      key={series.key}
      opacity={series.opacity}
      stroke={series.color}
      strokeWidth={STROKE}
    />
  ));
}
