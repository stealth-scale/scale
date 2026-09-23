import { describe, expect, it } from "vitest";

import * as barrel from "#list/index.ts";

describe("index", () => {
  it("limits its runtime exports to the three parts", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Indicator", "Item", "Root"]);
  });

  it("exports no recipe binding or props provider", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
