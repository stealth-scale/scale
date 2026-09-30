import { render } from "@testing-library/react";
import { ReferenceLine } from "recharts";
import { describe, expect, it } from "vitest";

import { barsOf, laidOut, ticksOf } from "#cartesian/cartesian.fixtures.ts";
import { ParetoChart, type ParetoChartProps } from "#pareto-chart/pareto-chart.tsx";

/**
 * Describes the support tickets of one reason.
 */
interface Reason {
  readonly reason: string;
  readonly tickets: number;
}

/**
 * Lists support tickets per reason, 100 in all, in no order.
 */
const TICKETS: Reason[] = [
  { reason: "Login", tickets: 20 },
  { reason: "Billing", tickets: 50 },
  { reason: "Export", tickets: 10 },
  { reason: "Search", tickets: 20 },
];

/**
 * Renders the chart over the tickets with the props a case changes.
 */
function drawn(props: Partial<ParetoChartProps<Reason>> = {}): Element {
  laidOut();

  return render(
    <ParetoChart
      categoryKey="reason"
      data={TICKETS}
      label="Tickets per reason"
      locale="en-US"
      valueKey="tickets"
      valueLabel="Tickets"
      {...props}
    />,
  ).container;
}

describe("ParetoChart", () => {
  it("sorts the bars largest first", () => {
    const heights = barsOf(drawn()).map((bar) => bar.height);

    expect(heights).toStrictEqual(heights.toSorted((first, second) => second - first));
  });

  it("renders the running share as a line on an end axis", () => {
    const container = drawn();

    expect(
      [".recharts-line-curve", ".recharts-yAxis"].map(
        (part) => container.querySelectorAll(part).length,
      ),
    ).toStrictEqual([1, 2]);
  });

  it("writes the end axis' ticks as whole percentages up to 100%", () => {
    expect(ticksOf(drawn())).toContain("100%");
  });

  it("writes the running share in the tooltip as a whole percentage", () => {
    expect(
      [...drawn({ defaultIndex: 1 }).querySelectorAll(".chart__value")].map(
        (value) => value.textContent,
      ),
    ).toStrictEqual(["20", "70%"]);
  });

  it("marks 80% with a dashed line by default", () => {
    const line = drawn().querySelector(".recharts-reference-line-line");

    expect(line?.getAttribute("stroke-dasharray")).toBe("6 4");
  });

  it("colors the threshold in the neutral palette's chart color", () => {
    const line = drawn().querySelector(".recharts-reference-line-line");

    expect(line?.getAttribute("stroke")).toBe("var(--colors-neutral-chart)");
  });

  it("renders no threshold line at a threshold of 0", () => {
    expect(drawn({ threshold: 0 }).querySelector(".recharts-reference-line")).toBeNull();
  });

  it("writes the threshold's label on its line", () => {
    expect(drawn({ thresholdLabel: "80% of tickets" }).textContent).toContain("80% of tickets");
  });

  it("names the running share Cumulative share by default", () => {
    expect(
      [...drawn().querySelectorAll(".chart__legend button")].map((button) => button.textContent),
    ).toStrictEqual(["Tickets", "Cumulative share"]);
  });

  it("renders recharts children inside the chart", () => {
    const container = drawn({
      children: <ReferenceLine className="probe" y={10} />,
      threshold: 0,
    });

    expect(container.querySelector(".probe")).not.toBeNull();
  });
});
