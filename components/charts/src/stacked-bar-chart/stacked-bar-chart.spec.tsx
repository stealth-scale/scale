import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { barsOf, laidOut, ROWS, SERIES, ticksOf } from "#cartesian/cartesian.fixtures.ts";
import { StackedBarChart } from "#stacked-bar-chart/stacked-bar-chart.tsx";

describe("StackedBarChart", () => {
  it("stacks the series' bars of a category in one column", () => {
    laidOut();

    const { container } = render(
      <StackedBarChart categoryKey="day" data={ROWS} label="Payouts" series={SERIES} />,
    );
    const [paid, , , refunded] = barsOf(container);

    expect(refunded?.x).toBe(paid?.x);
  });

  it("writes the value ticks as amounts", () => {
    laidOut();

    const { container } = render(
      <StackedBarChart categoryKey="day" data={ROWS} label="Payouts" series={SERIES} />,
    );

    expect(ticksOf(container).at(-1)).not.toContain("%");
  });
});
