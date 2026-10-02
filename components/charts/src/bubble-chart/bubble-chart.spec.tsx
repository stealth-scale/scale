import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BubbleChart, type BubbleChartProps } from "#bubble-chart/bubble-chart.tsx";
import { laidOut } from "#cartesian/cartesian.fixtures.ts";

/**
 * Describes one account: its seats, its weekly active share and its annual revenue.
 */
interface Account {
  readonly active: number;
  readonly arr: number;
  readonly seats: number;
}

/**
 * Lists three accounts, largest first.
 */
const ACCOUNTS: Account[] = [
  { active: 0.66, arr: 216_000, seats: 240 },
  { active: 0.54, arr: 54_000, seats: 60 },
  { active: 0.72, arr: 4800, seats: 8 },
];

/**
 * Renders the accounts with the props a case changes, and returns the container.
 */
function drawn(props: Partial<BubbleChartProps<Account>> = {}): Element {
  laidOut();

  return render(
    <BubbleChart
      label="Weekly active seats by account size"
      locale="en-US"
      series={[{ key: "accounts", label: "Accounts", points: ACCOUNTS }]}
      sizeKey="arr"
      sizeLabel="ARR"
      sizeOptions={{ currency: "EUR", notation: "compact", style: "currency" }}
      xKey="seats"
      xLabel="Seats"
      yKey="active"
      yLabel="Weekly active"
      {...props}
    />,
  ).container;
}

describe("BubbleChart", () => {
  it("sizes each point by its field", () => {
    const paths = [...drawn().querySelectorAll(".recharts-symbols")].map((symbol) =>
      symbol.getAttribute("d"),
    );

    expect(new Set(paths).size).toBe(3);
  });

  it("writes the size beside the two axes' values in the tooltip", () => {
    const container = drawn({ defaultIndex: 0 });

    expect(
      [...container.querySelectorAll(".chart__row")].map((row) => row.textContent),
    ).toStrictEqual(["Seats240", "Weekly active0.66", "ARR€216K"]);
  });
});
