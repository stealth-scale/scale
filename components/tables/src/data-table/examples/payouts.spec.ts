import { describe, expect, it } from "vitest";

import { PAYOUTS } from "#data-table/examples/payouts.ts";

describe("payouts", () => {
  it("lists five accounts once each", () => {
    expect(new Set(PAYOUTS.map((payout) => payout.account)).size).toBe(5);
  });

  it("pays out in three regions", () => {
    expect(new Set(PAYOUTS.map((payout) => payout.region)).size).toBe(3);
  });

  it("pays out 20451.15 euros in all", () => {
    expect(PAYOUTS.reduce((total, payout) => total + payout.amount, 0)).toBeCloseTo(20_451.15);
  });
});
