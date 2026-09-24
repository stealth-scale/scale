import { describe, expect, it } from "vitest";

import * as barrel from "#checkbox/index.ts";

describe("index", () => {
  it("exports the four parts", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Control", "Indicator", "Label", "Root"]);
  });

  it("exports no recipe binding or hook", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
