import { describe, expect, it } from "vitest";

import { NORTH, SOUTH } from "#distribution-chart/examples/deliveries.ts";

describe("deliveries", () => {
  it("lists 90 deliveries in North", () => {
    expect(NORTH).toHaveLength(90);
  });

  it("lists 70 deliveries in South", () => {
    expect(SOUTH).toHaveLength(70);
  });
});
