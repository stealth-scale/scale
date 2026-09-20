import { describe, expect, it } from "vitest";

import * as barrel from "#collection/index.ts";

describe("index", () => {
  it("names the three hooks that hold and narrow a list's rows", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "useFilter",
      "useGridCollection",
      "useListCollection",
    ]);
  });

  it("publishes neither a recipe nor a binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with)/u);
    }
  });
});
