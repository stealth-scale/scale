import { describe, expect, it } from "vitest";

import { ownersOf } from "#scatter-plot/owners.ts";

/**
 * Lists one point of each of two series.
 */
const FIRST = { days: 28, size: 12_000 };
const SECOND = { days: 120, size: 85_000 };

describe("owners", () => {
  it("maps each point to the key of the series that contains it", () => {
    const owners = ownersOf([
      { key: "mid", points: [FIRST] },
      { key: "enterprise", points: [SECOND] },
    ]);

    expect([owners.get(FIRST), owners.get(SECOND)]).toStrictEqual(["mid", "enterprise"]);
  });

  it("finds a point by its identity and not by its fields", () => {
    const owners = ownersOf([{ key: "mid", points: [FIRST] }]);

    expect(owners.get({ ...FIRST })).toBeUndefined();
  });
});
