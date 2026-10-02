import { fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, textsOf } from "#timeline-chart/timeline-chart.fixtures.tsx";

/**
 * Returns the vertical centre of the dot of the marker at a place in the walk.
 */
function rowOf(container: Element, walk: number): number {
  return Number(
    container
      .querySelector(`.chart-marker[data-walk="${String(walk)}"] circle`)
      ?.getAttribute("cy"),
  );
}

describe("plot", () => {
  it("renders a marker per cluster", () => {
    expect(drawn().querySelectorAll(".chart-marker")).toHaveLength(5);
  });

  it("renders a pill with the count of the burst", () => {
    expect(textsOf(drawn(), ".chart-marker text")).toStrictEqual(["3"]);
  });

  it("names every lane on the lane axis", () => {
    expect(
      textsOf(drawn(), ".recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value"),
    ).toStrictEqual(["API", "Web", "Other"]);
  });

  it("places the first lane at the top", () => {
    const container = drawn();

    expect(rowOf(container, 0)).toBeLessThan(rowOf(container, 3));
  });

  it("renders a grid line along each lane", () => {
    expect(
      drawn().querySelectorAll(".recharts-cartesian-grid-horizontal line").length,
    ).toBeGreaterThanOrEqual(3);
  });

  it("renders no grid line across the lanes", () => {
    expect(drawn().querySelector(".recharts-cartesian-grid-vertical")).toBeNull();
  });

  it("writes the end of the window on the time axis", () => {
    expect(
      textsOf(drawn(), ".recharts-xAxis-tick-labels .recharts-cartesian-axis-tick-value").at(-1),
    ).toBe("00:00");
  });

  it("opens the tooltip at the marker at defaultIndex", () => {
    expect(textsOf(drawn({ defaultIndex: 1 }), ".chart__heading")).toStrictEqual([
      "API, 14:03 – 14:09",
    ]);
  });

  it("lists the moments of the marker the tooltip is at", () => {
    expect(textsOf(drawn({ defaultIndex: 1 }), ".chart__name")).toStrictEqual([
      "Latency alert",
      "Error rate alert",
      "Latency alert",
    ]);
  });

  it("renders no cursor at the marker under the pointer", () => {
    const container = drawn();
    const marker = container.querySelector(".chart-marker");

    fireEvent.mouseOver(marker ?? document.body, { relatedTarget: null });

    expect([
      textsOf(container, ".chart__heading"),
      container.querySelector(".recharts-cross, .recharts-tooltip-cursor"),
    ]).toStrictEqual([["API, 09:00"], null]);
  });

  it("renders recharts children inside the chart", () => {
    expect(drawn({ children: <g className="probe" /> }).querySelector(".probe")).not.toBeNull();
  });
});
