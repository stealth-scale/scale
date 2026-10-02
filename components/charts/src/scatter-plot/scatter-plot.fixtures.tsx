import { render } from "@testing-library/react";

import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import { type QuadrantId } from "#scatter-plot/quadrants.ts";
import { ScatterPlot } from "#scatter-plot/scatter-plot.tsx";
import { type ScatterPlotProps } from "#scatter-plot/types.ts";

/**
 * Describes one deal: its size in euros and the days it took to close.
 */
export interface Deal {
  readonly days: number;
  readonly size: number;
}

/**
 * Describes one vendor scored from 0 to 1 on its vision and its execution.
 */
export interface Vendor {
  readonly execution: number;
  readonly name: string;
  readonly vision: number;
}

/**
 * Lists three mid-market deals.
 */
export const MID: Deal[] = [
  { days: 28, size: 12_000 },
  { days: 22, size: 18_000 },
  { days: 41, size: 25_000 },
];

/**
 * Lists two enterprise deals.
 */
export const ENTERPRISE: Deal[] = [
  { days: 120, size: 85_000 },
  { days: 104, size: 120_000 },
];

/**
 * Lists four vendors, one in each quadrant: Alder top end, Birch top start, Cedar bottom start and
 * Maple bottom end.
 */
export const VENDORS: Vendor[] = [
  { execution: 0.8, name: "Alder", vision: 0.7 },
  { execution: 0.7, name: "Birch", vision: 0.3 },
  { execution: 0.3, name: "Cedar", vision: 0.2 },
  { execution: 0.25, name: "Maple", vision: 0.85 },
];

/**
 * Names the four quadrants of the vendors.
 */
export const NAMES: Readonly<Record<QuadrantId, string>> = {
  bottomEnd: "Visionaries",
  bottomStart: "Niche",
  topEnd: "Leaders",
  topStart: "Challengers",
};

/**
 * Renders the deals in two series with the props a case changes, and returns the container.
 */
export function drawn(props: Partial<ScatterPlotProps<Deal>> = {}): Element {
  laidOut();

  return render(
    <ScatterPlot
      label="Days to close by deal size"
      locale="en-US"
      series={[
        { key: "mid", label: "Mid-market", points: MID },
        { key: "enterprise", label: "Enterprise", points: ENTERPRISE },
      ]}
      xKey="size"
      xLabel="Deal size"
      yKey="days"
      yLabel="Days to close"
      {...props}
    />,
  ).container;
}

/**
 * Renders the vendors as a quadrant chart on scores from 0 to 1 with the props a case changes, and
 * returns the container.
 */
export function scored(props: Partial<ScatterPlotProps<Vendor>> = {}): Element {
  laidOut();

  return render(
    <ScatterPlot
      label="Vendors by vision and execution"
      labelKey="name"
      locale="en-US"
      quadrants={{ names: NAMES }}
      series={[{ key: "vendors", label: "Vendors", points: VENDORS }]}
      xDomain={[0, 1]}
      xKey="vision"
      xLabel="Vision"
      yDomain={[0, 1]}
      yKey="execution"
      yLabel="Execution"
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
