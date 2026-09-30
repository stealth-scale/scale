import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { barsOf, laidOut, ROWS, SERIES, ticksOf } from "#cartesian/cartesian.fixtures.ts";
import { PercentStackedBar } from "#percent-stacked-bar/percent-stacked-bar.tsx";

describe("PercentStackedBar", () => {
  it("stacks the series' bars of a category in one column", () => {
    laidOut();

    const { container } = render(
      <PercentStackedBar categoryKey="day" data={ROWS} label="Payouts" series={SERIES} />,
    );
    const [paid, , , refunded] = barsOf(container);

    expect(refunded?.x).toBe(paid?.x);
  });

  it("writes the value ticks as percentages up to 100%", () => {
    laidOut();

    const { container } = render(
      <PercentStackedBar categoryKey="day" data={ROWS} label="Payouts" series={SERIES} />,
    );

    expect(ticksOf(container).at(-1)).toBe("100%");
  });
});
