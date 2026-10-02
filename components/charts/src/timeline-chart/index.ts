/**
 * Exports the timeline, the layout of its moments and their types.
 */

export {
  type EventCluster,
  type EventLane,
  type EventLayout,
  layoutEvents,
  type LayoutOptions,
  OTHER_LANE,
  type TimelineEvent,
} from "#events/layout.ts";
export { TimelineChart } from "#timeline-chart/timeline-chart.tsx";
export { type TimelineChartProps, type TimelineLane } from "#timeline-chart/types.ts";
