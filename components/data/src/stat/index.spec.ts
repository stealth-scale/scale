import { describe, expect, it } from "vitest";

import * as barrel from "#stat/index.ts";

describe("index", () => {
  it("exports the six parts and no other runtime name", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "HelpText",
      "Indicator",
      "Label",
      "Root",
      "ValueText",
      "ValueUnit",
    ]);
  });
});
