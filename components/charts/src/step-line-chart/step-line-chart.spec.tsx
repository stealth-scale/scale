import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { laidOut, pathsOf, ROWS, SERIES } from "#cartesian/cartesian.fixtures.ts";
import { StepLineChart } from "#step-line-chart/step-line-chart.tsx";

describe("StepLineChart", () => {
  it("renders a line per series", () => {
    laidOut();

    const { container } = render(
      <StepLineChart categoryKey="day" data={ROWS} label="Payouts" series={SERIES} />,
    );

    expect(container.querySelectorAll(".recharts-line-curve")).toHaveLength(2);
  });

  it("renders each value flat until the next point with two segments per step", () => {
    laidOut();

    const { container } = render(
      <StepLineChart categoryKey="day" data={ROWS} label="Payouts" series={SERIES} />,
    );

    expect(pathsOf(container)[0]?.match(/L/gu)).toHaveLength(4);
  });
});
