import { vi } from "vitest";

import { type CartesianSeries, type Shape } from "#cartesian/types.ts";

/**
 * Describes one row of the fixture data.
 */
export interface Row {
  readonly day: string;
  readonly paid: number;
  readonly refunded: number;
}

/**
 * Lists three days of payouts.
 */
export const ROWS: Row[] = [
  { day: "2026-09-21", paid: 120, refunded: 12 },
  { day: "2026-09-22", paid: 180, refunded: 30 },
  { day: "2026-09-23", paid: 150, refunded: 8 },
];

/**
 * Lists the two series of the fixture data, the second dashed.
 */
export const SERIES: readonly CartesianSeries[] = [
  { key: "paid", label: "Paid" },
  { dashed: true, key: "refunded", label: "Refunded" },
];

/**
 * Shape of an upright line chart with smoothed lines.
 */
export const LINES: Shape = {
  curve: "monotone",
  direction: "vertical",
  mark: "line",
  stack: "none",
};

/**
 * Makes every element measure 480 by 270, where happy-dom lays out nothing and measures 0.
 */
export function laidOut(): void {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
    new DOMRect(0, 0, 480, 270),
  );
}

/**
 * Returns the box of every bar inside a container, in document order: the first series' bars,
 * then the next series'.
 */
export function barsOf(container: Element): Array<{ height: number; width: number; x: number }> {
  return [...container.querySelectorAll(".recharts-bar-rectangle path")].map((bar) => ({
    height: Number(bar.getAttribute("height")),
    width: Number(bar.getAttribute("width")),
    x: Number(bar.getAttribute("x")),
  }));
}

/**
 * Returns the path data of every line or area edge inside a container, in document order.
 */
export function pathsOf(container: Element): string[] {
  return [...container.querySelectorAll(".recharts-line-curve, .recharts-area-curve")].map(
    (path) => path.getAttribute("d") ?? "",
  );
}

/**
 * Returns the text of every tick label inside a container, in document order.
 */
export function ticksOf(container: Element): string[] {
  return [...container.querySelectorAll(".recharts-cartesian-axis-tick-value")].map(
    (tick) => tick.textContent,
  );
}
