import { describe, expect, it } from "vitest";

import { type Budget, BUDGETS } from "#data-table/examples/budgets.ts";

/**
 * Returns every cost centre of a set and every centre under it.
 */
function everyOf(budgets: readonly Budget[]): Budget[] {
  return budgets.flatMap((budget) => [budget, ...everyOf(budget.teams ?? [])]);
}

/**
 * Returns the cost centre with the key given, anywhere in the tree.
 */
function centreOf(centre: string): Budget | undefined {
  return everyOf(BUDGETS).find((budget) => budget.centre === centre);
}

describe("budgets", () => {
  it("lists the three departments and the team on its own", () => {
    expect(BUDGETS.map((budget) => budget.centre)).toStrictEqual([
      "engineering",
      "sales",
      "marketing",
      "operations",
    ]);
  });

  it("sums a department's budget from its teams", () => {
    expect(centreOf("platform")?.budget).toBe(600_000);
  });

  it("sums a department's spend from its teams at every level", () => {
    expect(centreOf("engineering")?.spent).toBe(1_133_900);
  });

  it("lists no teams under a team", () => {
    expect(centreOf("operations")?.teams).toBeUndefined();
  });
});
