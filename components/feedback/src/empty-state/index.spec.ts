import { describe, expect, it } from "vitest";

import * as barrel from "#empty-state/index.ts";

describe("index", () => {
  it("exports only the five slot components", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Content",
      "Description",
      "Indicator",
      "Root",
      "Title",
    ]);
  });

  it("omits every export named as a recipe or a context binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
