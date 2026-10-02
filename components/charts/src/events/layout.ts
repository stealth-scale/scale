/**
 * Lays moments out on one time window across lanes, and joins moments that would print over each
 * other into one cluster.
 *
 * @remarks
 *   An instant has no width, so two moments a second apart in a week's window print as one marker
 *   with the other hidden under it. Moments of a lane closer than `minGap` of the window join the
 *   cluster that opened first. The gap is measured from where the cluster opened, so moments one
 *   gap apart do not chain into one cluster across the chart. One window serves every lane, so the
 *   lanes compare. The lanes keep the order the caller states, else the order the moments first
 *   name them.
 */

import { type ChartColor } from "#chart/colors.ts";

/**
 * Describes one moment: a deploy, an alert, a release.
 */
export interface TimelineEvent {
  /**
   * Instant the moment happened: a `Date`, milliseconds since the epoch, or an ISO 8601 string.
   */
  readonly at: Date | number | string;

  /**
   * Color of the moment's marker. The theme's first series color unless stated.
   */
  readonly color?: ChartColor | undefined;

  /**
   * Identity of the moment, unique among the events.
   */
  readonly key: string;

  /**
   * Words for the moment, which the tooltip writes.
   */
  readonly label: string;

  /**
   * Key of the lane the moment belongs to, such as a service. The other lane unless stated.
   */
  readonly lane?: string | undefined;
}

/**
 * Describes moments of one lane close enough together that one marker renders them all.
 */
export interface EventCluster {
  /**
   * Instant of the first moment, in milliseconds since the epoch.
   */
  readonly at: number;

  /**
   * Moments of the cluster in time order. One moment is a plain marker.
   */
  readonly events: readonly TimelineEvent[];

  /**
   * Key of the first moment, which identifies the cluster.
   */
  readonly key: string;

  /**
   * Key of the cluster's lane.
   */
  readonly lane: string;

  /**
   * Instant of the last moment, in milliseconds since the epoch.
   */
  readonly last: number;

  /**
   * Share of the window from its start to the cluster's first moment, from 0 to 1.
   */
  readonly share: number;
}

/**
 * Describes one lane: its key and its clusters in time order.
 */
export interface EventLane {
  /**
   * Clusters of the lane in time order, none where no moment of the lane is inside the window.
   */
  readonly clusters: readonly EventCluster[];

  /**
   * Key of the lane, or `OTHER_LANE` for the moments that name none.
   */
  readonly key: string;
}

/**
 * Describes the window and the lanes `layoutEvents` returns.
 */
export interface EventLayout {
  /**
   * Instant the window ends at, in milliseconds since the epoch.
   */
  readonly end: number;

  /**
   * Lanes in order.
   */
  readonly lanes: readonly EventLane[];

  /**
   * Instant the window starts at, in milliseconds since the epoch.
   */
  readonly start: number;
}

/**
 * Describes how `layoutEvents` lays moments out.
 */
export interface LayoutOptions {
  /**
   * Keys of the lanes in order. A moment of a lane not listed is left out.
   */
  readonly lanes?: readonly string[] | undefined;

  /**
   * Share of the window two moments of a lane keep apart before they join one cluster. 0.02 unless
   * stated.
   */
  readonly minGap?: number | undefined;

  /**
   * Instant the window starts at. The earliest moment unless stated.
   */
  readonly since?: Date | number | string | undefined;

  /**
   * Instant the window ends at. The latest moment unless stated.
   */
  readonly until?: Date | number | string | undefined;
}

/**
 * Key of the lane of the moments that name no lane.
 */
export const OTHER_LANE = "";

/**
 * Share of the window two moments keep apart unless stated.
 */
const MIN_GAP = 0.02;

/**
 * Lists the colors a cluster's marker takes ahead of its first moment's own, the loudest first.
 */
const LOUD: readonly ChartColor[] = ["error", "warning"];

/**
 * Describes a moment with its instant in milliseconds.
 */
interface Timed {
  /**
   * Instant of the moment, in milliseconds since the epoch.
   */
  readonly at: number;

  /**
   * The moment.
   */
  readonly event: TimelineEvent;
}

/**
 * Describes the window a lane's moments are placed in, and the gap that joins them.
 */
interface Window {
  /**
   * Share of the window two moments keep apart before they join one cluster.
   */
  readonly gap: number;

  /**
   * Length of the window in milliseconds.
   */
  readonly length: number;

  /**
   * Instant the window starts at, in milliseconds since the epoch.
   */
  readonly start: number;
}

/**
 * Describes a cluster while its lane is laid out, whose moments and last instant still grow.
 */
interface Open extends Omit<EventCluster, "events" | "last"> {
  /**
   * Moments of the cluster in time order.
   */
  readonly events: TimelineEvent[];

  /**
   * Instant of the last moment so far, in milliseconds since the epoch.
   */
  last: number;
}

/**
 * Returns an instant in milliseconds since the epoch, or `NaN` for one that cannot be read.
 *
 * @param at - A `Date`, milliseconds since the epoch, or an ISO 8601 string.
 */
export function timeOf(at: Date | number | string): number {
  return new Date(at).getTime();
}

/**
 * Returns the lane a moment belongs to.
 */
function laneOf(event: TimelineEvent): string {
  return event.lane ?? OTHER_LANE;
}

/**
 * Returns the keys of the lanes in order: the stated lanes, then the other lane while a moment
 * names none, else every lane in the order the moments first name it.
 */
function orderOf(timed: readonly Timed[], stated: readonly string[] | undefined): string[] {
  const named = new Set(timed.map(({ event }) => laneOf(event)));

  if (stated === undefined) return [...named];

  return named.has(OTHER_LANE) && !stated.includes(OTHER_LANE)
    ? [...stated, OTHER_LANE]
    : [...stated];
}

/**
 * Returns a lane's clusters: its moments inside the window in time order, each joined to the open
 * cluster while it is less than the gap from where that cluster opened.
 *
 * @param lane - The key of the lane.
 * @param timed - The lane's moments inside the window.
 * @param window - The window's start, its length and the gap, as a share of the length.
 */
function clustersOf(lane: string, timed: readonly Timed[], window: Window): EventCluster[] {
  const clusters: Open[] = [];

  for (const { at, event } of timed.toSorted((first, second) => first.at - second.at)) {
    const share = window.length === 0 ? 0 : (at - window.start) / window.length;
    const open = clusters.at(-1);

    if (open !== undefined && share - open.share < window.gap) {
      open.events.push(event);
      open.last = at;
    } else {
      clusters.push({ at, events: [event], key: event.key, lane, last: at, share });
    }
  }

  return clusters;
}

/**
 * Returns the window and the lanes of clusters the moments lay out into.
 *
 * @remarks
 *   A moment whose instant cannot be read, or outside the window, is left out. The window spans
 *   every readable moment unless `since` and `until` state it, so a caller who shows part of the
 *   moments states the window and the markers keep their places.
 * @param events - The moments in any order.
 * @param options - The lanes, the gap and the window.
 */
export function layoutEvents(
  events: readonly TimelineEvent[],
  options: LayoutOptions = {},
): EventLayout {
  const timed = events
    .map((event) => ({ at: timeOf(event.at), event }))
    .filter(({ at }) => Number.isFinite(at));
  const times = timed.map(({ at }) => at);
  const start = options.since === undefined ? Math.min(...times) : timeOf(options.since);
  const end = options.until === undefined ? Math.max(...times) : timeOf(options.until);

  if (!Number.isFinite(start) || !Number.isFinite(end)) return { end: 0, lanes: [], start: 0 };

  const inside = timed.filter(({ at }) => at >= start && at <= end);
  const window = { gap: options.minGap ?? MIN_GAP, length: end - start, start };
  const lanes = orderOf(timed, options.lanes).map((key) => ({
    clusters: clustersOf(
      key,
      inside.filter(({ event }) => laneOf(event) === key),
      window,
    ),
    key,
  }));

  return { end, lanes, start };
}

/**
 * Returns the color a cluster's marker takes: `error` while a moment is an error, else `warning`
 * while one is a warning, else the first moment's color.
 *
 * @param events - The moments of the cluster.
 */
export function loudestColor(events: readonly TimelineEvent[]): ChartColor | undefined {
  return LOUD.find((loud) => events.some((event) => event.color === loud)) ?? events[0]?.color;
}
