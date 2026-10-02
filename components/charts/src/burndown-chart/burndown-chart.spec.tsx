import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BurndownChart, type BurndownChartProps } from "#burndown-chart/burndown-chart.tsx";
import { type BurndownPoint } from "#burndown-chart/rows.ts";
import { laidOut, ticksOf } from "#cartesian/cartesian.fixtures.ts";

/**
 * Lists a five-day sprint read on its first three days, falling 8 points a day from 40.
 */
const SPRINT: readonly BurndownPoint[] = [
  { at: "Mon", remaining: 40 },
  { at: "Tue", remaining: 32 },
  { at: "Wed", remaining: 24 },
  { at: "Thu" },
  { at: "Fri" },
];

/**
 * Renders the chart over the sprint with the props a case changes.
 */
function drawn(props: Partial<BurndownChartProps> = {}): Element {
  laidOut();

  return render(<BurndownChart label="Sprint 14" locale="en-US" points={SPRINT} {...props} />)
    .container;
}

/**
 * Returns the `stroke` and `stroke-dasharray` of every line inside a container, in series order.
 */
function linesOf(container: Element): Array<[null | string, null | string]> {
  return [...container.querySelectorAll(".recharts-line-curve")].map((line) => [
    line.getAttribute("stroke"),
    line.getAttribute("stroke-dasharray"),
  ]);
}

describe("BurndownChart", () => {
  it("renders the readings, the ideal line and the projection as three lines", () => {
    expect(linesOf(drawn())).toHaveLength(3);
  });

  it("renders the readings as a solid line in the first series color", () => {
    expect(linesOf(drawn())[0]).toStrictEqual(["var(--colors-series-1)", null]);
  });

  it("dashes the ideal line in the neutral palette's chart color", () => {
    expect(linesOf(drawn())[1]).toStrictEqual(["var(--colors-neutral-chart)", "6 4"]);
  });

  it("dashes the projection in the warning palette's chart color", () => {
    expect(linesOf(drawn())[2]).toStrictEqual(["var(--colors-warning-chart)", "6 4"]);
  });

  it("renders no projection when projection is off", () => {
    expect(linesOf(drawn({ projection: false }))).toHaveLength(2);
  });

  it("renders no projection when the work does not fall", () => {
    const points = [
      { at: "Mon", remaining: 30 },
      { at: "Tue", remaining: 34 },
    ];

    expect(linesOf(drawn({ points }))).toHaveLength(2);
  });

  it("names the three lines in English by default", () => {
    expect(
      [...drawn().querySelectorAll(".chart__legend button")].map((button) => button.textContent),
    ).toStrictEqual(["Remaining", "Ideal", "Projected"]);
  });

  it("writes each period on the category axis", () => {
    expect(ticksOf(drawn())).toContain("Fri");
  });

  it("starts the ideal line at the stated total", () => {
    expect(
      [...drawn({ defaultIndex: 0, total: 80 }).querySelectorAll(".chart__value")].map(
        (value) => value.textContent,
      ),
    ).toStrictEqual(["40", "80"]);
  });

  it("writes the values to one decimal by default", () => {
    expect(
      [...drawn({ defaultIndex: 1, periods: 4 }).querySelectorAll(".chart__value")].map(
        (value) => value.textContent,
      ),
    ).toStrictEqual(["32", "26.7"]);
  });

  it("writes the values with the stated options", () => {
    expect(
      [
        ...drawn({
          defaultIndex: 1,
          periods: 4,
          valueOptions: { maximumFractionDigits: 0 },
        }).querySelectorAll(".chart__value"),
      ].map((value) => value.textContent),
    ).toStrictEqual(["32", "27"]);
  });

  it("ends the ideal line at the stated periods", () => {
    expect(
      [...drawn({ defaultIndex: 2, periods: 3 }).querySelectorAll(".chart__value")].map(
        (value) => value.textContent,
      ),
    ).toStrictEqual(["24", "0", "24"]);
  });
});
