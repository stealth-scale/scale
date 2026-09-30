/**
 * Turns a timeline's lanes into what recharts plots: a point per cluster, lane by lane and each
 * lane in time order, with the marker's color and its place in the keyboard walk, and the lanes
 * with their names.
 */

import { colorOf } from "#chart/colors.ts";
import {
  type EventCluster,
  type EventLane,
  loudestColor,
  OTHER_LANE,
  type TimelineEvent,
} from "#events/layout.ts";
import { type TimelineLane } from "#timeline-chart/types.ts";

/**
 * Describes a marker as recharts plots it.
 */
export interface MarkerDatum {
  /**
   * Instant of the cluster's first moment, which the time axis reads.
   */
  readonly at: number;

  /**
   * Cluster of moments the marker renders.
   */
  readonly cluster: EventCluster;

  /**
   * CSS color of the marker: its loudest moment's color, else the theme's first series color.
   */
  readonly color: string;

  /**
   * Key of the marker's lane, which the lane axis reads.
   */
  readonly lane: string;

  /**
   * Place of the marker in the keyboard walk.
   */
  readonly walk: number;
}

/**
 * Returns a marker per cluster, lane by lane, each numbered by its place in the walk.
 *
 * @param lanes - The lanes in order, each with its clusters in time order.
 */
export function markersOf(lanes: readonly EventLane[]): MarkerDatum[] {
  return lanes
    .flatMap((lane) => lane.clusters)
    .map((cluster, walk) => ({
      at: cluster.at,
      cluster,
      color: colorOf(loudestColor(cluster.events) ?? "series.1"),
      lane: cluster.lane,
      walk,
    }));
}

/**
 * Returns the lanes with their names: a stated lane's name, else its key, and the other lane's
 * words for the lane of the moments that name none.
 *
 * @param lanes - The lanes the layout returned, in order.
 * @param stated - The lanes the caller names, if any.
 * @param other - The name of the lane of the moments that name no lane.
 */
export function namedOf(
  lanes: readonly EventLane[],
  stated: readonly TimelineLane[] | undefined,
  other: string,
): TimelineLane[] {
  const names = new Map(stated?.map((lane) => [lane.key, lane.label]));

  return lanes.map(({ key }) => ({
    key,
    label: key === OTHER_LANE ? other : (names.get(key) ?? key),
  }));
}

/**
 * Returns what a press on a marker does: hand the caller the marker's moments, or nothing while the
 * caller takes no selection.
 *
 * @param onSelect - The caller's handler of a selection, if any.
 */
export function pressOf(
  onSelect?: (events: readonly TimelineEvent[]) => void,
): ((datum: MarkerDatum) => void) | undefined {
  return onSelect === undefined
    ? undefined
    : (datum) => {
        onSelect(datum.cluster.events);
      };
}
