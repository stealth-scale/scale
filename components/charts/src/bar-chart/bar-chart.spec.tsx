import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BarChart } from "#bar-chart/bar-chart.tsx";
import { barsOf, laidOut, ROWS, SERIES } from "#cartesian/cartesian.fixtures.ts";

describe("BarChart", () => {
  it("renders a bar per series in each category", () => {
    laidOut();

    const { container } = render(
      <BarChart categoryKey="day" data={ROWS} label="Payouts" series={SERIES} />,
    );

    expect(barsOf(container)).toHaveLength(6);
  });

  it("places the series' bars side by side in a category", () => {
    laidOut();

    const { container } = render(
      <BarChart categoryKey="day" data={ROWS} label="Payouts" series={SERIES} />,
    );
    const [paid, , , refunded] = barsOf(container);

    expect(refunded?.x).toBeGreaterThan(paid?.x ?? Number.POSITIVE_INFINITY);
  });
});
