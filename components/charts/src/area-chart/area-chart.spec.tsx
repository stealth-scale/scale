import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AreaChart } from "#area-chart/area-chart.tsx";
import { laidOut, pathsOf, ROWS, SERIES } from "#cartesian/cartesian.fixtures.ts";

describe("AreaChart", () => {
  it("fills an area per series with its gradient at full fill opacity", () => {
    laidOut();

    const { container } = render(
      <AreaChart categoryKey="day" data={ROWS} label="Payouts" series={SERIES} />,
    );
    const [paid, refunded] = [...container.querySelectorAll("defs linearGradient")].map(
      (each) => each.id,
    );

    expect(
      [...container.querySelectorAll(".recharts-area-area")].map((area) => [
        area.getAttribute("fill"),
        area.getAttribute("fill-opacity"),
      ]),
    ).toStrictEqual([
      [`url(#${paid ?? "missing"})`, "1"],
      [`url(#${refunded ?? "missing"})`, "1"],
    ]);
  });

  it("smooths each area's edge by default", () => {
    laidOut();

    const { container } = render(
      <AreaChart categoryKey="day" data={ROWS} label="Payouts" series={SERIES} />,
    );

    expect(pathsOf(container)[0]).toContain("C");
  });

  it("renders straight edges when curve is linear", () => {
    laidOut();

    const { container } = render(
      <AreaChart categoryKey="day" curve="linear" data={ROWS} label="Payouts" series={SERIES} />,
    );

    expect(pathsOf(container)[0]).not.toContain("C");
  });
});
