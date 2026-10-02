import { describe, expect, it } from "vitest";

import * as barrel from "#clipboard/index.ts";

describe("index", () => {
  it("exports the eight parts and nothing else", () => {
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

  it("exports no recipe or binding helper", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
