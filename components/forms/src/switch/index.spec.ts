import { describe, expect, it } from "vitest";

import * as barrel from "#switch/index.ts";

describe("index", () => {
  it("exports the four parts", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Control", "Label", "Root", "Thumb"]);
  });

  it("exports neither the recipe nor the binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
