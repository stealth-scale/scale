import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("names every component the package publishes and nothing beside them", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Button",
      "ButtonPropsProvider",
      "Clipboard",
      "IconButton",
    ]);
  });

  it("publishes a component with parts as a namespace of its short names", () => {
    expect(Object.keys(barrel.Clipboard).toSorted()).toStrictEqual([
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

  it("publishes neither a recipe nor a binding", () => {
    expect.hasAssertions();

    for (const name of [...Object.keys(barrel), ...Object.keys(barrel.Clipboard)]) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
