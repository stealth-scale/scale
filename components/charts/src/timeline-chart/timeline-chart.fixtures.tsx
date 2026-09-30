import { render } from "@testing-library/react";

import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import { type TimelineEvent } from "#events/layout.ts";
import { TimelineChart } from "#timeline-chart/timeline-chart.tsx";
import { type TimelineChartProps, type TimelineLane } from "#timeline-chart/types.ts";

/**
 * Returns the instant of an hour and a minute on 28 September 2026, UTC.
 */
export function at(hour: number, minute = 0): number {
  return Date.UTC(2026, 8, 28, hour, minute);
}

/**
 * Lists a day of an api and a web service: a deploy of each, a burst of three alerts on the api,
 * its fix, and a notice that names no lane.
 */
export const DAY: TimelineEvent[] = [
  { at: at(9), color: "info", key: "a1", label: "Deploy api 1.4", lane: "api" },
  { at: at(10), color: "info", key: "w1", label: "Deploy web 2.0", lane: "web" },
  { at: at(14, 3), color: "warning", key: "b1", label: "Latency alert", lane: "api" },
  { at: at(14, 5), color: "error", key: "b2", label: "Error rate alert", lane: "api" },
  { at: at(14, 9), color: "warning", key: "b3", label: "Latency alert", lane: "api" },
  { at: at(15), color: "success", key: "a2", label: "Deploy api 1.5", lane: "api" },
  { at: at(20), key: "n1", label: "Maintenance notice" },
];

/**
 * Names the two services.
 */
export const LANES: TimelineLane[] = [
  { key: "api", label: "API" },
  { key: "web", label: "Web" },
];

/**
 * Renders the day from midnight to midnight with the props a case changes, and returns the
 * container.
 */
export function drawn(props: Partial<TimelineChartProps> = {}): Element {
  laidOut();

  return render(
    <TimelineChart
      events={DAY}
      label="Deploys and incidents on 28 September"
      labelOptions={{ hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZone: "UTC" }}
      lanes={LANES}
      locale="en-US"
      since={at(0)}
      until={at(24)}
      {...props}
    />,
  ).container;
}

/**
 * Returns the text of every element a selector matches inside a container, in document order.
 */
export function textsOf(container: Element, selector: string): string[] {
  return [...container.querySelectorAll(selector)].map((element) => element.textContent);
}
