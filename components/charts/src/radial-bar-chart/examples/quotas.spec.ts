import { describe, expect, it } from "vitest";

import { ACTIVITY, OVERRUN, USAGE } from "#radial-bar-chart/examples/quotas.ts";

describe("quotas", () => {
  it("puts storage alone past two thirds of the plan", () => {
    expect(USAGE.filter((share) => share.used > 2 / 3).map((share) => share.key)).toStrictEqual([
      "storage",
    ]);
  });

  it("uses 82% of the plan's storage", () => {
    expect(USAGE[0]?.used).toBe(0.82);
  });

  it("lists every share between 0 and 1", () => {
    expect([...USAGE, ...ACTIVITY].every((share) => share.used >= 0 && share.used <= 1)).toBe(true);
  });

  it("puts storage alone past the quota in the overrun", () => {
    expect(OVERRUN.filter((share) => share.used > 1).map((share) => share.key)).toStrictEqual([
      "storage",
    ]);
  });

  it("uses 114% of the storage quota in the overrun", () => {
    expect(OVERRUN[0]?.used).toBe(1.14);
  });

  it("puts standing highest and exercise lowest of the day's activity", () => {
    expect(
      ACTIVITY.toSorted((first, second) => second.used - first.used).map((share) => share.key),
    ).toStrictEqual(["stand", "move", "exercise"]);
  });
});
