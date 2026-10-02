import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { barsOf, laidOut, ROWS, SERIES } from "#cartesian/cartesian.fixtures.ts";
import { HorizontalBarChart } from "#horizontal-bar-chart/horizontal-bar-chart.tsx";

describe("HorizontalBarChart", () => {
  it("renders a bar per series in each category", () => {
    laidOut();

    const { container } = render(
      <HorizontalBarChart categoryKey="day" data={ROWS} label="Payouts" series={SERIES} />,
    );

    expect(barsOf(container)).toHaveLength(6);
  });

  it("measures each bar's value along its width", () => {
    laidOut();

    const { container } = render(
      <HorizontalBarChart categoryKey="day" data={ROWS} label="Payouts" series={SERIES} />,
    );
    const [monday, tuesday] = barsOf(container);

    expect([monday?.height === tuesday?.height, monday?.width === tuesday?.width]).toStrictEqual([
      true,
      false,
    ]);
  });
});
