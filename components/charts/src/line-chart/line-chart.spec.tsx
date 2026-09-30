import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { laidOut, pathsOf, ROWS, SERIES } from "#cartesian/cartesian.fixtures.ts";
import { LineChart } from "#line-chart/line-chart.tsx";

describe("LineChart", () => {
  it("renders a line per series", () => {
    laidOut();

    const { container } = render(
      <LineChart categoryKey="day" data={ROWS} label="Payouts" series={SERIES} />,
    );

    expect(container.querySelectorAll(".recharts-line-curve")).toHaveLength(2);
  });

  it("smooths the lines through their points by default", () => {
    laidOut();

    const { container } = render(
      <LineChart categoryKey="day" data={ROWS} label="Payouts" series={SERIES} />,
    );

    expect(pathsOf(container)[0]).toContain("C");
  });

  it("renders straight lines between the points when curve is linear", () => {
    laidOut();

    const { container } = render(
      <LineChart categoryKey="day" curve="linear" data={ROWS} label="Payouts" series={SERIES} />,
    );

    expect(pathsOf(container)[0]).not.toContain("C");
  });
});
