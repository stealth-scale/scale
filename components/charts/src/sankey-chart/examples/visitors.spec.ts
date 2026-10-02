import { describe, expect, it } from "vitest";

import {
  CHECKOUT,
  INCOME,
  LEAKY,
  LINES,
  LOOPED,
  named,
  QUEUE,
  STEPS,
  VISITORS,
} from "#sankey-chart/examples/visitors.ts";
import { flowBalance, sankeyCycles } from "#sankey-chart/flows.ts";

/**
 * Returns a node's balance in a flow graph, by key.
 */
function balanceOf(
  keys: readonly string[],
  flows: Parameters<typeof flowBalance>[1],
  key: string,
): ReturnType<typeof flowBalance>[number] | undefined {
  return flowBalance(named(keys, String), flows).find((node) => node.key === key);
}

describe("visitors", () => {
  it("sends 25900 visitors from the channels", () => {
    expect(
      flowBalance(named(STEPS, String), VISITORS)
        .filter((node) => node.inflow === 0)
        .reduce((sum, node) => sum + node.outflow, 0),
    ).toBe(25_900);
  });

  it("signs up 7000 of them", () => {
    expect(balanceOf(STEPS, VISITORS, "signup")?.inflow).toBe(7000);
  });

  it("subscribes 1500 of them", () => {
    expect(balanceOf(STEPS, VISITORS, "subscribed")?.inflow).toBe(1500);
  });

  it("balances every node that both receives and sends", () => {
    expect(
      flowBalance(named(STEPS, String), VISITORS)
        .filter((node) => node.inflow > 0 && node.outflow > 0)
        .every((node) => node.inflow === node.outflow),
    ).toBe(true);
  });

  it("makes 1500000 of operating profit from 11700000 of revenue", () => {
    expect([
      balanceOf(LINES, INCOME, "revenue")?.inflow,
      balanceOf(LINES, INCOME, "operating")?.inflow,
    ]).toStrictEqual([11_700_000, 1_500_000]);
  });

  it("closes one loop in the checkout", () => {
    expect(sankeyCycles(LOOPED)).toStrictEqual([{ from: "refunded", to: "cart", value: 25 }]);
  });

  it("names every node of the checkout", () => {
    expect(named(CHECKOUT, (key) => key.toUpperCase())[0]).toStrictEqual({
      color: undefined,
      key: "cart",
      label: "CART",
    });
  });

  it("loses 150 tickets in triage", () => {
    const triage = balanceOf(QUEUE, LEAKY, "triage");

    expect((triage?.inflow ?? 0) - (triage?.outflow ?? 0)).toBe(150);
  });

  it("gives a node the palette the map states for its key", () => {
    expect(named(STEPS, String, { organic: "teal" })[0]?.color).toBe("teal");
  });
});
