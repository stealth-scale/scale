import { describe, expect, it } from "vitest";

import * as barrel from "#clipboard/index.ts";

describe("index", () => {
  it("names every part and nothing beside it", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Consumer",
      "Control",
      "Indicator",
      "Input",
      "Label",
      "Root",
      "Trigger",
      "ValueText",
    ]);
  });

  it("publishes neither the recipe nor the binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
