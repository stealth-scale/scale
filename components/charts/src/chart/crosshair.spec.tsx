import { type ReactNode } from "react";

import { act, fireEvent, render } from "@testing-library/react";
import { ReferenceLine } from "recharts";
import { describe, expect, it } from "vitest";

import { laidOut, type Row, ROWS } from "#cartesian/cartesian.fixtures.ts";
import { type CartesianProps } from "#cartesian/types.ts";
import * as Chart from "#chart/index.ts";
import { HorizontalBarChart } from "#horizontal-bar-chart/index.ts";
import { LineChart } from "#line-chart/index.ts";

/**
 * Renders the payouts as a line chart with the crosshair on the paid series, the props a case
 * changes and any other child, and returns the container.
 */
function guided(props: Partial<CartesianProps<Row>> = {}, child?: ReactNode): Element {
  laidOut();

  return render(
    <LineChart
      categoryKey="day"
      data={ROWS}
      label="Payouts per day"
      series={[{ key: "paid" }, { key: "refunded" }]}
      {...props}
    >
      <Chart.Crosshair dataKey="paid" />
      {child}
    </LineChart>,
  ).container;
}

/**
 * Waits 20ms inside `act`, for recharts to apply a pointer event.
 */
async function settled(): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 20);
    });
  });
}

/**
 * Returns the ends of the crosshair's line, or nothing without one.
 */
function lineOf(container: Element): string[] | undefined {
  const line = container.querySelector(".chart-crosshair line");

  return line === null
    ? undefined
    : ["x1", "y1", "x2", "y2"].map((name) => line.getAttribute(name) ?? "");
}

describe("Crosshair", () => {
  it("runs the guide across the plot at the active row's value", () => {
    const container = guided({ defaultIndex: 1 }, <ReferenceLine className="probe" y={180} />);
    const probe = container.querySelector(".probe line")?.getAttribute("y1");

    expect(lineOf(container)?.filter((_, index) => index % 2 === 1)).toStrictEqual([probe, probe]);
  });

  it("dashes the guide", () => {
    expect(
      guided({ defaultIndex: 1 })
        .querySelector(".chart-crosshair line")
        ?.getAttribute("stroke-dasharray"),
    ).toBe("3 3");
  });

  it("renders no guide while the tooltip is inactive", () => {
    expect(lineOf(guided())).toBeUndefined();
  });

  it("removes the guide when the pointer leaves the chart", async () => {
    const container = guided();
    const wrapper = container.querySelector(".recharts-wrapper") ?? document.body;

    fireEvent.mouseMove(wrapper, { clientX: 240, clientY: 100 });
    await settled();

    const shown = lineOf(container) !== undefined;

    fireEvent.mouseLeave(wrapper);
    await settled();

    expect([shown, lineOf(container)]).toStrictEqual([true, undefined]);
  });

  it("renders no guide while the legend hides the series", () => {
    expect(lineOf(guided({ defaultHiddenKeys: ["paid"], defaultIndex: 1 }))).toBeUndefined();
  });

  it("renders no guide at a row without a finite value", () => {
    const gap = ROWS.map((row, index) => (index === 1 ? { ...row, paid: Number.NaN } : row));

    expect(lineOf(guided({ data: gap, defaultIndex: 1 }))).toBeUndefined();
  });

  it("runs the guide down the plot on bars on their side", () => {
    laidOut();

    const { container } = render(
      <HorizontalBarChart
        categoryKey="day"
        data={ROWS}
        defaultIndex={1}
        label="Payouts per day"
        series={[{ key: "paid" }]}
      >
        <Chart.Crosshair dataKey="paid" />
      </HorizontalBarChart>,
    );
    const [x1, , x2] = lineOf(container) ?? [];

    expect([x1 === undefined, x1 === x2]).toStrictEqual([false, true]);
  });
});
