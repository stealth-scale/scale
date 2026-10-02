import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { laidOut, pathsOf, ROWS, SERIES, ticksOf } from "#cartesian/cartesian.fixtures.ts";
import { StackedAreaChart } from "#stacked-area-chart/stacked-area-chart.tsx";

describe("StackedAreaChart", () => {
  it("renders the series as bands at 0.85 opacity", () => {
    laidOut();

    const { container } = render(
      <StackedAreaChart categoryKey="day" data={ROWS} label="Payouts" series={SERIES} />,
    );

    expect(
      [...container.querySelectorAll(".recharts-area-area")].map((area) =>
        area.getAttribute("fill-opacity"),
      ),
    ).toStrictEqual(["0.85", "0.85"]);
  });

  it("writes the value ticks as amounts by default", () => {
    laidOut();

    const { container } = render(
      <StackedAreaChart categoryKey="day" data={ROWS} label="Payouts" series={SERIES} />,
    );

    expect(ticksOf(container).at(-1)).not.toContain("%");
  });

  it("sums every point to 100% when percent is set", () => {
    laidOut();

    const { container } = render(
      <StackedAreaChart categoryKey="day" data={ROWS} label="Payouts" percent series={SERIES} />,
    );

    expect(ticksOf(container).at(-1)).toBe("100%");
  });

  it("renders straight edges when curve is linear", () => {
    laidOut();

    const { container } = render(
      <StackedAreaChart
        categoryKey="day"
        curve="linear"
        data={ROWS}
        label="Payouts"
        series={SERIES}
      />,
    );

    expect(pathsOf(container)[0]).not.toContain("C");
  });
});
