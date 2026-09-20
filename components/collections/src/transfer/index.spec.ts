import { describe, expect, it } from "vitest";

import * as barrel from "#transfer/index.ts";

describe("index", () => {
  it("names the one component a caller draws", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Transfer"]);
  });

  it("publishes neither the recipe nor the binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
